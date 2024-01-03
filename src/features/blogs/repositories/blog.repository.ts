import { type Collection, ObjectId } from 'mongodb';

import type {
  BlogWithMembership,
  QueryBlogInputModel,
  UpdateBlogModel,
} from '../models';
import { BlogDB } from '../../../models/db';
import { DataWithPagination, SortDir } from '../../../types';
import { mapMongoDocumentToPlainId } from '../../../models/db/mapper';
import { client } from '../../../db';

class BlogRepository {
  private validateId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Id is not a valid');
    }
  }

  constructor(private db: Collection<BlogDB>) {
    this.db = db;
  }

  async getAllBlogs(
    sortData: QueryBlogInputModel
  ): Promise<DataWithPagination<BlogWithMembership[]>> {
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 1000;

    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }

    const blogs = await this.db
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.db.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: blogs.map(mapMongoDocumentToPlainId),
    };
  }

  async getBlogById(id: string): Promise<BlogWithMembership | null> {
    this.validateId(id);

    const blog = await this.db.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return mapMongoDocumentToPlainId(blog);
  }

  async createBlog(
    blog: Omit<BlogWithMembership, 'id'>
  ): Promise<{ id: string }> {
    const createdBlog = await this.db.insertOne({ ...blog });

    return {
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
