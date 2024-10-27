import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const server = createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' }});

const PORT = 8080;
const HOST_CODE = '123';
const USER_CODE = '456';


app.post('/auth', (req, res) => {
  try {
    const { code } = req.body;
    if (code === HOST_CODE) {
      res.status(200).json({ data: { userType: 'HOST' }, message: 'Eres host', success: true, error: false });
    } else if(code === USER_CODE) {
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
  })
})