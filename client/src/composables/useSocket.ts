import { io, Socket } from 'socket.io-client';

export const BACKEND_URL = 'http://localhost:3000';
//export const BACKEND_URL = 'https://fa33e7a2-31cf-46cc-9431-33ed4b5dfd5e-00-150zblrjpqd5m.worf.replit.dev/';
//export const BACKEND_URL = 'https://c794-79-18-224-186.ngrok-free.app';


let socket: Socket;

export const useSocket = () => {
    if (!socket) {
        socket = io(BACKEND_URL.trim(), {
            transports: ['websocket']
        });

    }

    const on = (event: string, callback: (...args: any[]) => void) => {
        console.log(event);
        socket.on(event, callback);
    };

    const emit = (event: string, payload?: any) => {
        socket.emit(event, payload);
    };



    return {
        socket,
        on,
        emit,
    };
};
