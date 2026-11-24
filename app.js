
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoute = require('./routes/authRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const productRoute = require('./routes/productRoutes');
const stockRoute = require('./routes/stockRoutes');
const cartRoute = require('./routes/cartRoutes');
const orderRoute = require('./routes/orderRoutes');
const transactionRoute = require('./routes/transactionRoute');

const app = express();

app.use(cors());
app.use(express.json());

// Halaman utama
app.get('/', (req, res) => {
  res.json({
    message: 'API ATKMart berhasil dijalankan!'
  });
});

// Routes API
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/transactions', transactionRoute);

// Menangani endpoint yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan'
  });
});

// Menjalankan server lokal
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  });
}

// Mengekspor aplikasi untuk Vercel
module.exports = app;
