import { blogRepository } from '../repositories';
import type {
  BlogWithMembership,
  CreateBlogModel,
  CreatePostBlogModel,
  UpdateBlogModel,
} from '../models';
import { postRepository } from '../../posts';

class BlogService {
  async createBlog(createdData: CreateBlogModel) {
    const data: Omit<BlogWithMembership, 'id'> = {
      name: createdData.name,
      description: createdData.description,
      websiteUrl: createdData.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const response = await blogRepository.createBlog(data);
    return response.id;
  }

  async createPostToBlog(blogId: string, postData: CreatePostBlogModel) {
    const blog = await blogRepository.getBlogById(blogId);

    const post = {
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blog!.id,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };

    const createPost = await postRepository.createPost(post);
    return createPost.id;
  }

  async updateBlog(blogId: string, updateBlog: UpdateBlogModel) {
    return await blogRepository.updateBlog({
      id: blogId,
      name: updateBlog.name,
      description: updateBlog.description,
      websiteUrl: updateBlog.websiteUrl,
    });
  }

  async deleteBlog(id: string) {
    return await blogRepository.deleteBlog(id);
  }
}

export const blogService = new BlogService();
