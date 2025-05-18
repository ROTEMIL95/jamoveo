import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import Header from '../shared/Header';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function PlayerPage() {
  const navigate = useNavigate();
  const { user , setCurrentSong} = useUser();
  const { isConnected } = useSocket({
    onSongSelected: (song) => {
      setCurrentSong(song);
      navigate('/live');
    },
    onSessionEnded: () => {
      setCurrentSong(null);
      navigate('/player');
    }
  });



  // התפקיד של המשתמש עם אות ראשונה גדולה
  const formattedInstrument = user?.instrument
    ? user.instrument.charAt(0).toUpperCase() + user.instrument.slice(1)
    : 'Unknown';

  console.log("User instrument:", user?.instrument, "Formatted:", formattedInstrument);

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
              {formattedInstrument || 'Player'}
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
      <div className="bg-[#FFFEF6] flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 mt-4 sm:mt-10 md:mt-20">
        <div className="border-2 border-dashed border-gray-500 rounded-lg w-full max-w-8xl h-[500px] md:h-[700px] flex flex-col items-center justify-center p-4 md:p-8">
          <span className="text-yellow-400 text-3xl md:text-4xl mb-2 md:mb-4">🎵</span>
          <p className="text-2xl md:text-4xl font-medium text-black text-center" style={{ fontFamily: 'Exo , sans-serif' }}>
            Waiting for next song…
          </p>
          {isConnected ? (
            <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-500 text-center">The admin will start the session soon</p>
          ) : (
            <p className="mt-2 md:mt-4 text-sm md:text-base text-red-500 text-center">Unable to connect to server</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PlayerPage;
