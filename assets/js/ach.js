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
        var _href = $(this).attr('href');

        //track and open it
        tracklink(_href);
        window.open(_href);
    });

    //send message form
    var $form = $('#send');

    if (!$form.length) {
        return;
    }

    var socket = io.connect('http://localhost:3000'),
        $input = $form.find('#m'),
        $room = $form.find('#r'),
        $list = $('#messages'),
        $status = $('#status'),
        $user = $('#user');

    var user = {};

    // browser connection
    socket.on('connect', function (){
        socket.emit('user:connection');
    });

    // user 1 connection to the room
    socket.on('user:connection', function (room){
        user.room = room;

        // check user 1's details
        if (!user.name) {
            $user.addClass('active');

            // update form user 1
            $user.on('submit', function (e){
                e.preventDefault();

                // get user name
                var _username = $('#u').val();
                user.name = _username;

                // send data to the server
                socket.emit('user:update', user);
            });
        }
    });

    // user 1 connection to the room
    socket.on('user:connected', function (user){
        user = user;

        // update display
        $user.removeClass('active');
    });

    // user 1 is writing
    $input.on('keydown', function (e){
        socket.emit('message:write', 'on', user.id);
    });

    // user 1 stops writing
    $input.on('blur', function (e){
        socket.emit('message:write', 'off', user.id);
    });

    // user 2 is (not) writing
    socket.on('message:write', function (status, userId){
        // check user's ID
        if (userId == user.id) {
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
        socket.emit('message:send', _msg);
    });

    // user 2 sent message
    socket.on('message:send', function (msg, userId){
        // check user's ID
        var _class = userId == user.id ? 'me' : 'notme';

        // create message
        var $li = $(document.createElement('li'))
            .addClass(_class)
            .text(msg);

        // update messages list
        $list.append($li);
    });
})(jQuery);
