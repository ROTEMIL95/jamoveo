import React, { useState, useEffect } from 'react';
import { FaSearch, FaMusic, FaRegFileAlt, FaRegPlayCircle, FaSignOutAlt, FaUserSlash, FaUsers } from 'react-icons/fa';
import Header from '../shared/Header';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useSocket } from '../../hooks/useSocket';
import { toast } from 'react-toastify';
import echo from '../../assets/images/Echo.png';
import gold from '../../assets/images/Gold.png';
import falling from '../../assets/images/Falling.png';
import waves from '../../assets/images/Waves.png';
import shivers from '../../assets/images/Shivers.png';
import alive from '../../assets/images/Alive.png';
import horizon from '../../assets/images/Horizon.png';


const songs = [
  { id: 1, title: 'Echo', artist: 'The Weeknd', image: echo },
  { id: 2, title: 'Gold', artist: 'Dua Lipa', image: gold },
  { id: 3, title: 'Falling', artist: 'Harry Styles', image: falling },
  { id: 4, title: 'Waves', artist: 'Dean Lewis', image: waves },
  { id: 5, title: 'Shivers', artist: 'Ed Sheeran', image: shivers },
  { id: 6, title: 'Alive', artist: 'Sia', image: alive },
  { id: 7, title: 'Horizon', artist: 'Coldplay', image: horizon },
];

function AdminPage() {
  const [query, setQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [newUserNotification, setNewUserNotification] = useState(null);
  const [showUsersList, setShowUsersList] = useState(false);
  const navigate = useNavigate();
  const { user, setCurrentSong } = useUser();
  const isAdmin = user?.role === 'admin';

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

  // Initially show all songs
  useEffect(() => {
    setFilteredSongs(songs);
  }, []);

  const performSearch = () => {
    if (!query.trim()) {
      setFilteredSongs(songs);
      setSearchExecuted(false);
      return;
    }

    // Search implementation for partial matches
    const searchTerms = query.toLowerCase().split(' ');
    const filtered = songs.filter(song => {
      const titleLower = song.title.toLowerCase();
      const artistLower = song.artist.toLowerCase();
      
      // Check if at least one search term appears in title or artist (partial match)
      return searchTerms.some(term => 
        titleLower.includes(term) || artistLower.includes(term)
      );
    });
    
    setFilteredSongs(filtered);
    setSearchExecuted(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleSongSelect = (song) => {
    const songWithSections = {
      ...song,
      sections: [
        {
          "title": "Verse",
          "lines": [
            { "chords": "Em      C         G      D", "lyrics": "ממעמקים קראתי אלייך בואי אלי" },
            { "chords": "Em        C           G      D", "lyrics": "ברוח סתיו, קולי נשא אלייך" },
            { "chords": "Em        C        G       D", "lyrics": "שובי אלי, תשובי כי בלי תחכי לי" }
          ]
        },
        {
          "title": "Chorus",
          "lines": [
            { "chords": "C     G        D", "lyrics": "כמו בימים, כמו בלילות" },
            { "chords": "Em     C        D", "lyrics": "אהיה תמיד שלך" },
            { "chords": "Em       C       G       D", "lyrics": "אהיה תמיד קרוב, ממעמקים" }
          ]
        }
      ],
    };

    setCurrentSong(songWithSections);
    if (isConnected && socket) {
      socket.emit('selectSong', songWithSections);
    }
    navigate('/live');
  };

  const handleKickUsers = () => {
    if (isConnected && socket) {
      // Show confirmation dialog
      if (window.confirm('Are you sure you want to kick all users from the session?')) {
        // Emit event to kick all users except the admin
        socket.emit('kickAllUsers', { adminId: user?.id });
      }
    } else {
      toast.error('No connection to server. Cannot kick users.');
    }
  };

  const handleKickUser = (userId) => {
    if (isConnected && socket) {
      if (window.confirm('Are you sure you want to kick this user?')) {
        socket.emit('kickUser', { userId });
      }
    } else {
      toast.error('No connection to server. Cannot kick user.');
    }
  };

  const handleQuitSession = () => {
    if (isConnected && socket) {
      if (window.confirm('Are you sure you want to end this session?')) {
        socket.emit('quitSession');
      }
    } else {
      toast.error('No connection to server. Cannot end session.');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header>
        <span style={{
          color: 'white',
          fontWeight: 600,
          fontSize: 24,
          whiteSpace: 'nowrap'
        }}>JaMoveo</span>
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
              Admin
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

      {/* Search area + Recommended songs */}
      <div className="flex-1 bg-[#FFFEF6] px-6 py-10 font-sans overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Controls</h2>
        </div>

     

    

        <div className="flex items-center mb-8 max-w-xl mx-auto rounded-full bg-[#F1EEE6] px-4 py-2 shadow-sm">
          <FaSearch className="text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a song (press Enter to search)..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
          />
          <button 
            onClick={handleSearch}
            className="ml-2 bg-[#e2dfcf] hover:bg-[#d8d4c0] px-3 py-1 rounded-full text-gray-700 text-xs font-medium transition"
          >
            Search
          </button>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {searchExecuted && query ? `Search Results (${filteredSongs.length})` : 'Recommended Songs'}
        </h2>
        
        <div className="space-y-2">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSongSelect(song)}
                className="flex items-center justify-between bg-[#F7F4EC] rounded-md px-4 py-3 hover:bg-[#ece8e1] transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {song.title} – {song.artist}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xl text-[#1a1613]">
                  <FaRegFileAlt title="Lyrics" />
                  <FaRegPlayCircle title="Video" />
                  <FaMusic title="Chords" />
                </div>
              </div>
            ))
          ) : searchExecuted ? (
            <div className="text-center py-8 text-gray-500">
              <p>No matching songs found</p>
              <p className="text-sm mt-2">Try using different search terms</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
