import { Server, Socket } from 'socket.io'

interface ServerToClientEvents {
    user_joined: (id: number) => void;
    user_left: (id?: number) => void;
    active_users: (users: string) => void;
    message_received: (message: any) => void;
}

interface ClientToServerEvents {
    new_user: (id: number) => void;
    message_sent: (to: number, msgId: number) => void;
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