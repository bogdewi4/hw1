import { type Collection, ObjectId } from 'mongodb';

import { client } from '@/db';

import { type DataWithPagination, SortDir } from '@/types';
import type { PostDB } from '@/models/db';
import { mapMongoDocumentToPlainId } from '@/models/db/mapper';

import type {
  PostWithBlog,
  QueryPostInputModel,
  UpdatePostWithBlogNameModel,
} from '../models';

class PostRepository {
  private validateId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Id is not a valid');
    }
  }

  constructor(private db: Collection<PostDB>) {
    this.db = db;
  }

  async getAllPosts(
    sortData: QueryPostInputModel
  ): Promise<DataWithPagination<PostWithBlog[]>> {
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    const posts = await this.db
      .find()
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.db.countDocuments();
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map(mapMongoDocumentToPlainId),
    };
  }

  async getPostById(id: string): Promise<PostWithBlog | null> {
    this.validateId(id);

    const post = await this.db.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return mapMongoDocumentToPlainId(post);
  }

  async createPost(data: Omit<PostWithBlog, 'id'>): Promise<{ id: string }> {
    const post = await this.db.insertOne({ ...data });

    return {
      id: post.insertedId.toString(),
    };
  }

  async updatePost(
    updatedPost: UpdatePostWithBlogNameModel & { id: string }
  ): Promise<boolean> {
    this.validateId(updatedPost.id);

    const post = await this.db.updateOne(
      { _id: new ObjectId(updatedPost.id) },
      {
        $set: {
          title: updatedPost.title,
          shortDescription: updatedPost.shortDescription,
          content: updatedPost.content,
          blogId: updatedPost.blogId,
          blogName: updatedPost.blogName,
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
