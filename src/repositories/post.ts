import { db } from '../db';
import { PostModel, CreatePostModel, UpdatePostModel } from '../models/posts';

export class PostRepository {
  static get posts() {
    return db.posts;
  }

  static getAllPosts() {
    return this.posts;
  }
  static getPostById(id: string) {
    return this.posts.find((post) => post.id === id);
  }
  static createPost(post: CreatePostModel & { blogName: string }) {
    const newPost: PostModel = {
      id: new Date().getTime().toString(),
      ...post,
    };

    this.posts.push(newPost);
    return newPost;
  }

  static updatePost(post: UpdatePostModel & { id: string; blogName: string }) {
    let postEntity = this.posts.find(({ id }) => id === post.id);

    if (postEntity) {
      Object.assign(postEntity, { ...post });
    }

    return !!postEntity;
  }

  static deletePost(id: string) {
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      if (post.id === id) {
        this.posts.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}
