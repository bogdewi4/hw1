import type { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { postQueryRepository } from '@/features/posts';

import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from '@/types';

import { blogQueryRepository } from '../repositories';

import { blogService } from '../services';

import type {
  CreateBlogModel,
  CreatePostBlogModel,
  QueryBlogInputModel,
  QueryPostByBlogIdInputModel,
} from '../models';

export const BlogController = {
  getBlogs: async (
    req: RequestWithQuery<QueryBlogInputModel>,
    res: Response
  ) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogs = await blogQueryRepository.getAllBlogs(sortData);
    res.send(blogs);
  },

  getBlogById: async (
    req: RequestWithParams<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const blog = await blogQueryRepository.getBlogById(id);
      !blog ? res.sendStatus(HttpStatusCode.NotFound) : res.send(blog);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },

  getPostsByBlogId: async (
    req: RequestWithParamsAndQuery<{ id: string }, QueryPostByBlogIdInputModel>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
      };

      const blog = await blogQueryRepository.getBlogById(id);

      if (!blog) {
        res.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      const post = await blogQueryRepository.getPostsByBlogId(
        blog.id,
        sortData
      );
      res.send(post);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },

  createBlog: async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
    const blogPayload = req.body;

    const createdBlogId = await blogService.createBlog(blogPayload);
    const createdBlog = await blogQueryRepository.getBlogById(createdBlogId);

    if (!createdBlog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    res.status(HttpStatusCode.Created).send(createdBlog);
  },

  createPostToBlog: async (
    req: RequestWithBody<CreatePostBlogModel, { id: string }>,
    res: Response
  ) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;

    const blogId = req.params.id;

    const blog = await blogQueryRepository.getBlogById(blogId);

    if (!blog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const createdPostId = await blogService.createPostToBlog(blogId, {
      title,
      shortDescription,
      content,
    });

    const post = await postQueryRepository.getPostById(createdPostId);

    if (!post) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    res.status(201).send(post);
  },

  updateBlog: async (
    req: RequestWithBody<CreateBlogModel, { id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const blog = req.body;
      const isUpdated = await blogService.updateBlog(id, {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      });
      isUpdated
        ? res.sendStatus(HttpStatusCode.NoContent)
        : res.sendStatus(HttpStatusCode.NotFound);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },

  deleteBlog: async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      const isDeleted = await blogService.deleteBlog(id);
      isDeleted
        ? res.sendStatus(HttpStatusCode.NoContent)
        : res.sendStatus(HttpStatusCode.NotFound);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },
};
