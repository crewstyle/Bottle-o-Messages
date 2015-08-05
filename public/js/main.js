/*! *//*!
 * main.js v1.0.0 - "Sogeking no shima deeeeeee - One Piece"
 * ~~~~~~~~~~~~~~~~~~
 * Copyright 2015 Achraf Chouk <achrafchouk@gmail.com>
 */

// message form
var MessageForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();

        // get values
        var author = React.findDOMNode(this.refs.author).value.trim(),
            text = React.findDOMNode(this.refs.text).value.trim();

        if (!author || !text) {
            return;
        }

        this.props.onMessageSubmit({
            author: author,
            text: text
        });

        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
    },

    render: function () {
        return (
            <form className="message-form" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" className="i-author" />
                <input type="text" placeholder="Say something..." ref="text" className="i-text" />
                <button type="submit">Post</button>
            </form>
        );
    }
});

// message item
var MessageItem = React.createClass({
    render: function () {
        var markup = marked(this.props.children.toString(), {sanitize: true});

        return (
            <div className="message-item">
                <h2 className="message-author">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={{__html: markup}} />
            </div>
        );
    }
});

// message list
var MessageList = React.createClass({
    render: function () {
        var messageItems = this.props.data.map(function (message){
            return (
                <MessageItem author={message.author}>
                    {message.text}
                </MessageItem>
            );
        });

        return (
            <div className="message-list">
                {messageItems}
            </div>
        );
    }
});

// message box containing all components
var MessageBox = React.createClass({
    getMessages: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
            success: function (json) {
                this.setState({data: json});
            }.bind(this)
        });
    },

    getInitialState: function () {
        return {data: []};
    },

    handleMessageSubmit: function (message) {
        var messages = this.state.data,
            newmessages = messages.concat([message]);

        this.setState({data: newmessages});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: message,
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
            success: function (data) {
                this.setState({data: data});
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.getMessages();
        setInterval(this.getMessages, this.props.interval);
    },

    render: function () {
        return (
            <div className="message-box">
                <h1>Messages</h1>
                <MessageList data={this.state.data} />
                <MessageForm onMessageSubmit={this.handleMessageSubmit} />
            </div>
        );
    }
});

// main renderer
React.render(
    <MessageBox url="/messages.json" interval={2000} />,
    document.getElementById('content')
);
