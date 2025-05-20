// useSocket.ts
import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

export const BACKEND_URL = ref('http://localhost:');

let socket: Socket | null = null;

export const initSocket = () => {
    if (!socket) {
        socket = io(BACKEND_URL.value.trim(), {
            transports: ['websocket']
        });
    }
};

export const useSocket = () => {
    if (!socket) throw new Error('Socket not initialized. Call initSocket() first.');

    const on = (event: string, callback: (...args: any[]) => void) => {
        socket!.on(event, callback);
    };

    const emit = (event: string, payload?: any) => {
        socket!.emit(event, payload);
    };

    return {
        socket,
        on,
        emit,
    };
};
