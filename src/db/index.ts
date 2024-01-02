const path = require('path');

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import { BlogDB, PostDB } from '@/models/db';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Must be assigned MONGO_URI variable');
}

export const client = new MongoClient(uri);

export const postCollection = client.db().collection<PostDB>('post');
export const blogCollection = client.db().collection<BlogDB>('blog');

export const runDb = async () => {
  try {
    await client.connect();

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
