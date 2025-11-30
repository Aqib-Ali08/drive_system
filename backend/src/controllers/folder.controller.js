import Folder from '../models/folder.model.js';
import File from '../models/file.model.js';

// Create a new folder
export const createFolder = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const owner = req.user._id;

    // Default path
    let path = "/";

    if (parent) {
      // Fetch parent folder
      const parentFolder = await Folder.findOne({ _id: parent, owner });
      if (!parentFolder) return res.status(400).json({ message: "Invalid parent folder" });

      // Build path: parent path + parent folder id + '/'
      path = `${parentFolder.path}${parentFolder._id}/`;
    }

    // Create folder
    const folder = await Folder.create({
      name,
      owner,
      parent: parent || null, // null if root
      path,
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all folders and files in a folder (handles root folder)
export const getFolderContents = async (req, res) => {
  try {
    let folderId = req.params.id;
    if (!folderId || folderId === "null") {
      folderId = null;
    }

    const owner = req.user._id;

    const folders = await Folder.find({ parent: folderId, owner });
    const files = await File.find({ folder: folderId, owner });

    // Add type field
    const folderItems = folders.map(f => ({
      ...f._doc,
      type: "folder",
    }));

    const fileItems = files.map(file => ({
      ...file._doc,
      type: "file",
    }));

    // Combine into one array
    const items = [...folderItems, ...fileItems];

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a folder
export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const owner = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, owner });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    // Optional: delete child folders and files recursively
    await Folder.deleteMany({ path: { $regex: folder.path + folder._id } });
    await File.deleteMany({ folder: folderId });
    await folder.deleteOne();

    res.json({ message: 'Folder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Rename folder only
export const renameFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const { newName } = req.body;
    const owner = req.user._id;

    if (!newName || !newName.trim()) {
      return res.status(400).json({ message: "New folder name is required" });
    }

    const folder = await Folder.findOne({ _id: folderId, owner });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Update name only
    folder.name = newName;
    await folder.save();

    res.json({
      message: "Folder renamed successfully",
      folder,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
