import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMusic, FaSearch, FaSpinner, FaSmile, FaSadTear, FaLeaf } from 'react-icons/fa';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moodResult, setMoodResult] = useState('');
  const [videos, setVideos] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // Connect to the backend
      const response = await axios.post('http://localhost:5005/mood', { text });
      setMoodResult(response.data.mood);
      setVideos(response.data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the backend server. Please make sure it is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (mood) => {
    switch(mood) {
      case 'HAPPY': return <FaSmile color="#fbbf24" />;
      case 'SAD': return <FaSadTear color="#60a5fa" />;
      case 'RELAXED': return <FaLeaf color="#34d399" />;
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1><FaMusic /> MoodTune</h1>
        <p>Express how you feel and get perfect YouTube recommendations</p>
      </motion.div>

      <motion.div 
        className="input-section"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <textarea
            className="input-area"
            placeholder="How are you feeling right now? E.g., 'I had the best day ever!' or 'feeling a bit stressed about exams...'"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Analyzing Mood...
              </>
            ) : (
              <>
                <FaSearch /> Find Music
              </>
            )}
          </button>
        </form>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {moodResult && !loading && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mood-display">
              <h2>{getMoodIcon(moodResult)} Detected Mood: <span>{moodResult}</span></h2>
            </div>
            
            <div className="videos-grid">
              {videos.map((video, index) => (
                <motion.a 
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={video.id.videoId || index}
                  className="video-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <img 
                    src={video.snippet.thumbnails.high.url} 
                    alt={video.snippet.title}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <h3 className="video-title" dangerouslySetInnerHTML={{ __html: video.snippet.title }} />
                    <p className="video-channel">{video.snippet.channelTitle}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
