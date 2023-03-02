import { Application } from 'express';
import { Socket, Server } from 'socket.io';

const http = require('http');

const getHostRoom = (gameCode: string) => `${gameCode}-host`;
interface JoinGameRoomPayload {
  gameCode: string;
  playerName: string;
}

export function initializeSocket(app: Application) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });

    socket.on('join-game-room', async ({ gameCode, playerName }: JoinGameRoomPayload) => {
      console.log('Join game room!');
      if (!!gameCode) {
        console.log(`Joined room ${gameCode}. ${playerName}`);
        socket.join(gameCode);
        socket.data['playerName'] = playerName;
        const hostRoom = getHostRoom(gameCode);
        const players = await []; // await getPlayersFromRoom(gameCode);
        io.to(hostRoom).emit('players-list', players);
      }
    });

    socket.on('join-game-room-as-host', (code?: string) => {
      if (!!code) {
        console.log(`Host joined room ${code}`);
        socket.join(code);
      }
    });
  });

  server.listen(8008, () => {
    console.log('Socket listening on Port 8008');
  });
}
