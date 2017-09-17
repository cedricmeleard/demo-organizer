function Items(io, markdown, Models) {
    const Item = Models.Item, Sprint = Models.Sprint;
    //connected users, not persisted
    const users = [];//user { name, photo, id(google), connectionIds([socket.io]) }

    io.on('connection', socket => {
        //retrieve all items first
        sendItems();
        sendSprints();

        console.log('user connection start');

        socket.on('disconnect', () => {
            //remove user with socket.id from the list
            const user = users.getByProperty('connectionIds', socket.id);
            if (user) {
                const connectionIndex = user.connectionIds.indexOf(socket.id);
                user.connectionIds.splice(connectionIndex, 1);
                if (user.connectionIds.length === 0) {
                    const index = users.indexOf(user);
                    users.splice(index, 1);
                }
                sendUsers();
            }
        });

        socket.on('user connected', user => {
            let exists = users.getById(user.id);
            if (!exists) {
                users.push(user);
                exists = user;
            }
            //create tabs if not exist
            if (!exists.connectionIds) exists.connectionIds = [];
            exists.connectionIds.push(socket.id);

            sendUsers();
        });

        socket.on('item create', item => {
            //change others item position, our new item will be positioned on first place
            incrementPosition(0);
            //prepare remaining data - will change when database ok
            prepareItem(item);

            saveItem(item, sendItems);
        });

        socket.on('item updated', item => {
            Item.findById(item._id, (err, change) => {
                if (err) console.error(err);

                change.description = item.description;
                change.markedown = getMarkDown(item.description);

                updateItem(change, sendItems);
            });
        });

        socket.on('item positioned', move => {

            Item.findOne({position: move.to}, (err, temp) => {
                if (err) console.error(err);

                Item.findOne({position: move.from}, (err, item) => {
                    if (err) console.error(err);
                    //invert position
                    if (temp && item) {
                        item.position = move.to;
                        temp.position = move.from;

                        item.save(() => {
                            temp.save(sendItems);
                        });
                    }
                });
            });
        });

        socket.on('item deleted', itemId => {
            deleteItem(itemId, sendItems);
        });

        socket.on('item affected', data => {
            Item.findById(data._id,
                (err, change) => {
                    if (err) console.log(err);

                    if (change.affected === null)
                        change.affected = [];

                    let found = false;
                    for (let i = 0; i < change.affected.length; i++) {
                        if (change.affected[i].id === data.user.id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        change.affected.push(data.user);

                    updateItem(change, sendItems);
                });
        });

        socket.on('item unaffected', (itemId, idUser) => {
            Item.findById(itemId, (err, change) => {
                if (err) console.error(err);

                const user = change.affected.getById(idUser);
                const i = change.affected.indexOf(user);
                if (i !== -1) {
                    change.affected.splice(i, 1);
                }
                updateItem(change, sendItems);
            });
        });

        socket.on('create archive', data => {
            //data { name : 'sprint name' }
            new Sprint({name: data.name})
                .save().then(saved => {
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

        socket.on('load archive', sprintId => {
            Item.find({sprint: sprintId})
                .sort('position')
                .exec((err, items) => {
                    if (err) console.error(err);
                    io.emit('send archive', items);
                });
        });
    });

    function saveItem(item, callback) {
        const mongoItem = new Item(
            {
                source: item.source,
                text: item.text,
                description: item.description,
                position: item.position
            });

        mongoItem.save(err => {
            if (err) console.error(err);
            if (callback) callback();
        });
    }

    function updateItem(item, callback) {
        Item.findById(item._id, (err, doc) => {
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
        Item.findById({'_id': itemId}).then(item => {
            Item.update(
                {position: {$gt: item.position}},
                {$inc: {position: -1}},
                {multi: true},
                err => {
                    if (err) console.error(err);

                    if (callback) callback();
                });
        }).then(
            Item.remove({'_id': itemId})
                .then(console.log('removing'))
        );
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
        Item.find((err, elements) => {
            //move all items position +1
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].position >= index) {
                    elements[i].position++;
                    elements[i].save();
                }
            }
        });
    }

    //extract item from list using id
    function getById(id) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].id === id) return this[i];
        }
        return null;
    }

    //extract item from list using any unique value
    function getByProperty(key, value) {

        for (let i = 0; i < this.length; i++) {
            if (!this[i].hasOwnProperty(key)) {
                console.warn('invalid property : ' + key + ' for object : ' + typeof this[i]);
                continue;
            }
            if (this[i][key].indexOf(value) !== -1)
                return this[i];
        }
        return null;
    }

    Array.prototype.getByProperty = getByProperty;
    Array.prototype.getById = getById;

}

module.exports = Items;