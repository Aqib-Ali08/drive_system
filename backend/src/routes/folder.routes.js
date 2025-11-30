import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createFolder,
  getFolderContents,
  deleteFolder,
  renameFolder
} from '../controllers/folder.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createFolder);

router.get('/:id', getFolderContents);

router.put('/:id/rename', renameFolder);

router.delete('/:id', deleteFolder);

export default router;
