import type { WithId } from 'mongodb';

import type { BlogWithMembershipDTO } from '../dto';
import type { BlogDB } from '../../../../models/db';

export const blogMapper = ({
  _id,
  ...blogDb
}: WithId<BlogDB>): BlogWithMembershipDTO => {
  return {
    id: _id.toString(),
    name: blogDb.name,
    description: blogDb.description,
    websiteUrl: blogDb.websiteUrl,
    isMembership: blogDb.isMembership,
    createdAt: blogDb.createdAt,
  };
};
