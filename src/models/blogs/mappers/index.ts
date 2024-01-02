import type { WithId } from 'mongodb';

import type { BlogModel } from '../output';
import { BlogDB } from '../../db';

export const blogMapper = ({ _id, ...blogDb }: WithId<BlogDB>): BlogModel => {
  return {
    id: _id.toString(),
    name: blogDb.name,
    description: blogDb.description,
    websiteUrl: blogDb.websiteUrl,
    isMembership: blogDb.isMembership,
    createdAt: blogDb.createdAt,
  };
};
