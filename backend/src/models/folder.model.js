import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const folderSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Folder', default: null }, // null for root
  path: { type: String, required: true }, // e.g., /parentId/
  createdAt: { type: Date, default: Date.now },
});

// Optional: Index for faster path queries
folderSchema.index({ owner: 1, path: 1 });

export default model('Folder', folderSchema);
