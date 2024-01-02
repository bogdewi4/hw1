import { ObjectId } from 'mongodb';
import type { Collection } from 'mongodb';

import { client } from '../db';

import type { BlogDB } from '../models/db';
import type { BlogModel, UpdateBlogModel } from '../models/blogs';

class BlogRepository {
  constructor(private db: Collection<BlogDB>) {
    this.db = db;
  }

  async createBlog(blog: Omit<BlogModel, 'id'>): Promise<BlogModel> {
    const post = await this.db.insertOne({ ...blog });

    return {
      ...blog,
      id: post.insertedId.toString(),
    };
  }

  async updateBlog(
    updatedPost: UpdateBlogModel & { id: string }
  ): Promise<boolean> {
    const post = await this.db.updateOne(
      { _id: new ObjectId(updatedPost.id) },
      {
        $set: {
          name: updatedPost.name,
          description: updatedPost.description,
          websiteUrl: updatedPost.websiteUrl,
        },
      }
    );

    return !!post.matchedCount;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const post = await this.db.deleteOne({ _id: new ObjectId(id) });
    return !!post.deletedCount;
  }
}

export const blogRepository = new BlogRepository(
  client.db().collection<BlogDB>('blog')
);
