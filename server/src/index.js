import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import { Server } from 'socket.io';

import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


const connectedUsers = {}; 

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    connectedUsers[userId] = socket.id; 
    console.log(`Usuário conectado: ${userId}. Socket ID: ${socket.id}`);
  }

  socket.on('sendMessage', (data) => {
    const receiverSocketId = connectedUsers[data.receiverId];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', data);
      
      io.to(receiverSocketId).emit('refreshContacts', { 
        senderId: data.senderId 
      });
      console.log(`Comando 'refreshContacts' enviado para: ${data.receiverId}`);
    }

    io.to(socket.id).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    for (const [key, value] of Object.entries(connectedUsers)) {
      if (value === socket.id) {
        delete connectedUsers[key];
        console.log(`Usuário desconectado: ${key}`);
        break;
      }
    }
  });
});

app.get('/', (req, res) => {
    res.send('Servidor rodando e pronto para o trabalho!');
});

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 3001;

async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Banco de Dados conectado com sucesso!');
        server.listen(PORT, () => { 
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar:', error.message);
        process.exit(1);
    }
}

main();