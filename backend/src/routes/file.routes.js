import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import multer from 'multer';
import {
  uploadFile,
  downloadFile,
  listFilesInFolder,
  deleteFile,
  renameFile   // ⬅️ added
} from '../controllers/file.controller.js';

const router = express.Router();

// Use auth for all routes
router.use(authMiddleware);

// Multer memory storage for native GridFS streaming
const upload = multer({ storage: multer.memoryStorage() });

// Upload route
router.post('/upload', upload.single('file'), uploadFile);

// Download route
router.get('/:id/download', downloadFile);

// List files in folder
router.get('/folder/:folderId', listFilesInFolder);

// Rename file route  ⬅️ NEW
router.put('/:id/rename', renameFile);

// Delete file
router.delete('/:id', deleteFile);

export default router;
