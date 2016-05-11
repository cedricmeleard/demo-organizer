/**
 * Created by CMeleard on 22/04/2016.
 */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app
require('./js/items')(io);
require('./js/route')(app);
//load public
app.use(express.static(path.join(__dirname, 'public')));

http.listen(81, function () {
    console.log('listening on *:81');
});
