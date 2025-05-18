import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useSocket } from '../../hooks/useSocket';
import Header from '../shared/Header';
import { FaSearch, FaMusic, FaRegFileAlt, FaRegPlayCircle, FaArrowLeft } from 'react-icons/fa';

// דוגמה למאגר שירים בסיסי
const allSongs = [
  { id: 1, title: 'Echo', artist: 'The Weeknd', image: '/songs/echo.jpg' },
  { id: 2, title: 'Waves', artist: 'Dean Lewis', image: '/songs/waves.jpg' },
  { id: 3, title: 'Gold', artist: 'Dua Lipa', image: '/songs/gold.jpg' },
];

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setCurrentSong } = useUser();
  const { socket, isConnected } = useSocket();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [results, setResults] = useState([]);
  const [newQuery, setNewQuery] = useState(query);

  useEffect(() => {
    const filtered = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (newQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  const handleSelectSong = (song) => {
    const songWithSections = {
      ...song,
      sections: [
        {
          title: 'Verse',
          lines: [
            { chords: 'C G Am F', lyrics: 'Sample line 1' },
            { chords: 'F G C', lyrics: 'Sample line 2' },
          ],
        },
      ],
    };

    setCurrentSong(songWithSections);
    if (isConnected && socket) {
      socket.emit('selectSong', songWithSections);
    }
    navigate('/live');
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

      {/* אזור חיפוש + תוצאות */}
      <div className="flex-1 bg-[#FFFEF6] px-6 py-10 font-sans overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-[#937100] hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Search
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex items-center mb-8 max-w-xl mx-auto rounded-full bg-[#F1EEE6] px-4 py-2 shadow-sm">
          <FaSearch className="text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Search any song..."
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </form>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">Results for "{query}"</h2>

        {!isConnected && (
          <div className="px-3 py-1 mb-4 inline-block rounded text-sm bg-red-100 text-red-800 whitespace-nowrap">
            Disconnected
          </div>
        )}

        <div className="space-y-2">
          {results.length > 0 ? (
            results.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSelectSong(song)}
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
          ) : (
            <p className="text-center py-8 text-gray-500">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
