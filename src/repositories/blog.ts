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
    const createdBlog = await this.db.insertOne({ ...blog });

    return {
      ...blog,
      id: createdBlog.insertedId.toString(),
    };
  }

  async updateBlog(
    updateBlog: UpdateBlogModel & { id: string }
  ): Promise<boolean> {
    const blog = await this.db.updateOne(
      { _id: new ObjectId(updateBlog.id) },
      {
        $set: {
          name: updateBlog.name,
          description: updateBlog.description,
          websiteUrl: updateBlog.websiteUrl,
        },
      }
    );

    return !!blog.matchedCount;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.db.deleteOne({ _id: new ObjectId(id) });
    return !!blog.deletedCount;
  }
}

export const blogRepository = new BlogRepository(
  client.db().collection<BlogDB>('blog')
);
