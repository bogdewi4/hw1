import { Router } from 'express';
import type { Request, Response } from 'express';
import { blogRepository } from '../repositories';
import type { RequestWithBody, RequestWithParams } from '../types';
import { authMiddleware } from '../middlewares/auth';
import { blogValidation } from '../validators/blog';
import type { CreateBlogModel } from '../models/blogs';
import { ObjectId } from 'mongodb';

export const blogRoute = Router();

blogRoute.get('/', async (req: Request, res: Response) => {
  const blogs = await blogRepository.getAllBlogs();
  res.send(blogs);
});

blogRoute.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const blog = await blogRepository.getBlogById(id);
    !blog ? res.sendStatus(404) : res.send(blog);
  }
);

blogRoute.post(
  '/',
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
    const blog = req.body;
    const createdBlog = await blogRepository.createBlog(blog);
    res.status(201).send(createdBlog);
  }
);

blogRoute.put(
  '/:id',
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithBody<CreateBlogModel, { id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const blog = req.body;
    const isUpdated = await blogRepository.updateBlog({ ...blog, id });
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

blogRoute.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const isDeleted = await blogRepository.deleteBlog(id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
);
