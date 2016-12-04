/**
 * Created by cedric on 22/04/16.
 */
(function () {
    'use strict';
    var socket = io();

    function Organizer() {
        var self = this;
        //load user from input and set it to model
        self.user = ko.observable(JSON.parse($("#usrInfo").val()));

        socket.emit('user connected', ko.toJS(self.user) );

        self.items = ko.observableArray();

        self.moveUp = function (data) {
            if (data.position == 0) return;
            var move = {from: data.position, to: data.position - 1};

            socket.emit('item positioned', move);
        };
        self.moveDown = function (data) {
            if (data.position == self.items().length - 1) return;
            var move = {from: data.position, to: data.position + 1};

            socket.emit('item positioned', move);
        };
        self.delete = function (data) {
            socket.emit('item deleted', data._id);
        };

        self.affect = function (data) {
            socket.emit('item affected', data);
        };
        self.unAffect = function (dataId, idUser) {
            socket.emit('item unaffected', dataId, idUser);
        };

        self.disconnect = function () {
            window.location = '/login#';
        };

        socket.on('send items', function (items) {
            self.items.removeAll();
            var datas = {items: items};

            var mapper = {
                'items': {
                    create: function (options) {
                        var elt = options.data;
                        //add extend query when change behavior
                        elt.description = ko.observable(elt.description)
                            .extend({itemChange: elt});
                        return elt;
                    }
                }
            };
            ko.mapping.fromJS(datas, mapper, self);
        });
    }

    //monitor change - emit to server
    ko.extenders.itemChange = function (target, option) {
        target.subscribe(function (newValue) {
            socket.emit('item updated', ko.toJS(option));
        });
        return target;
    };

    ko.applyBindings(new Organizer());
})();