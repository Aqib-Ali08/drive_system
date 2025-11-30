import mongoose from 'mongoose';

let gfsBucket;

export const initGridFS = (connection, bucketName = 'uploads') => {
  const db = connection.db;
  if (!db) throw new Error('Database connection is not ready');

  gfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName });
  console.log(`GridFSBucket initialized with bucket: ${bucketName}`);
  return gfsBucket;
};

export const getGFS = () => {
  if (!gfsBucket) throw new Error('GridFSBucket not initialized. Call initGridFS first.');
  return gfsBucket;
};
