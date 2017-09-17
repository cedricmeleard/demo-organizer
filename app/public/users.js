const socket = io();
const app = new Vue({
    el: '#organizerContainer',
    data: {
        socketIO: socket,
        users: []
    },
    methods: {
        init: () => socket.emit('connect')
    }
});
socket.on('users changed', items => app.users = items);
app.init();