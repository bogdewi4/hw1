import { db } from '../db';
import { BlogModel, CreateBlogModel, UpdateBlogModel } from '../models/blogs';

export class BlogRepository {
  static get blogs() {
    return db.blogs;
  }

  static getAllBlogs() {
    return this.blogs;
  }
  static getBlogById(id: string) {
    return this.blogs.find((blog) => blog.id === id);
  }
  static createBlog(blog: CreateBlogModel) {
    const newBlog: BlogModel = {
      id: new Date().getTime().toString(),
      ...blog,
    };

    this.blogs.push(newBlog);
    return newBlog;
  }

  static updateBlog(blog: UpdateBlogModel & { id: string }) {
    let blogEntity = this.blogs.find(({ id }) => id === blog.id);

    if (blogEntity) {
      Object.assign(blogEntity, { ...blog });
    }

    return !!blogEntity;
  }

  static deleteBlog(id: string) {
    for (let i = 0; i < this.blogs.length; i++) {
      const blog = this.blogs[i];
      if (blog.id === id) {
        this.blogs.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}
