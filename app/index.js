/**
 * Created by CMeleard on 22/04/2016.
 */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//initiate mongo connexion
var markdown = require('markdown-it')();
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
//initiate markdown plugin
//init connecion to mongo db
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/demo-organizer');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    var Item = require('./js/models')(mongoose);
    //start app
    require('./js/items')(io, markdown, Item);
    require('./js/route')(app);

});

//START SERVER
http.listen(5000, function () {
    console.log('listening on *:5000');
});