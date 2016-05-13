/**
 * Created by CMeleard on 13/05/2016.
 */
(function () {
    'use strict';
    var socket = io();

    function Print() {
        var self = this;
        socket.emit('connect');

        self.items = ko.observableArray();
        self.tickets = ko.computed(function () {
            var tickets = self.items.sort(
                function (left, right) {
                    return left.position == right.position ? 0 : (left.position < right.position ? -1 : 1)
                });
            return tickets();
        });

        socket.on('send items', function (items) {
            self.items.removeAll();
            var datas = {items: items};
            ko.mapping.fromJS(datas, {}, self);
        });
    }

    ko.components.register('readonly-item', {
        viewModel: function (params) {
            var self = this;
            self.item = params.item;

            self.title = ko.computed(function () {
                return self.item.source() + ' - ' + self.item.text();
            });
        },
        template: '<h2>' +
        '<span class="content__content-title" data-bind="text : title"></span>' +
        '</h2>' +
        '<div class="content__form-group">' +
        '<div class="form-control" data-bind="text : item.description"></div>' +
        '<div class="user">' +
        '<!-- ko with: item.affectedUser-->' +
        '<img class="user-img" data-bind="attr : { src: photo }" />' +
        '<label class="user-name" data-bind="text : name" ></label>' +
        '<!-- /ko -->' +
        '</div>'
    });

    ko.applyBindings(new Print());
})();
