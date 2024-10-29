import React from 'react';

const Login = ({ logo, onClick, updateCode }) => {
  return (
    <div className="app-login">
      <img src={logo} alt="App logo" width={300} height={300} style={{ marginBottom: 20 }} />
      <h1 className="app-title" style={{ marginBottom: 30 }}>ColorApp</h1>
      <label htmlFor="code" style={{ fontSize: 20 }}>Ingresa el codigo para iniciar sesión</label>
      <input className="app-input-code" id="code" type="text" onChange={(e) => updateCode(e.currentTarget.value)} />
      <div className="app-button" onClick={onClick}>Enviar</div>
    </div>
  )
}

export default Login;