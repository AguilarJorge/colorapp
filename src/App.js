import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HexColorPicker } from "react-colorful";
import './App.css';
import logo from './logo.png';
import Login from './components/Login.js';
import ChatHistory from './components/ChatHistory.js';
import ChatSender from './components/ChatSender.js';

const SERVER = `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;
const socket = io(SERVER);

const App = () => {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState(null);
  const [color, setColor] = useState("#aabbcc");
  const [chats, setChats] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (userId) setUser(userId);

    socket.on('change-color', (color) => {
      if (userId) setColor(color);
    })
  }, [user])

  useEffect(() => {
    socket.on('update-messages', (message) => {
      setChats([...chats, message]);
    })
  }, [chats])


  const handleAuthUser = async () => {
    const req = await fetch(`${SERVER}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code})
    });
    const res = await req.json();
    if (res.success) {
      const userId = res.data.userType;
      localStorage.setItem('user', userId);
      setUser(userId);
    }
  }
  const handleChangeColor = (color) => {
    socket.emit('send-color', color, () => {});
  }
  const handleSendChat = () => {
    if (!currentMessage.trim()) return;
    setCurrentMessage('');
    const contentEditable = document.querySelector('.chat-input');
    if (contentEditable) contentEditable.innerHTML = '';
    socket.emit('send-message', currentMessage, () => {});
  }

  return (
    <div className="app" style={{ backgroundColor: color }}>
      {!user
        ? <Login logo={logo} onClick={handleAuthUser} updateCode={(code) => setCode(code)} />
        : user === 'HOST' ? (
          <div className="app-host" style={{ height: '100%' }}>
            <h1 className="user-title">Eres el <b>{user}</b> de la app, solo tu puedes controlar el color y enviar mensaje a los clientes.</h1>
            <div className="color-selector-wrapper">
              <div className="chat-overlay" style={{ background: `linear-gradient(${color}, transparent)` }} />
              <HexColorPicker color={color} onChange={(color) => handleChangeColor(color)} />
            </div>
            <ChatHistory chats={chats} />
            <ChatSender currentMessage={currentMessage} handleSendChat={handleSendChat} onInput={setCurrentMessage} />
          </div>
        ) : (
          <div className="app-client">
              <div className="chat-overlay" style={{ background: `linear-gradient(${color}, transparent)` }} />
              <ChatHistory chats={chats} />
          </div>
        )
      }
    </div>
  );
}

export default App;