/**
 * Created by cedric on 22/04/16.
 */
function Items(io, markdown, Models) {
    var Item = Models.Item, Sprint = Models.Sprint;
    //connected users, not persisted
    var users = [];//user { name, photo, id(google), connectionIds([socket.io]) }

    io.on('connection', function (socket) {
        //retrieve all items first
        sendItems();
        sendSprints();

        console.log('user connection start');

        socket.on('disconnect', function () {
            //remove user with socket.id from the list
            var user = users.getByProperty('connectionIds', socket.id);
            if (user) {
                var connectionIndex = user.connectionIds.indexOf(socket.id);
                user.connectionIds.splice(connectionIndex, 1);
                if (user.connectionIds.length === 0) {
                    var index = users.indexOf(user);
                    users.splice(index, 1);
                }
                sendUsers();
            }
        });

        socket.on('user connected', function (user) {
            var exists = users.getById(user.id);
            if (!exists) {
                users.push(user);
                exists = user;
            }
            //create tabs if not exist
            if (!exists.connectionIds) exists.connectionIds = [];
            exists.connectionIds.push(socket.id);

            sendUsers();
        });

        socket.on('item create', function (item) {
            //change others item position, our new item will be positionned on first place
            incrementPosition(0);
            //prepare remaining datas - will change when database ok
            prepareItem(item);

            saveItem(item, sendItems);
        });

        socket.on('item updated', function (item) {
            Item.findById(item._id, function (err, change) {
                if (err) console.error(err);

                change.description = item.description;
                change.markedown = getMarkDown(item.description);

                updateItem(change, sendItems);
            });
        });

        socket.on('item positioned', function (move) {

            Item.findOne({position: move.to}, function (err, temp) {
                if (err) console.error(err);

                Item.findOne({position: move.from}, function (err, item) {
                    if (err) console.error(err);
                    //invert position
                    if (temp && item) {
                        item.position = move.to;
                        temp.position = move.from;

                        item.save(function () {
                            temp.save(sendItems);
                        });
                    }
                });
            });
        });

        socket.on('item deleted', function (itemId) {
            deleteItem(itemId, sendItems);
        });

        socket.on('item affected', function (data) {
            Item.findById(data._id,
                function (err, change) {
                    if (err) console.log(err);

                    if (change.affected == null)
                        change.affected = [];
                    var found = false;
                    var i;
                    for (i = 0; i < change.affected.length; i++) {
                        if (change.affected[i].id == data.user.id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        change.affected.push(data.user);

                    updateItem(change, sendItems);
                });
        });

        socket.on('item unaffected', function (itemId, idUser) {
            Item.findById(itemId, function (err, change) {
                if (err) console.error(err);

                var user = change.affected.getById(idUser);
                var i = change.affected.indexOf(user);
                if (i != -1) {
                    change.affected.splice(i, 1);
                }
                updateItem(change, sendItems);
            });
        });

        socket.on('create archive', function (data) {
            //data { name : 'sprint name' }
            new Sprint({name: data.name})
                .save().then(function (saved) {
                Item.update(
                    {sprint: null},
                    {sprint: saved._id},
                    {multi: true},
                    (err) => {
                        if (err)
                            console.log(err);
                        sendItems();
                    });
            });
        });

        socket.on('load archive', function (sprintId) {
            Item.find({sprint: sprintId})
                .sort('position')
                .exec((err, items) => {
                    if (err) console.error(err);
                    io.emit('send archive', items);
                });
        });
    });
    
    function saveItem(item, callback) {
        var mongoItem = new Item(
            {
                source: item.source,
                text: item.text,
                description: item.description,
                position: item.position
            });

        mongoItem.save(function (err) {
            if (err) console.error(err);
            if (callback) callback();
        });
    }

    function updateItem(item, callback) {
        Item.findById(item._id, function (err, doc) {
            if (err) console.error(err);

            //prepare and update
            doc.source = item.source;
            doc.text = item.text;
            doc.description = item.description;
            doc.position = item.position;
            doc.affected = item.affected;
            doc.markdown = getMarkDown(item.description);

            doc.save(callback);
        });
    }

    function deleteItem(itemId, callback) {
        Item.findById({'_id': itemId}).then(function (item) {
            Item.update(
                {position: {$gt: item.position}},
                {$inc: {position: -1}},
                {multi: true},
                function (err) {
                    if (err) console.error(err);

                    if (callback) callback();
                });
        }).then(function () {
            Item.remove({'_id': itemId})
                .then(function (item) {
                    console.log('removing');

                });
        });
    }

    function sendItems() {
        //working on not linked items
        Item.find({sprint: null})
            .sort('position')
            .exec((err, items) => {
            if (err) return console.error(err);
                io.emit('send items', items);
        });
    }

    function sendSprints() {
        Sprint.find()
            .sort('name')
            .exec((err, sprints) => {
                if (err) console.error(err);

                io.emit('load sprints', sprints);
            });
    }

    function sendUsers() {
        //console.log('users : ' + JSON.stringify(users));
        io.emit('users changed', users);
    }

    function getMarkDown(text) {
        return markdown.render(text);
    }

    //prepare item to add on list
    function prepareItem(item) {
        //generate id
        item.position = 0;
        item.affected = null;
        item.markedown = getMarkDown(item.description);
    }

    //increment position index
    function incrementPosition(index) {
        Item.find(function (err, elements) {
            //move all items position +1
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].position >= index) {
                    elements[i].position++;
                    elements[i].save();
                }
            }
        });
    }

    //extract item from list using id
    function getById(id) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].id === id) return this[i];
        }
        return null;
    }

    //extract item from list using any unique value
    function getByProperty(key, value) {

        for (var i = 0; i < this.length; i++) {
            if (!this[i].hasOwnProperty(key)) {
                console.warn('invalid property : ' + key + ' for object : ' + typeof this[i]);
                continue;
            }
            if (this[i][key].indexOf(value) != -1)
                return this[i];
        }
        return null;
    }

    Array.prototype.getByProperty = getByProperty;
    Array.prototype.getById = getById;

}

module.exports = Items;