import React, { useEffect } from 'react';

const ChatSender = ({ currentMessage, handleSendChat, onInput }) => {
  
  useEffect(() => {
    const handleSendChatFromKeyboard = (e) => {
      e.preventDefault();
      if (e.keyCode === 13 && (currentMessage && currentMessage.trim())) handleSendChat();
    }
    document.addEventListener('keyup', handleSendChatFromKeyboard);
    return () => document.removeEventListener('keyup', handleSendChatFromKeyboard);
  }, [currentMessage, handleSendChat]);

  return (
    <div className="chat-sender">
      <div className="chat-input" contentEditable="true" onInput={(e) => onInput(e.target.innerText)} />
      <div className={`chat-send ${!currentMessage.trim() ? 'disabled' : ''}`} onClick={handleSendChat}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2" d="M24 40L60 4" />
          <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2" d="M4 28L60 4 36 60 24 40 4 28z" />
        </svg>
      </div>
    </div>
  )
}

export default ChatSender;