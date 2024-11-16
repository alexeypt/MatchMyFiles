import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port =  process.env.APP_PORT ?? 4000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    globalThis.socketIOGlobal = {
        io: new Server(httpServer)
    };

    globalThis.socketIOGlobal.io.on('connection', (socket) => {
        console.log('socket connection');
    });

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
