const socket = io();
const app = new Vue({
    el: "#organizerContainer",
    data: {
        items: [],
        socketIO: socket
    },
    computed: {
        currentLength: function () {
            return this.items.length;
        }
    },
    methods: {
        init: function () {
            socket.emit('connect');
        }
    }
});

socket.on('send items', datas => {
    app.items = datas;
});

app.init();