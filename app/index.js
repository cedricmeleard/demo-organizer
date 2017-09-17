const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(path.join(__dirname, 'public')));

//initiate markdown plugin
const markdown = require('markdown-it')();
//init connection to mongo db
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/demo-organizer');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    const Item = require('./js/models')(mongoose);
    //start app
    require('./js/items')(io, markdown, Item);
    require('./js/route')(app);

});

//START SERVER
http.listen(81, function () {
    console.log('listening on *:81');
});