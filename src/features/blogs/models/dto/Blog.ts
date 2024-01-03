import type { BaseDateEntity } from '@/types';

type BlogBaseDTO = BaseDateEntity & {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogWithMembershipDTO = BlogBaseDTO & {
  isMembership: boolean;
};
