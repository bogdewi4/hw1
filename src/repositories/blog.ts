import { Collection, ObjectId } from 'mongodb';
import { client } from '../db';
import { BlogDB } from '../models/db';
import { blogMapper } from '../models/blogs/mappers';
import { BlogModel, CreateBlogModel, UpdateBlogModel } from '../models/blogs';

class BlogRepository {
  constructor(private db: Collection<BlogDB>) {
    this.db = db;
  }

  async getAllBlogs(): Promise<BlogModel[]> {
    const posts = await this.db.find({}).toArray();
    return posts.map(blogMapper);
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    const post = await this.db.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return blogMapper(post);
  }

  async createBlog(createdData: CreateBlogModel): Promise<BlogModel> {
    const data: Omit<BlogModel, 'id'> = {
      name: createdData.name,
      description: createdData.description,
      websiteUrl: createdData.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const post = await this.db.insertOne(data);

    return {
      ...data,
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
