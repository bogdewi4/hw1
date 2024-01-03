import { type Collection, ObjectId } from 'mongodb';

import { client } from '@/db';
import type { PostDB } from '@/models/db';

import { type DataWithPagination, SortDir } from '@/types';

import { type PostWithBlogDTO } from '../models/dto';
import { type QueryPostInputModel, postMapper } from '../models';

class PostQueryRepository {
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
  ): Promise<DataWithPagination<PostWithBlogDTO[]>> {
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

  async getPostById(id: string): Promise<PostWithBlogDTO | null> {
    this.validateId(id);

    const post = await this.db.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }
}

export const postQueryRepository = new PostQueryRepository(
  client.db().collection<PostDB>('post')
);
