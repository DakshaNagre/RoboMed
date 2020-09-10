import Moment from 'react-moment';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

import React, { useState, useEffect } from 'react';
// import chatkitLogo from './chatkit-logo.svg';
import '../styles/Chat.css';
// import defaultAvatar from './default-avatar.png';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ChatkitProvider, TokenProvider, withChatkitOneToOne } from '@pusher/chatkit-client-react';

function ChatWindow(props) {
    const [pendingMessage, setPendingMessage] = useState('');
    const messageList = React.createRef();
  
    const handleMessageKeyDown = event => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    const handleMessageChange = event => {
      setPendingMessage(event.target.value);
    };
  
    const handleSendMessage = () => {
      if (pendingMessage === '') {
        return;
      }
      // TODO: Send message to Chatkit
      props.chatkit.sendSimpleMessage({ text: pendingMessage })
      setPendingMessage('');
    };
  
    useEffect(() => {
      messageList.current.scrollTop = messageList.current.scrollHeight;
    });
  
    // TODO: Show messages from Chatkit
    // const messages = [
    //   {
    //     id: 0,
    //     isOwnMessage: false,
    //     createdAt: '01/01/2019',
    //     textContent: 'Hi there! This is hardcoded message.',
    //   },
    //   {
    //     id: 1,
    //     isOwnMessage: true,
    //     createdAt: '01/01/2019',
    //     textContent: 'Hey 👋, so is this.',
    //   },
    // ];
  
    const messages = props.chatkit.messages.map(m => ({
      id: m.id,
      isOwnMessage: m.sender.id === props.chatkit.currentUser.id,
      createdAt: m.createdAt,
      // This will only work with simple messages.
      // To learn more about displaying multi-part messages see
      // https://pusher.com/docs/chatkit/reference/javascript#messages
      textContent: m.parts[0].payload.content,
    }));
  
    return (
      <div className="Chat">
        <div className="Chat__titlebar">
          {/* <img
            src={defaultAvatar}
            className="Chat__titlebar__avatar"
            alt="avatar"
          /> */}
            <Badge variant="dot" color="secondary">

          <AccountCircleIcon className="Chat__titlebar__avatar" />
          </Badge>
          <div className="Chat__titlebar__details">
            {/*TODO: Get other user's name from Chatkit */}
            <span>{props.chatkit.isLoading
                  ? 'Loading...'
                  : props.chatkit.otherUser.name}
          </span>
          </div> 
        </div>
        <div className="Chat__messages" ref={messageList}>
          {messages.map(m => (
            <Message key={m.id} {...m} />
          ))}
        </div>
        <div className="Chat__compose">
          <input
            className="Chat__compose__input"
            type="text"
            placeholder="Type a message..."
            value={pendingMessage}
            onChange={handleMessageChange}
            onKeyDown={handleMessageKeyDown}
          />
          <button className="Chat__compose__button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    );
  }
  
function Message({ isOwnMessage, isLatestMessage, createdAt, textContent }) {
return (
<div
className={
    isOwnMessage
    ? 'Chat__messages__message__wrapper Chat__messages__message__wrapper--self'
    : 'Chat__messages__message__wrapper Chat__messages__message__wrapper--other'
}
>
<div className="Chat__messages__message__wrapper__inner">
    <div
    className={
        isOwnMessage
        ? 'Chat__messages__message Chat__messages__message--self'
        : 'Chat__messages__message Chat__messages__message--other'
    }
    >
    <div className="Chat__messages__message__content">{textContent}</div>
    <div className="Chat__messages__message__time">
      Read &nbsp;&nbsp;
      <Moment
        calendar={{
            sameDay: 'LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[last] dddd [at] LT',
        }}
        >
        {createdAt}
        </Moment>
    </div>
    <div
        className={
        isOwnMessage
            ? 'Chat__messages__message__arrow alt'
            : 'Chat__messages__message__arrow'
        }
    />
    </div>
</div>
</div>
);
}

export default withChatkitOneToOne(ChatWindow);
