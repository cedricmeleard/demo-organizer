/**
 * Created by cedric on 22/04/16.
 */
//(function(){
    'use strict';
    var socket = io();

    function Organizer() {
        var self = this;
        //load user from input and set it to model
        self.user = ko.observable( JSON.parse( $("#usrInfo").val() ) );

        socket.emit('connect');

        self.items = ko.observableArray();
        self.tickets = ko.computed(function () {
            var tickets = self.items.sort(
                function (left, right) {
                    return left.position == right.position ? 0 : (left.position < right.position ? -1 : 1)
                });
            return tickets();
        });
        self.moveUp = function(data){
            if (data.position == 0) return;
            var move = { from : data.position, to : data.position - 1 };

            socket.emit('item positioned', move);
        }
        self.moveDown = function(data){
            if (data.position == self.items().length - 1) return;
            var move = { from : data.position, to : data.position + 1 };

            socket.emit('item positioned', move);
        }
        self.delete = function(data){
            socket.emit('item deleted', data.id);
        }
        self.affect = function (data) {
            var sendData = {
                id : data.id,
                user: ko.toJS(self.user)
            }
            socket.emit('item affected', sendData);
        }
        self.unAffect = function (data) {
            socket.emit('item unaffected', data.id);
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

    ko.applyBindings(new Organizer());
//})();