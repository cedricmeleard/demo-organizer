/**
 * Created by CMeleard on 09/05/2016.
 */
(function() {
    'use strict';
    var socket = io();

    function Creator() {
        var self = this;
        //load user from input and set it to model
        self.user = ko.observable(JSON.parse($("#usrInfo").val()));
        socket.emit('user connected', ko.toJS(self.user));

        self.title = ko.observable('');
        self.source = ko.observable('');
        self.description = ko.observable('');


        self.disconnect = function () {
            window.location = '/login#';
        }

        self.save = function () {

            var temp = ko.toJS(self);
            if (!temp.title || !temp.source) {
                alert('vous devez saisir un ticket et un titre');
                return;
            }
            //save
            var newItem = {
                text : temp.title,
                description : temp.description,
                source : temp.source
            };
            socket.emit('item create', newItem);

            raz();
        }

        function raz(){
            self.title('');
            self.source('');
            self.description('');
        }
    }

    ko.applyBindings(new Creator());
})();