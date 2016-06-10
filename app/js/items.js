/**
 * Created by cedric on 22/04/16.
 */
function Items(io) {
    var items = [],//item { id, source, text, description }
        users = [];//user { name, photo, id(google), connectionIds([socket.io]) }

    function sendUsers() {
        console.log('users : ' + JSON.stringify(users));
        io.emit('users changed', users);
    }

    io.on('connection', function (socket) {
        io.emit('send items', items);

        socket.on('disconnect', function(){
            //remove user with socket.id from the list
            var user = users.getByProperty('connectionIds', socket.id);
            if (user) {
                console.log('user disconnected : ' + socket.id);
                var connectionIndex = user.connectionIds.indexOf(socket.id);
                user.connectionIds.splice(connectionIndex, 1);
                if (user.connectionIds.length === 0) {
                    var index = users.indexOf(user);
                    users.splice(index, 1);
                }
                sendUsers();
            }
        });

        socket.on('user connected', function(user){
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
            incrementPosition(items, 0);
            //prepare remaining datas - will change when database ok
            prepareItem(item);
            //push item at position 0
            items.push(item);
            console.info('[INFO] - new item added ');
            console.info( JSON.stringify( items ) );
            //warn connected users
            io.emit('send items', items);
        });

        socket.on('item updated', function(item){
            var change = items.getById(item.id);
            if (change) {
                change.description = item.description;
                io.emit('send items', items);
                console.log('[INFO] - item updated with id : ' + item.id);
            }
        });

        socket.on('item positioned', function(move){
            //invert based on position , should be usefull with drag & drop
            var temp = getItem(move.to), item = getItem(move.from);
            if (temp && item) {
                item.position = move.to; temp.position = move.from;
                //log
                console.log('[INFO] - move item position from : ' + move.from + ' to : ' + move.to);
                io.emit('send items', items);
            }
        });

        socket.on('item deleted', function(itemId){
            var index = 0;
            for (var i = 0; i < items.length; i++) {
                var temp = items[i];
                if (temp.id === itemId) {
                    items.splice(i, 1);
                    index = temp.position;
                    io.emit('send items', items);
                    console.log('[INFO] - item deleted with id : ' + itemId);
                }
            }

            for(var j = 0; j < items.length; j++){
                if (items[j].position >= index)
                    items[j].position --;
            }
        });

        socket.on('item affected', function (data) {
            var change = items.getById(data.id);
            if (change) {
               if (change.affectedUser == null)
                    change.affectedUser = [];
                var found = false; 
                var i;   
                for(i = 0; i < change.affectedUser.length; i++)
                {
                    if (change.affectedUser[i].id == data.user.id)
                    {
                       found = true;
                       break;
                    }
                }    
                if (!found)    
                    change.affectedUser.push(data.user);
                else
                    window.alert('Vous êtes déjà affecté(e)');
                
                io.emit('send items', items);
                console.log('[INFO] - item affected with id : ' + data.id + ' by ' + data.user.name);
            }
        });

        socket.on('item unaffected', function (idChange, idUser) {
            var change = items.getById(idChange);
            if (change) {
                var user = change.affectedUser.getById(idUser);
                var i = change.affectedUser.indexOf(user);
                if(i != -1) {
                    change.affectedUser.splice(i, 1);
                }
                io.emit('send items', items);
                console.log('[INFO] - item unaffected with id : ' + idChange);
            }
        });

    });

    //prepare item to add on list
    function prepareItem(item){
        //generate id
        item.id = Guid();
        item.position = 0;
        item.affectedUser = null;
    }
    //increment position index
    function incrementPosition(elements, index) {
        //move all items position +1
        for (var i = 0; i < elements.length; i++){
            if (elements[i].position >= index)
                elements[i].position++;
        }
    }
    //should change accessing db with mongoose
    //extract item from list using position
    function getItem(position) {
        for(var i = 0; i < items.length; i++){
            if (items[i].position === position) return items[i];
        }
        console.log('[WARN] - item not found with position : ', position);
        return null;
    }
    //extract item from list using id
    function getById(id) {
        for(var i = 0; i < this.length; i++){
            if (this[i].id === id) return this[i];
        }
        return null;
    }
    function getByProperty(key, value){
        for(var i = 0; i < this.length; i++){
            if (!this[i].hasOwnProperty(key)) {
                console.error('invalid property : ' + key + ' for object : ' + typeof this[i]);
                return null;
            }
            if (this[i][key].indexOf(value) != -1)
                return this[i];
        }
        return null;
    }

    Array.prototype.getByProperty = getByProperty;
    Array.prototype.getById = getById;

    //generating an id
    function Guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}

module.exports = Items;