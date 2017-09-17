const socket = io();

new Vue({
    el: '#mainApp',
    data: {
        socketIO: socket,
        title: '',
        source: '',
        description: '',
        sprint: ''
    },
    methods: {
        save: function () {
            if (!this.title || !this.source) {
                alert('vous devez saisir un ticket et un titre');
                return;
            }
            //save
            const newItem = {
                text: this.title,
                description: this.description,
                source: this.source
            };
            socket.emit('item create', newItem);

            this.title = '';
            this.source = '';
            this.description = '';
        },
        createSprint: function () {
            if (!this.sprint) {
                alert('vous devez saisir un nom pour le sprint');
                return;
            }
            if (confirm('Etes-vous certain de vouloir clore le sprint? Cette action est irréversible.')) {
                let data = {name: this.sprint};
                socket.emit('create archive', data);
                this.sprint = '';
            }
        }

    }
});

