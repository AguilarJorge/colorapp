import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HexColorPicker } from "react-colorful";
import './App.css';

const SERVER = 'http://localhost:8080';
const socket = io(SERVER);

function App() {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState(null);
  const [color, setColor] = useState("#aabbcc");

  useEffect(() => {
    const userId = localStorage.getItem('user');
    console.log({ userId });
    if (userId) setUser(userId);
  }, [])

  socket.on('connection', () => {
    console.log('Enchufado con el back');
  })
  socket.on('change-color', (color) => {
    console.log(`Recibiendo color: ${color}`);
    setColor(color);
  })

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
      <h1 className="app-title" style={{ marginBottom: 10 }}>ColorApp</h1>
      {user && <h1 className="app-title">{user}</h1>}
      {!user ?
        <div>
          <label htmlFor="code">Ingresa el codigo</label>
          <input id="code" type="text" onChange={(e) => setCode(e.currentTarget.value)} />
          <button onClick={authUser}>Enviar</button>
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
