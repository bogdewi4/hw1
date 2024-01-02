import { type Collection, ObjectId } from 'mongodb';
import { client } from '../db';

import { postMapper } from '../models/posts/mappers';
import type {
  CreatePostModel,
  PostModel,
  UpdatePostModel,
} from '../models/posts';
import type { PostDB } from '../models/db';
import { QueryPostByBlogIdInputModel } from '../models/blogs';
import { DataWithPagination, SortDir } from '../types';

class PostRepository {
  constructor(private db: Collection<PostDB>) {
    this.db = db;
  }

  async getAllPosts(
    sortData: QueryPostByBlogIdInputModel
  ): Promise<DataWithPagination<PostModel[]>> {
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
      items: posts.map(postMapper),
    };
  }

  async getPostById(id: string): Promise<PostModel | null> {
    const post = await this.db.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }
}

export const postRepository = new PostRepository(
  client.db().collection<PostDB>('post')
);
