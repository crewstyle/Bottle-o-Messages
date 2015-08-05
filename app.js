/*! *//*!
 * bottle-o-messages v1.0.0 - "Sogeking no shima deeeeeee - One Piece"
 * ~~~~~~~~~~~~~~~~~~
 *
 * Run it in command line:
 * node app.js
 *
 * ~~~~~~~~~~~~~~~~~~
 * Copyright 2015 Achraf Chouk <achrafchouk@gmail.com>
 */

var express = require('express'),
    filesystem = require('fs'),
    bottle = express();

// serving static files with / route
bottle.use('/', express.static('public'));

// GET messages.json
bottle.get('/messages.json', function (req, res) {
    filesystem.readFile('messages.json', function (err, data) {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});

// POST messages.json
bottle.post('/messages.json', function (req, res) {
    filesystem.readFile('messages.json', function (err, data) {
        var messages = JSON.parse(data);
        messages.push(req.body);

        filesystem.writeFile('/messages.json', JSON.stringify(messages, null, 4), function (err) {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(messages);
        });
    });
});

// server initialization
var server = bottle.listen(3000, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Lauching: http://%s:%s/', host, port);
});
