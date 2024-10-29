import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';

const app = express();
app.use(cors({ origin: process.env.REACT_APP_CLIENT_HOST }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV === 'production') require('dotenv').config();
const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.REACT_APP_CLIENT_HOST }});
const PORT = process.env.REACT_APP_SERVER_PORT;

app.post('/auth', (req, res) => {
  try {
    const { code } = req.body;
    if (code.toUpperCase() === process.env.REACT_APP_HOST_CODE) {
      res.status(200).json({ data: { userType: 'HOST' }, message: 'Eres host', success: true, error: false });
    } else if (code === process.env.REACT_APP_USER_CODE) {
      res.status(200).json({ data: { userType: 'CLIENT' }, message: 'Eres cliente', success: true, error: false});
    } else {
      res.status(400).json({ data: null, mensaje: 'El codigo ingresado es incorrecto. Por favor consulta a tu host.', success: false, error: 'INVALID_CODE' });
    }
  } catch (error) {
    res.status(400).json({ data: null, mensaje: 'Ocurrio un error inesperado.', success: false, error });
  }
});

server.listen(PORT, () => {
  console.log(`Server jalando en el puerto: ${PORT}`);
});

io.on('connection', (socket) => {
  socket.emit('connection', null);
  socket.on('send-color', (color) => {
    io.emit('change-color', color);
  });
  socket.on('send-message', (message) => {
    io.emit('update-messages', message);
  });
})