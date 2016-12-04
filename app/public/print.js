/**
 * Created by CMeleard on 13/05/2016.
 */
var socket = io();

class Print {
    constructor() {
        //observable
        this.search = ko.observable('');
        this.items = ko.observableArray();
        //computed
        this.tickets = ko.computed(() => {
            let sourceId = this.search();
            if (!sourceId) return this.items();

            return ko.utils.arrayFilter(this.items(), (item) => {
                return item.source().indexOf(sourceId) != -1;
            });
        });

        //socket io
        socket.emit('connect');
        socket.on('send items', (items) => {
            this.items.removeAll();
            ko.mapping.fromJS(items, {}, this.items);
        });

        this.print = () => {
            window.print();
        };
    }
}

ko.applyBindings(new Print());
