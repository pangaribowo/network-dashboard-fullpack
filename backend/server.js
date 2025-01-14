import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file
const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.send(
    JSON.stringify({
      type: 'deviceUpdate',
      payload: {
        devices: [
          { id: 1, name: 'Router-Main', status: 'Online', ip: '192.168.1.1', priority: 80 },
          { id: 2, name: 'Switch-Floor1', status: 'Online', ip: '192.168.1.2', priority: 60 },
          { id: 3, name: 'AP-Conference', status: 'Warning', ip: '192.168.1.3', priority: 40 },
          { id: 4, name: 'Server-Main', status: 'Offline', ip: '192.168.1.4', priority: 20 },
        ],
      },
    })
  );

  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'bandwidthUpdate',
          payload: {
            device: 'Router-Main',
            usage: Math.floor(Math.random() * 100),
          },
        })
      );
    }
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log(`WebSocket server is running on port ${port}`);

