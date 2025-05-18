import React, { useEffect, useRef, useState } from 'react';
import Header from '../shared/Header';
import { useSocket } from '../../hooks/useSocket';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaStop, FaPlay } from 'react-icons/fa';

function LivePage() {
  const { currentSong, user } = useUser();
  const isSinger = user?.instrument?.toLowerCase() === 'vocals';
  const isAdmin = user?.role === 'admin';
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [newUserNotification, setNewUserNotification] = useState(null);
  const navigate = useNavigate();
  
  // Socket connection with event handlers
  const { socket, isConnected } = useSocket({
    onSessionEnded: () => {
      toast.info('Session ended', {
        position: 'top-center',
        autoClose: 3000
      });
      
      // Only redirect non-admin users to player page
      if (!isAdmin) {
        navigate('/player');
      }
    },
    onKicked: () => {
      // Handle being kicked - always redirect to player page
      // (admins shouldn't get kicked anyway)
      navigate('/player');
    },
    onUserConnected: (userData) => {
      // When a new user connects, update the connected users list
      if (isAdmin) {
        setNewUserNotification({
          username: userData.username,
          instrument: userData.instrument,
          timestamp: new Date()
        });
        
        // Clear notification after 5 seconds
        setTimeout(() => {
          setNewUserNotification(null);
        }, 5000);
      }
      
      // Update connected users list
      setConnectedUsers(prev => {
        // If user already exists, don't add duplicate
        if (prev.some(u => u.id === userData.id)) {
          return prev;
        }
        return [...prev, userData];
      });
    },
    onUserDisconnected: (userId) => {
      // When a user disconnects, remove them from the connected users list
      setConnectedUsers(prev => prev.filter(u => u.id !== userId));
    },
    onUsersUpdate: (users) => {
      // Update the entire users list when received from server
      setConnectedUsers(users);
    }
  });

  // Request users list on component mount
  useEffect(() => {
    if (isConnected && socket && isAdmin) {
      socket.emit('getConnectedUsers');
    }
  }, [isConnected, socket, isAdmin]);

  // Format user's instrument with first letter capitalized
  const formattedInstrument = user?.instrument 
    ? user.instrument.charAt(0).toUpperCase() + user.instrument.slice(1)
    : isAdmin ? 'Admin' : 'Player';

  // Auto scroll
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      scrollRef.current?.scrollBy({ top: 1, behavior: 'smooth' });
    }, 40);
    return () => clearInterval(interval);
  }, [autoScroll]);

  // Handle quit session
  const handleQuitSession = () => {
    if (isConnected && socket) {
      if (window.confirm('Are you sure you want to end this session for everyone?')) {
        socket.emit('quitSession');
        toast.success('Session ended successfully');
        // Admin stays on the current page
      }
    } else {
      toast.error('No connection to server. Cannot end session.');
    }
  };

  // Navigate back to admin panel
  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  // If no song is selected, show a message
  if (!currentSong) {
    return (
      <>
        <Header>
          <span style={{ 
            color: 'white', 
            fontWeight: 600, 
            fontSize: 24,
            whiteSpace: 'nowrap'
          }}>JAMOVEO</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ 
                color: 'white', 
                fontWeight: 500,
                fontSize: 'clamp(12px, 3vw, 16px)',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{user?.username || ''}</span>
              <div 
                style={{ 
                  backgroundColor: 'rgba(255, 205, 41, 0.2)',
                  color: 'rgba(255, 205, 41, 1)', 
                  fontSize: 'clamp(12px, 3vw, 16px)',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  border: '1px solid rgba(255, 205, 41, 0.4)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {formattedInstrument}
              </div>
            </div>
            <div style={{
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              borderRadius: '50%',
              background: 'rgba(255,205,41,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(13,4,2,1)',
              fontWeight: 700,
              fontSize: 'clamp(16px, 4vw, 20px)',
              textTransform: 'uppercase',
            }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                (user?.username?.[0] || '?')
              )}
            </div>
          </div>
        </Header>
        <div className="bg-[#FFFEF6] flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 mt-4 sm:mt-10 md:mt-20 relative">
          <p className="text-lg text-center">No song selected. Please select a song from the admin page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header>
        <span style={{ 
            color: 'white', 
            fontWeight: 600, 
            fontSize: 24,
            whiteSpace: 'nowrap'
          }}>JAMOVEO</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ 
                color: 'white', 
                fontWeight: 500,
                fontSize: 'clamp(12px, 3vw, 16px)',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{user?.username || ''}</span>
            <div 
              style={{ 
                backgroundColor: 'rgba(255, 205, 41, 0.2)',
                color: 'rgba(255, 205, 41, 1)', 
                fontSize: 'clamp(12px, 3vw, 16px)',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                marginTop: '4px',
                border: '1px solid rgba(255, 205, 41, 0.4)',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {formattedInstrument}
            </div>
          </div>
          <div style={{
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
            borderRadius: '50%',
            background: 'rgba(255,205,41,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(13,4,2,1)',
            fontWeight: 700,
            fontSize: 'clamp(16px, 4vw, 20px)',
            textTransform: 'uppercase',
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              (user?.username?.[0] || '?')
            )}
          </div>
        </div>
      </Header>

      <div className="bg-[#FFFEF6] flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 mt-4 sm:mt-10 md:mt-20 relative">
        {!isConnected && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 mb-4 rounded text-sm w-full max-w-8xl">
            Not connected to server - running in offline mode
          </div>
        )}
        
        {/* Admin-only user connection notification */}
        {isAdmin && newUserNotification && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 mb-4 rounded-md text-sm w-full max-w-8xl flex justify-between items-center">
            <span>
              <strong>{newUserNotification.username}</strong> has joined the session
              {newUserNotification.instrument && ` (${newUserNotification.instrument})`}
            </span>
            <button 
              onClick={() => setNewUserNotification(null)} 
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ✕
            </button>
          </div>
        )}

        
        <div
          ref={scrollRef}
          className="border-2 border-dashed border-gray-500 rounded-lg w-full max-w-8xl h-[500px] md:h-[700px] flex flex-col items-center justify-start overflow-auto p-4 md:p-8 text-right"
        >
          {currentSong.sections && currentSong.sections.map((section, idx) => (
            <div key={idx} className="mb-4 md:mb-6 w-full">
              <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base">{section.title}:</h3>
              {section.lines.map((line, i) => (
                <div key={i} className="mb-1 md:mb-2">
                  {!isSinger && <p className="text-yellow-500 text-xs md:text-sm">{line.chords}</p>}
                  <p className="text-sm md:text-base">{line.lyrics}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Control buttons */}
        <div className="fixed bottom-3 sm:bottom-6 left-0 w-full flex justify-center gap-2 sm:gap-4 px-2 sm:px-0 z-10">
          <div className="flex gap-2 sm:gap-4 bg-black bg-opacity-30 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg">
            {/* Auto-scroll button */}
  

            {/* Admin-only control buttons */}
            {isAdmin && (
              <>
                <button
                  onClick={handleBackToAdmin}
                  className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-colors"
                >
                  <FaArrowLeft />
                  <span>Back</span>
        </button>

          <button
                  onClick={handleQuitSession}
                  className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-colors"
          >
                  <span>Quit Session</span>
          </button>
              </>
        )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LivePage;
