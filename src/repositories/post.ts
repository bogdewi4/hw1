import { Collection, ObjectId } from 'mongodb';
import { client } from '../db';

import { CreatePostModel, PostModel, UpdatePostModel } from '../models/posts';
import { postMapper } from '../models/posts/mappers';
import { PostDB } from '../models/db';

class PostRepository {
  constructor(private db: Collection<PostDB>) {
    this.db = db;
  }

  async getAllPosts(): Promise<PostModel[]> {
    const posts = await this.db.find({}).toArray();
    return posts.map(postMapper);
  }

  async getPostById(id: string): Promise<PostModel | null> {
    const post = await this.db.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  async createPost(
    createdData: CreatePostModel & { blogName: string }
  ): Promise<PostModel> {
    const data: Omit<PostModel, 'id'> = {
      ...createdData,
      createdAt: new Date().toISOString(),
    };
    const post = await this.db.insertOne(data);

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
