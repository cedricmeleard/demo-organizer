/**
 * Created by CMeleard on 09/05/2016.
 */
(function() {
    'use strict';
    var socket = io();

    function Creator() {
        var self = this;
        socket.emit('connect');

        self.title = ko.observable('');
        self.source = ko.observable('');
        self.description = ko.observable('');


        self.save = function () {

            var temp = ko.toJS(self);
            if (!temp.title || !temp.source) {
                alert('vous devez saisir un tiecket et un titre');
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