import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http from 'http';
import { initializeSocket } from './socket';

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Rocket Crown server running on port ${PORT}`);
});