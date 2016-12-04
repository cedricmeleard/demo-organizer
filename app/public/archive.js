/**
 * Created by cedric on 16/09/16.
 */

(function () {
    'use strict';
    var socket = io();

    function Archive() {
        var self = this;

        //load user from input and set it to model
        self.user = ko.observable(JSON.parse($("#usrInfo").val()));
        socket.emit('user connected', ko.toJS(self.user));

        self.disconnect = function () {
            window.location = '/login#';
        }


        self.sprints = ko.observableArray();
        self.currentSprint = ko.observable();

        self.search = ko.observable('');
        self.items = ko.observableArray();

        self.tickets = ko.computed(function () {
            var sourceId = self.search();
            if (!sourceId) return self.items();

            return ko.utils.arrayFilter(self.items(), function (item) {
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
