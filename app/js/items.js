/**
 * Created by cedric on 22/04/16.
 */
function Items(io) {
    var items = [];

    io.on('connection', function (socket) {
        io.emit('send items', items);

        socket.on('item create', function (item) {
            //move all items position +1
            for (var i = 0; i < items.length; i++){
                items[i].position++;
            }
            //generate id
            item.id = Guid();
            item.position = 0;
            item.affectedUser = null;

            //push item at position 0
            console.log('[INFO] - new item added');
            items.push(item);
            console.log( JSON.stringify( items ) );

            io.emit('send items', items);
        });

        socket.on('item updated', function(item){
            var change = getById(item.id);
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
            var change = getById(data.id);
            if (change) {
                change.affectedUser = data.user;
                io.emit('send items', items);
                console.log('[INFO] - item affected with id : ' + data.id + ' by ' + data.user.name);
            }
        });

        socket.on('item unaffected', function (id) {
            var change = getById(id);
            if (change) {
                change.affectedUser = null;
                io.emit('send items', items);
                console.log('[INFO] - item unaffected with id : ' + id);
            }
        });
        
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
            for(var i = 0; i < items.length; i++){
                if (items[i].id === id) return items[i];
            }
            console.log('[WARN] item not found for id : ' + id);
        }
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
    });

}

module.exports = Items;
