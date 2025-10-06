const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());


const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const ROBLOX_TOPIC = "SaweriaDonations"; 
app.post('/saweria-webhook', async (req, res) => {
    console.log('Menerima webhook dari Saweria:', req.body);


    if (!ROBLOX_API_KEY || !UNIVERSE_ID) {
        console.error('Error: Kredensial Roblox (API Key/Universe ID) tidak diatur!');
        return res.status(500).send('Konfigurasi server error.');
    }


    const donationData = {
        donor_name: req.body.donator || 'Anonymous',
        amount: req.body.amount_raw || 0,
        message: req.body.message || ''
    };

    const robloxApiUrl = `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${ROBLOX_TOPIC}`;

    try {
    
        await axios.post(
            robloxApiUrl,
            { message: JSON.stringify(donationData) },
            {
                headers: {
                    'x-api-key': ROBLOX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Berhasil mengirim data ke Roblox Messaging API.');
        res.status(200).send('OK'); // Kirim status sukses ke Saweria
    } catch (error) {
        console.error('Gagal mengirim data ke Roblox:', error.response?.data || error.message);
        res.status(500).send('Gagal meneruskan pesan ke Roblox.');
    }
});


app.get('/test', (req, res) => {
    res.send('Server Webhook Saweria-Roblox berjalan!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server mendengarkan di port ${PORT}`);
});
