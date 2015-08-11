/*!
 * ach.js v1.0.0 - "Sogeking no shima deeeeeee - One Piece"
 * Copyright 2015 Achraf Chouk <achrafchouk@gmail.com>
 */
var _support = 'desktop';                                                       //default support


//_support
if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
    var width = window.innerWidth,                                              //window width
        height = window.innerHeight;                                            //window height

    //check support
    if (((width >= 480) && (height >= 800)) ||
        ((width >= 800) && (height >= 480)) ||
        navigator.userAgent.match(/iPad/i)
    ) {
        _support = 'tablet';
    } else {
        _support = 'mobile';
    }
}



//scope
(function($){
    //_blank
    $('.openit').on('click', function (e){
        e.preventDefault();
        window.open($(this).attr('href'));
    });

    //send message form
    var $form = $('#send');

    if (!$form.length) {
        return;
    }

    var socket = io.connect('http://localhost:3000'),
        $input = $form.find('#m'),
        $room = $form.find('#r'),
        $current = $form.find('#c'),
        $list = $('#messages'),
        $status = $('#status');

    var _roomid = $room.val(),
        _currentid = $current.val();

    // browser connection
    socket.on('connect', function (){
        socket.emit('user:connection', _roomid);
    });

    // user 1 is not in the right room
    socket.on('user:wrongroom', function (){
        // do nothing for now.
    });

    // user 1 connection to the room
    socket.on('user:connection', function (){
        // do nothing for now.
    });

    // user 1 is writing
    $input.on('keydown', function (e){
        socket.emit('message:writing', 'on', _currentid);
    });

    // user 1 stops writing
    $input.on('blur', function (e){
        socket.emit('message:writing', 'off', _currentid);
    });

    // user 2 is (not) writing
    socket.on('message:writing', function (status, userid){
        // check user's ID
        if (userid == _currentid) {
            return;
        }

        // update status
        var _txt = 'on' == status ? '...' : '';
        $status.html(_txt);
    });

    // user 1 send message
    $form.on('submit', function (e){
        e.preventDefault();

        // get message and update input
        var _msg = $input.val();
        $input.val('');

        // send data to the server
        socket.emit('message:send', _msg, _currentid);
    });

    // user 2 sent message
    socket.on('message:send', function (msg, userid){
        // check user's ID
        var _class = userid == _currentid ? 'me' : 'notme';

        // create message
        var $li = $(document.createElement('li'))
            .addClass(_class)
            .text(msg);

        // update messages list
        $list.append($li);
    });

    // browser disconnection
    socket.on('disconnect', function (){
        socket.emit('user:disconnection', _roomid);
    });

    // user 1 connection to the room
    socket.on('user:left', function (userid){
        // do nothing for now.
    });
})(jQuery);
