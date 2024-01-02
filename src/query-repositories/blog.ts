import { ObjectId } from 'mongodb';
import type { Collection } from 'mongodb';

import { client } from '../db';

import { blogMapper } from '../models/blogs/mappers';
import type { BlogDB, PostDB } from '../models/db';
import type {
  BlogModel,
  QueryBlogInputModel,
  QueryPostByBlogIdInputModel,
} from '../models/blogs';
import { DataWithPagination, SortDir } from '../types';
import { postMapper } from '../models/posts/mappers';

class BlogRepository {
  constructor(
    private dbBlog: Collection<BlogDB>,
    private dbPost: Collection<PostDB>
  ) {
    this.dbBlog = dbBlog;
    this.dbPost = dbPost;
  }

  async getAllBlogs(
    sortData: QueryBlogInputModel
  ): Promise<DataWithPagination<BlogModel[]>> {
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
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
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
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: posts.map(postMapper),
    };
  }

  async getBlogById(id: string): Promise<BlogModel | null> {
    const blog = await this.dbBlog.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }
}

export const blogRepository = new BlogRepository(
  client.db().collection<BlogDB>('blog'),
  client.db().collection<PostDB>('post')
);
