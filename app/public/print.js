const socket = io();

const app = new Vue({
    el: '#organizerContainer',
    data: {
        search: '',
        items: []
    },
    computed: {
        tickets: function () {
            if (!this.search) return this.items;
            return this.items.filter(item => {
                return item.source.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) !== -1;
            });
        },
    },
    methods: {
        print: function () {
            window.print();
        },
        init: function () {
            socket.emit('connect');

        }
    }
});

socket.on('send items', data => {
    app.items = data;
});

app.init();
