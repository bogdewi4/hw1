import type {
  CreatePostModel,
  PostModel,
  UpdatePostModel,
} from '@/models/posts';
import { postRepository } from '@/repositories';

class PostService {
  async createPost(createdData: CreatePostModel & { blogName: string }) {
    const data = {
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

  async updatePost(
    postId: string,
    updatePost: UpdatePostModel & { blogName: string }
  ) {
    return await postRepository.updatePost({ id: postId, ...updatePost });
  }

  async deletePost(postId: string) {
    return await postRepository.deletePost(postId);
  }
}

export const postService = new PostService();
