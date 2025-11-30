import File from '../models/file.model.js';
import { getGFS } from '../utils/db.js';
import mongoose from 'mongoose';
import { Readable } from 'stream';

// Upload file (metadata saved in File model)
export const uploadFile = async (req, res) => {
  try {
    const owner = req.user ? req.user._id : null;
    let { folder } = req.body;

    if (!folder || folder === 'null' || folder === 'root') folder = null;

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const gfs = getGFS();
    if (!gfs) return res.status(500).json({ message: 'GridFS not initialized' });

    const fileId = new mongoose.Types.ObjectId();

    // Create a readable stream from the file buffer
    const readableFile = Readable.from(req.file.buffer);

    const uploadStream = gfs.openUploadStreamWithId(fileId, req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { owner, folder }
    });

    readableFile.pipe(uploadStream)
      .on('error', (err) => res.status(500).json({ message: err.message }))
      .on('finish', async () => {
        try {
          const savedFile = await File.create({
            _id: fileId, // use the same ID as GridFS
            filename: req.file.originalname,
            owner,
            folder,
            gridFsId: fileId,
            mimeType: req.file.mimetype,
            size: req.file.size,
          });

          res.status(201).json(savedFile);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const owner = req.user ? req.user._id : null;

    const file = await File.findOne({ _id: fileId, owner });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const gfs = getGFS();
    const downloadStream = gfs.openDownloadStream(file.gridFsId);

    res.set('Content-Type', file.mimeType);
    res.set('Content-Disposition', `filename="${file.filename}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      res.status(500).json({ message: err.message });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List files in folder
export const listFilesInFolder = async (req, res) => {
  try {
    let folderId = req.params.folderId;
    if (!folderId || folderId === 'null') folderId = null;

    const owner = req.user ? req.user._id : null;
    const files = await File.find({ folder: folderId, owner });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const owner = req.user?._id;

    // Find metadata
    const file = await File.findOne({ _id: fileId, owner });
    if (!file) return res.status(404).json({ message: "File not found" });

    const gfs = getGFS();
    if (!gfs) return res.status(500).json({ message: "GridFS not initialized" });

    // Convert to ObjectId
    const gridFsId = new mongoose.Types.ObjectId(file.gridFsId);

    // Delete from GridFS using async/await
    try {
      await gfs.delete(gridFsId);
    } catch (err) {
      if (err.message.includes("File not found")) {
        // File metadata exists, but GridFS file missing → continue
        console.warn(`GridFS file missing for id ${gridFsId}`);
      } else {
        throw err; // Other errors → crash
      }
    }

    // Delete metadata
    await file.deleteOne();

    res.json({ message: "File deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Rename file
export const renameFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { newName } = req.body;
    const owner = req.user ? req.user._id : null;

    if (!newName || !newName.trim()) {
      return res.status(400).json({ message: "New file name is required" });
    }

    // Fetch file metadata
    const file = await File.findOne({ _id: fileId, owner });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Update metadata
    file.filename = newName;
    await file.save();

    return res.json({
      message: "File renamed successfully",
      file,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
