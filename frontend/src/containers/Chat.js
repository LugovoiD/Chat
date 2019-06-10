import React from 'react';
import Sidepanel from './sidepanel/Sidepanel';
import WebSocketInstance from '../websocket';


class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.waitForTheSocketConnection(() => {
            WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this));
            WebSocketInstance.fetchMessages(this.props.currentUser);
        });
    }

    waitForTheSocketConnection(callback) {
        const component = this;
        setTimeout(
            function () {
                if (WebSocketInstance.state === 1) {
                    console.log('connection is secure');
                    callback();
                    return;
                } else {
                    console.log('waiting for connection...');
                    component.waitForTheSocketConnection(callback);
                }
            }, 100);
    }

    renderTimestamp = timestamp => {
        let prefix = "";
        const timeDiff = Math.round(
            (new Date().getTime() - new Date(timestamp).getTime()) / 60000
        );
        if (timeDiff < 1) {
            // less than one minute ago
            prefix = "just now...";
        } else if (timeDiff < 60 && timeDiff > 1) {
            // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) {
            // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
            // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    };

    addMessage(message) {
        this.setState({ messages: [...this.state.messages, message]});
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse() });
    }

    renderMessages = (messages) => {
        const currentUser = 'admin'; //this.props.username;
        return messages.map(message => (
            <li
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
                className={message.author === currentUser ? "sent" : "replies"}
            >
                <img
                    src="http://emilcarlsson.se/assets/mikeross.png"
                    alt="profile-pic"
                />
                <p>
                    {message.content}
                    <br />
                    <small>{this.renderTimestamp(message.timestamp)}</small>
                </p>
            </li>
        ));
    };

    messageChangeHandler = event => {
        this.setState({ message: event.target.value });
    };

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: 'admin', //this.props.username,
            content: this.state.message,
            // chatId: this.props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({ message: "" });
    };

    render() {
        const messages = this.state.messages;
        return(
            <div id="frame">
                <Sidepanel/>
                <div className="content">
                    <div className="contact-profile">
                        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt=""/>
                        <p>username</p>
                        <div className="social-media">
                            <i className="fa fa-facebook" aria-hidden="true"></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="messages">
                        <ul id="chat-log">
                            {
                                messages && this.renderMessages(messages)
                            }

                        </ul>
                    </div>
                    <div className="message-input">
                        <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..."/>
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat