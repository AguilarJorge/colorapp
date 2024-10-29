import React, { useEffect, useRef } from 'react';

const ChatHistory = ({ chats }) => {
  const chatElement = useRef(null);

  useEffect(() => {
    const chat = chatElement.current;
    if (chat) chat.scrollTo(0, chat.scrollHeight);
  }, [chats]);

  return (
    <div ref={chatElement} className="chat-history">
      {chats.length ?
        chats.map((chat, index) => (
          <div key={index} className="chat-message">
            <span className="chat-message-user">Host</span>{chat}
          </div>
        )) : null
      }
    </div>
  )
}

export default ChatHistory;