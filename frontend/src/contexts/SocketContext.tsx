import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Using the same base URL as the API, but without the /api suffix
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:2000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Gets the token directly from storage to ensure we have the latest
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'], // Force websocket to avoid polling issues
      reconnection: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Global listener for new messages (Messaging)
    socketInstance.on('newMessage', (message: any) => {
      // If we are on the messaging page with this user, we might not want a toast, 
      // but simpler to just show it for now or check URL.
      const currentUrl = window.location.href;
      if (!currentUrl.includes(message.senderId)) {
          toast.message('New Message', {
            description: message.content ? (message.content.length > 30 ? message.content.substring(0,30)+'...' : message.content) : 'You received a new message',
            action: {
              label: 'View',
              onClick: () => {
                 // Determine correct base path based on role stored in localStorage
                 const role = localStorage.getItem('userRole');
                 const basePath = role === 'NGO' ? '/dashboard/ngo' : '/dashboard/volunteer';
                 window.location.href = `${basePath}/messages?userId=${message.senderId}`;
              }
            }
          });
      }
    });

    // Global generic notification listener (e.g. Matches)
    socketInstance.on('notification', (payload: any) => {
         toast.success(payload.title || 'Notification', {
            description: payload.message || '',
         });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
