import { postRepository } from '../repositories';

import type {
  CreatePostWithBlogNameModel,
  PostWithBlog,
  UpdatePostWithBlogNameModel,
} from '../models';

class PostService {
  async createPost(createdData: CreatePostWithBlogNameModel) {
    const data: Omit<PostWithBlog, 'id'> = {
      title: createdData.title,
      shortDescription: createdData.shortDescription,
      content: createdData.content,
      blogId: createdData.blogId,
      blogName: createdData.blogName,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await postRepository.createPost({ ...data });
    return createdPost.id;
  }

  async updatePost(postId: string, updatePost: UpdatePostWithBlogNameModel) {
    return await postRepository.updatePost({ id: postId, ...updatePost });
  }

  async deletePost(postId: string) {
    return await postRepository.deletePost(postId);
  }
}

export const postService = new PostService();
