/**
 * Created by CMeleard on 20/05/2016.
 */
(function () {
    'use strict';
    var socket = io();

    function Users() {
        var self = this;
        socket.emit('connect');
        //load user from input and set it to model
        self.user = ko.observable(JSON.parse($("#usrInfo").val()));
        self.users = ko.observableArray([]);

        socket.emit('user connected', ko.toJS(self.user));

        self.disconnect = function () {
            window.location = '/login#';
        }

        socket.on('users changed', function (items) {
            self.users.removeAll();
            self.users(items);
        });
    }

    ko.components.register('user-item', {
        template: '<div class="user">' +
            '<img class="user-img" data-bind="attr : { src: user.photo }" />' +
            '<label class="user-name" data-bind="text : user.name" ></label>' +
        '</div>'
    });

    ko.applyBindings(new Users());
})();
