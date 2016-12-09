var socket = io();

var app = new Vue({
    el: '#organizerContainer',
    data: {
        socketIO: socket,
        users: []
    },
    methods: {
        init: function () {
            socket.emit('connect');
        }
    }
});

socket.on('users changed', function (items) {
    app.users = items;
});

app.init();