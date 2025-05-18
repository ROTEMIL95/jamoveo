import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useSocket({ onSongSelected, onSessionEnded, onUserJoined, onKicked, onUserConnected, onUserDisconnected, onUsersUpdate } = {}) {
  const socketRef = useRef(null);
  const onSongSelectedRef = useRef(onSongSelected);
  const onSessionEndedRef = useRef(onSessionEnded);
  const onUserJoinedRef = useRef(onUserJoined);
  const onKickedRef = useRef(onKicked);
  const onUserConnectedRef = useRef(onUserConnected);
  const onUserDisconnectedRef = useRef(onUserDisconnected);
  const onUsersUpdateRef = useRef(onUsersUpdate);
  const [isConnected, setIsConnected] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    onSongSelectedRef.current = onSongSelected;
    onSessionEndedRef.current = onSessionEnded;
    onUserJoinedRef.current = onUserJoined;
    onKickedRef.current = onKicked;
    onUserConnectedRef.current = onUserConnected;
    onUserDisconnectedRef.current = onUserDisconnected;
    onUsersUpdateRef.current = onUsersUpdate;
  }, [onSongSelected, onSessionEnded, onUserJoined, onKicked, onUserConnected, onUserDisconnected, onUsersUpdate]);

  useEffect(() => {
    if (!socketRef.current) {
      // Connect with user ID in query params if available
      socketRef.current = io(API_URL, {
        query: user?.id ? { userId: user.id } : {}
      });

      socketRef.current.on('connect', () => {
        console.log(' Connected:', socketRef.current.id);
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log(' Disconnected');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      // מאזינים לאירועים — תוך שימוש ב־ref לעדכונים חיים
      socketRef.current.on('songSelected', (data) => {
        console.log(' songSelected event received:', data);
        if (onSongSelectedRef.current) onSongSelectedRef.current(data);
      });

      socketRef.current.on('sessionEnded', () => {
        console.log('sessionEnded event received');
        if (onSessionEndedRef.current) onSessionEndedRef.current();
      });

      socketRef.current.on('userJoined', (data) => {
        console.log('userJoined event received:', data);
        if (onUserJoinedRef.current) onUserJoinedRef.current(data);
      });

      // Handle user connected event
      socketRef.current.on('userConnected', (userData) => {
        console.log(' userConnected event received:', userData);
        if (onUserConnectedRef.current) onUserConnectedRef.current(userData);
      });

      // Handle user disconnected event
      socketRef.current.on('userDisconnected', (userId) => {
        console.log(' userDisconnected event received:', userId);
        if (onUserDisconnectedRef.current) onUserDisconnectedRef.current(userId);
      });

      // Handle users update event
      socketRef.current.on('usersUpdate', (users) => {
        console.log(' usersUpdate event received:', users);
        if (onUsersUpdateRef.current) onUsersUpdateRef.current(users);
      });

      // Handle being kicked from session
      socketRef.current.on('kickedFromSession', (data) => {
        console.log(' kickedFromSession event received:', data);
        
        // Show notification about being kicked
        toast.warning('You were kicked from the session', {
          position: 'top-center',
          autoClose: 5000
        });
        
        // Call custom handler if provided
        if (onKickedRef.current) {
          onKickedRef.current(data);
        } else {
          // Default behavior: redirect to the home page
          navigate('/player');
        }
      });

      // Handle confirmation that users were kicked (admin only)
      socketRef.current.on('usersKicked', (data) => {
      
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [API_URL, user?.id, navigate]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
