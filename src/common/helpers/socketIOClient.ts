import { Server } from 'socket.io';

import SocketIOEventsMap from '@/common/types/socketIOEventsMap';


const socketIOSingleton = () => {
    return {
        io: null
    };
};

declare global {
    var socketIOGlobal: {
        io: Server<SocketIOEventsMap>
    };
}

const socketIO = globalThis.socketIOGlobal ?? socketIOSingleton();

export default socketIO;

if (process.env.NODE_ENV !== 'production') globalThis.socketIOGlobal = socketIO;
