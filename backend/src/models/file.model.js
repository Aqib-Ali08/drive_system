import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const fileSchema = new Schema({
  filename: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  gridFsId: { type: Schema.Types.ObjectId, required: true }, 
  mimeType: { type: String },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default model('File', fileSchema);
