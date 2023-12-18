import { MongoClient } from 'mongodb';
import type { BlogDB, PostDB } from '../models/db';
import 'dotenv/config';
console.log('ENV', process.env.MONGO_URI);

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

export const client = new MongoClient(uri);

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
