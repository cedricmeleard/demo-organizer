/**
 * Created by cedric on 22/04/16.
 */
(function () {
    'use strict';
    var socket = io();

    function Organizer() {
        var self = this;
        socket.emit('connect');
        //load user from input and set it to model
        self.user = ko.observable(JSON.parse($("#usrInfo").val()));

        self.items = ko.observableArray();
        self.tickets = ko.computed(function () {
            var tickets = self.items.sort(
                function (left, right) {
                    return left.position == right.position ? 0 : (left.position < right.position ? -1 : 1)
                });
            return tickets();
        });
        self.moveUp = function (data) {
            if (data.position == 0) return;
            var move = {from: data.position, to: data.position - 1};

            socket.emit('item positioned', move);
        }
        self.moveDown = function (data) {
            if (data.position == self.items().length - 1) return;
            var move = {from: data.position, to: data.position + 1};

            socket.emit('item positioned', move);
        }
        self.delete = function (data) {
            socket.emit('item deleted', data.id);
        }

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

    function ItemDemoViewModel(params) {
        var self = this;
        self.item = params.item;
        self.user = params.user;

        self.title = ko.computed(function () {
            return self.item.source + ' - ' + self.item.text;
        });

        self.affect = function () {
            var sendData = {
                id: self.item.id,
                user: ko.toJS(self.user)
            }
            socket.emit('item affected', sendData);
        }
        self.unAffect = function () {
            socket.emit('item unaffected', self.item.id);
        }
    }

    ko.components.register('item-demo', {
        viewModel: ItemDemoViewModel,
        template: '<h2>' +
        '<span class="content__content-title" data-bind="text : title"></span>' +
        '</h2>' +
        '<div class="content__form-group">' +
        '<textarea class="form-control" rows="4" placeholder="Entrer la description" data-bind="value : item.description"></textarea>' +
        '</div>' +
        '<!-- ko ifnot: item.affectedUser -->' +
        '<button type="button" data-bind="click : affect">' +
        '<i class="material-icons">thumb_up</i>' +
        '</button>' +
        '<!-- /ko -->' +
        '<!-- ko if: item.affectedUser -->' +
        '<div class="user">' +
        '<!-- ko with: item.affectedUser-->' +
        '<img class="user-img" data-bind="attr : { src: photo }" />' +
        '<label class="user-name" data-bind="text : name" ></label>' +
        '<!-- /ko -->' +
        '<button type="button" data-bind="click : unAffect">' +
        '<i class="material-icons">delete</i>' +
        '</button>' +
        '</div>' +
        '<!-- /ko -->'
    });

    ko.applyBindings(new Organizer());
})();