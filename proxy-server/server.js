const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post(
            'https://notify-api.line.me/api/notify',
            `message=${encodeURIComponent(req.body.message)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${req.body.token}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || 'Error');
    }
});

app.listen(PORT, () => {
    console.log(`CORS Proxy running at http://localhost:${PORT}`);
});
