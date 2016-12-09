var socket = io();

var app = new Vue({
    el: '#organizerContainer',
    data: {
        socketIO: socket,
        search: '',
        items: [],
        sprints: [],
        currentSprint: '',
    },
    computed: {
        tickets: function () {
            if (!this.search) return this.items;

            return this.items.filter(item => {
                return item.source.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) != -1;
            });
        },
    },
    methods: {
        print: function () {
            window.print();
        },
        load: function () {
            socket.emit('load archive', this.currentSprint);
        },
        init: function () {
            socket.emit('connect');
        }
    }
});

app.init();
socket.on('send archive', function (datas) {
    app.items = datas;
});
socket.on('load sprints', function (datas) {
    app.sprints = datas;
});