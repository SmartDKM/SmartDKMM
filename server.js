const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Izin akses agar HTML bisa memanggil server ini

// Konfigurasi Midtrans (Gunakan Server Key dari Dashboard Midtrans kamu)
let snap = new midtransClient.Snap({
    isProduction: true, // Set ke false untuk mode Sandbox (Uji Coba)
    serverKey: 'Mid-server-ZaBXHqR7BUo7H9EHA1cEUH6G',
    clientKey: 'Mid-client-lTEt5G_rNZeNc9HI'
});

// Pintu utama untuk mengambil Snap Token
app.post('/api/get-snap-token', async (req, res) => {
    try {
        let parameter = {
            "transaction_details": {
                "order_id": "DKM-" + Date.now(),
                "gross_amount": req.body.price // Harga yang dikirim dari file HTML
            },
            "credit_card": { 
                "secure": true 
            },
            "customer_details": {
                "first_name": "Pengguna",
                "last_name": "Smart DKM"
            }
        };

        // Meminta token ke server Midtrans
        const transaction = await snap.createTransaction(parameter);
        
        // Mengirim token balik ke file HTML
        res.json({ token: transaction.token });
    } catch (error) {
        console.error("Midtrans Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Jalankan server di port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));