import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { initGridFS } from './utils/db.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import folderRoutes from './routes/folder.routes.js';
import fileRoutes from './routes/file.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
  exposedHeaders: ["Content-Disposition", "Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Default route
app.get('/', (req, res) => res.send('Data Drive API'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/drive-db';
const GRIDFS_BUCKET = process.env.GRIDFS_BUCKET || 'uploads';

// Connect to MongoDB
mongoose.connect(MONGO_URI);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connected');

  // Initialize GridFSBucket
  initGridFS(connection, GRIDFS_BUCKET);

  // Load routes AFTER GridFS is ready
  app.use('/api/auth', authRoutes);
  app.use('/api/folders', folderRoutes);
  app.use('/api/files', fileRoutes);

  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
