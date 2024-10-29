import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HexColorPicker } from "react-colorful";
import './App.css';
import logo from './logo.png';

const SERVER = `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;
const socket = io(SERVER);

function App() {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState(null);
  const [color, setColor] = useState("#aabbcc");

  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (userId) setUser(userId);

    socket.on('change-color', (color) => {
      if (userId) setColor(color);
    })
  }, [user])


  const authUser = async () => {
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
    console.log(res);
  }
  const handleChangeColor = (color) => {
    socket.emit('send-color', color, () => {});
  }

  return (
    <div className="app" style={{ backgroundColor: color }}>
      <div className="app-login">
        <img src={logo} alt="App logo" width={300} height={300} />
        <h1 className="app-title" style={{ marginBottom: 30 }}>ColorApp</h1>
        <label htmlFor="code" style={{ fontSize: 20 }}>Ingresa el codigo para iniciar sesión</label>
        <input className="app-input-code" id="code" type="text" onChange={(e) => setCode(e.currentTarget.value)} />
        <div className="app-button" onClick={authUser}>Enviar</div>
      </div>
      {user && <h1 className="app-title">{user}</h1>}
      {!user ?
        <div>
        </div> : user === 'HOST' ? 
        <div className="color-selector-wrapper">
          <HexColorPicker color={color} onChange={(color) => handleChangeColor(color)} />
        </div> :
        <div>Esperando color</div>
      }
    </div>
  );
}

export default App;
