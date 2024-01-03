import { type Collection, ObjectId } from 'mongodb';

import { client } from '@/db';

import { postMapper } from '@/features/posts/models';

import type { BlogDB, PostDB } from '@/models/db';

import { type DataWithPagination, SortDir } from '@/types';

import { blogMapper } from '../models';
import type {
  BlogWithMembershipDTO,
  QueryBlogInputModel,
  QueryPostByBlogIdInputModel,
} from '../models';

class BlogQueryRepository {
  private validateId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Id is not a valid');
    }
  }

  constructor(
    private dbBlog: Collection<BlogDB>,
    private dbPost: Collection<PostDB>
  ) {
    this.dbBlog = dbBlog;
    this.dbPost = dbPost;
  }

  async getAllBlogs(
    sortData: QueryBlogInputModel
  ): Promise<DataWithPagination<BlogWithMembershipDTO[]>> {
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }

    const blogs = await this.dbBlog
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.dbBlog.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async getPostsByBlogId(
    blogId: string,
    sortData: QueryPostByBlogIdInputModel
  ) {
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    const posts = await this.dbPost
      .find({ blogId })
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.dbPost.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: posts.map(postMapper),
    };
  }

  async getBlogById(id: string): Promise<BlogWithMembershipDTO | null> {
    this.validateId(id);

    const blog = await this.dbBlog.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }
}

export const blogQueryRepository = new BlogQueryRepository(
  client.db().collection<BlogDB>('blog'),
  client.db().collection<PostDB>('post')
);
