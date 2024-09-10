import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { connectDB } from './config/db.js';
import { errorResponse } from './middlewares/errorMiddleware.js';
import routes from './routes/index.js'
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set('socketio', io);
app.use(bodyParser.json());
app.use(cors());
configDotenv();

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use('/api', routes);

app.use(errorResponse);

app.get('/', (req, res) => {
    res.send('Welcome to AlphaTribe server');
});


httpServer.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});
