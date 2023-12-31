export type BlogDB = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};
export type PostDB = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
export type UserDB = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
};
