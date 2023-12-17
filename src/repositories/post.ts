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
  static createPost({}: CreatePostModel) {
    const newPost: PostModel = {
      id: new Date().getTime().toString(),
      blogId: '',
      blogName: '',
      content: '',
      shortDescription: '',
      title: '',
    };

    this.posts.push(newPost);
    return newPost;
  }

  static updatePost(post: UpdatePostModel & { id: string }) {
    let blogEntity = this.posts.find(({ id }) => id === post.id);

    if (blogEntity) {
      // blogEntity.name = post.name;
    }

    return !!blogEntity;
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
