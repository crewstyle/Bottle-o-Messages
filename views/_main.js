(function($){
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
