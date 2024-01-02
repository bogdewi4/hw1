import { type Collection, ObjectId } from 'mongodb';
import { client } from '../db';

import type { PostModel, UpdatePostModel } from '../models/posts';
import type { PostDB } from '../models/db';

class PostRepository {
  constructor(private db: Collection<PostDB>) {
    this.db = db;
  }

  async createPost(data: Omit<PostModel, 'id'>): Promise<PostModel> {
    const post = await this.db.insertOne({ ...data });

    return {
      ...data,
      id: post.insertedId.toString(),
    };
  }

  async updatePost(
    updatedPost: UpdatePostModel & { id: string; blogName: string }
  ): Promise<boolean> {
    const post = await this.db.updateOne(
      { _id: new ObjectId(updatedPost.id) },
      {
        $set: {
          title: updatedPost.title,
          shortDescription: updatedPost.shortDescription,
          content: updatedPost.content,
          blogId: updatedPost.blogId,
        },
      }
    );

    return !!post.matchedCount;
  }

  async deletePost(id: string): Promise<boolean> {
    const post = await this.db.deleteOne({ _id: new ObjectId(id) });

    return !!post.deletedCount;
  }
}

export const postRepository = new PostRepository(
  client.db().collection<PostDB>('post')
);
