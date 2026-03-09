const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
require('dotenv').config();

const sentiment = new Sentiment();
const router = express.Router();

function detectMood(text) {
    const result = sentiment.analyze(text);
    const score = result.score;
    if (score > 2) {
        return 'HAPPY';
    } else if (score < -2) {
        return 'SAD';
    } else {
        return 'RELAXED';
    }
}

router.post("/", async (req, res) => {
    try {
        const mood = detectMood(req.body.text);
        const YOUTUBE_API_KEY = process.env.API_KEY;

        const query = {
            'HAPPY': 'melody songs',
            'SAD': 'Sad music',
            'RELAXED': 'Cartoon video'
        };
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query[mood]}&key=${YOUTUBE_API_KEY}&type=video&maxResults=5`;
        const response = await axios.get(url);
        res.json({ mood, recommendations: response.data.items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
