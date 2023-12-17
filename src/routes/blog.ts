import { Request, Response, Router } from 'express';
import { BlogRepository } from '../repositories';
import { RequestWithBody, RequestWithParams } from '../types';
import { authMiddleware } from '../middlewares/auth';
import { blogValidation } from '../validators/blog';
import { CreateBlogModel } from '../models/blogs';

export const blogRoute = Router();

blogRoute.get('/', (req: Request, res: Response) => {
  const blogs = BlogRepository.getAllBlogs();
  res.send(blogs);
});

blogRoute.get(
  '/:id',
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const blog = BlogRepository.getBlogById(id);

    if (!blog) {
      res.sendStatus(404);
    }

    res.send(blog);
  }
);

blogRoute.post(
  '/',
  authMiddleware,
  blogValidation(),
  (req: RequestWithBody<CreateBlogModel>, res: Response) => {
    const blog = req.body;
    res.status(201).send(BlogRepository.createBlog(blog));
  }
);

blogRoute.put(
  '/:id',
  authMiddleware,
  blogValidation(),
  (req: RequestWithBody<CreateBlogModel, { id: string }>, res: Response) => {
    const { id } = req.params;
    const blog = req.body;
    const isUpdated = BlogRepository.updateBlog({ ...blog, id });
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

blogRoute.delete(
  '/:id',
  authMiddleware,
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const isDeleted = BlogRepository.deleteBlog(id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
);
