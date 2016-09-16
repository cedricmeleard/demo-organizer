/**
 * Created by cedric on 16/09/16.
 */

(function () {
    'use strict';
    var socket = io();

    function Archive() {
        var self = this;
        socket.emit('connect');

        self.sprints = ko.observableArray();
        self.currentSprint = ko.observable();

        self.search = ko.observable('');
        self.items = ko.observableArray();

        self.tickets = ko.computed(function () {
            var tickets = self.items.sort(
                function (left, right) {
                    return left.position() == right.position() ? 0 : (left.position() < right.position() ? -1 : 1)
                });
            var sourceId = self.search();
            return ko.utils.arrayFilter(tickets(), function (item) {
                if (!sourceId) return tickets();

                return item.source().indexOf(sourceId) != -1;
            });
        });

        socket.on('send archive', function (items) {
            self.items.removeAll();
            var datas = {items: items};
            ko.mapping.fromJS(datas, {}, self);
        });

        socket.on('load sprints', function (sprints) {
            self.sprints(sprints);
        });

        self.print = function () {
            window.print();
        }

        self.load = function () {
            socket.emit('load archive', self.currentSprint());
        }
    }

    ko.applyBindings(new Archive());
})();
