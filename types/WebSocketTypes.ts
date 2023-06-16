import { Server, Socket } from 'socket.io'

interface ServerToClientEvents {
    basicEmit: (msg: string) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    new_user: (id: string) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

export type WS_Server = Server<ClientToServerEvents,
    ServerToClientEvents, InterServerEvents, SocketData
>

export type WS_Socket = Socket<ClientToServerEvents,
    ServerToClientEvents, InterServerEvents, SocketData
>