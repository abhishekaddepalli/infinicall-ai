import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (!this.socket) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api\/?$/, '');

      this.socket = io(serverUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        upgrade: true,
      });

      this.socket.on('connect', () => {
      });

      this.socket.on('new-notification', (data) => {
        const callbacks = this.listeners.get('new-notification');
        if (callbacks) {
          callbacks.forEach(cb => cb(data));
        }
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback: (data: any) => void) {
    const callbacks = this.listeners.get('new-notification') || [];
    callbacks.push(callback);
    this.listeners.set('new-notification', callbacks);

    return () => {
      const current = this.listeners.get('new-notification') || [];
      this.listeners.set('new-notification', current.filter(cb => cb !== callback));
    };
  }
}

export const socketService = new SocketService();
