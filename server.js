/*! *//*!
 * bottle-o-messages v1.0.0 - "Sogeking no shima deeeeeee - One Piece"
 * ~~~~~~~~~~~~~~~~~~
 *
 * Run it in command line:
 * node server.js
 *
 * ~~~~~~~~~~~~~~~~~~
 * Copyright 2015 Achraf Chouk <achrafchouk@gmail.com>
 */

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);


// ~~~~~ configuration

// default assets folder
app.use(require('express').static(__dirname + '/public'));

// JADE template engine configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
/*app.set('view options', {
    layout: false
});*/

/*app.use(bodyparser.urlencoded({
    extended: false
}));
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

if ('development' == app.get('env')) {
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}
else if ('production' == app.get('env')) {
    app.use(errorhandler());
}*/


// ~~~~~ vars and functions

var getRandom = function (){
    return Math.round((Math.random() * 1000000));
};

var users = [
        {
            "name": "AchUno",
            "used": 0,
            "id": getRandom(),
        },
        {
            "name": "AchDos",
            "used": 0,
            "id": getRandom(),
        },
        {
            "name": "AchTres",
            "used": 0,
            "id": getRandom(),
        },
        {
            "name": "AchCuatro",
            "used": 0,
            "id": getRandom(),
        },
        {
            "name": "AchCinco",
            "used": 0,
            "id": getRandom(),
        },
        {
            "name": "AchSeis",
            "used": 0,
            "id": getRandom(),
        },
    ],
    currentId = 0;

var getCurrentUser = function (){
        if (!currentId) {
            currentId = Math.floor(Math.random() * 6);
            users[currentId].used = 1;
        }

        for (i in users) {
            if (1 == users[i].used) {
                return i;
            }
        }

        return 0;
    },
    getMessage = function (msg){
        if ('development' === app.get('env')) {
            console.log(msg);
        }
    },
    getUserName = function (userid){
        for (i in users) {
            if (userid == users[i].id) {
                return users[i].name;
            }
        }

        return false;
    },
    renderIndex = function (res){
        var current = getCurrentUser();
        res.render('index', {title:'ReactJS and Socket.IO chat application', users:users, current:current});
    };


// ~~~~~ routes

app.get('/', function (req, res){
    renderIndex(res);
});

app.get('/about', function (req, res){
    res.render('about', {title:'About Us'});
});

app.get('/privacy', function (req, res){
    res.render('privacy', {title:'Privacy'});
});

app.get('/room/:userid', function (req, res){
    var userid = req.params.userid || 0;

    if (0 == userid) {
        renderIndex(res);
    }
    else {
        var username = getUserName(userid);

        if (!username) {
            renderIndex(res);
        }
        else {
            var current = getCurrentUser();
            res.render('room', {title:'In a bottle with '+username, users:users, current:current, userid:userid});
        }
    }
});

/*// GET messages.json
app.get('/messages.json', function (req, res){
    fs.readFile('/messages.json', function (err, data){
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});

// POST messages.json
app.post('/messages.json', function (req, res){
    fs.readFile('/messages.json', function (err, data){
        var messages = JSON.parse(data);
        messages.push(req.body);

        fs.writeFile('/messages.json', JSON.stringify(messages, null, 4), function (err){
            res.setHeader('Cache-Control', 'no-cache');
            res.json(messages);
        });
    });
});*/


// ~~~~~ Socket.io communication

io.on('connection', function (client){
    // display event
    getMessage('server: user connection');

    // track user connection
    client.on('user:connection', function (userid){
        getMessage('client: user connection into the room #' + userid);

        // no room to display
        if (!userid) {
            io.emit('user:wrongroom');
        }
        else {
            // send event to client
            io.emit('user:connection');
        }
    });

    // track user update details
    client.on('user:update', function (data){
        getMessage('client: user updating details');

        // update user details
        user = data;
    });

    // track writing message
    client.on('message:writing', function (status, userid){
        getMessage('client: user ' + getUserName(userid) + ' ' + ('on' == status ? 'is' : 'stops') + ' writing');
        io.emit('message:writing', status, userid);
    });

    // track sending message
    client.on('message:send', function (msg, userid){
        getMessage('client: user ' + getUserName(userid) + ' sent the following message › ' + msg);
        io.emit('message:send', msg, userid);
    });

    // track user disconnection
    client.on('disconnect', function (userid){
        getMessage('client: user ' + getUserName(userid) + ' left the room!');

        // send event to client
        io.emit('user:left', userid);
    });
});


// ~~~~~ start server

http.listen(3000, function (){
    console.log('No quarter! Abort ship on port %d in %s mode', http.address().port, app.settings.env);
});


/*
// ~~~~~ initialization

var express = require('express');

// requires
var bodyparser = require('body-parser'),
    errorhandler = require('errorhandler'),
    fs = require('fs'),
    http = require('http'),
    //gravatar = require('gravatar'),
    jade = require('react-jade'),
    React = require('react'),
    routes = require('./routes');

// hook Socket.io into Express
//var app = module.exports = express(),
var app = express(),
    server = http.Server(app),
    io = require('socket.io')(server),
    socket = require('./routes/socket.js')(app,io);

server.listen(80);


// ~~~~~ configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

app.use(bodyparser.urlencoded({
    extended: false
}));
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

if ('development' == app.get('env')) {
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}
else if ('production' == app.get('env')) {
    app.use(errorhandler());
}


// ~~~~~ routes

// main router
router.use(function (req, res, next){
    // .. some logic here .. like any other middleware
    next();
});

// content
app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/privacy', routes.privacy);

// partials
//app.get('/partials/:name', routes.partials);

// rooms
app.get('/rooms/:name', routes.rooms);

// room
app.get('/room/:id', routes.room);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


// ~~~~~ Jade templating

//var template = jade.compileFile(__dirname + '/index.jade');


// ~~~~~ Socket.io communication

io.sockets.on('connection', socket);


// ~~~~~ start server

app.listen(3000, function(){
    console.log('No quarter! Abort ship on port %d in %s mode', app.address().port, app.settings.env);
});
*/
