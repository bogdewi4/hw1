type BasePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type CreatePostModel = BasePostModel;
export type UpdatePostModel = BasePostModel;
