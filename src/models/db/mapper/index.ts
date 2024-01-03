import type { WithId } from 'mongodb';

type MappedDocumentType<T> = Omit<WithId<T>, '_id'> & { id: string };

export const mapMongoDocumentToPlainId = <T>(
  doc: WithId<T>
): MappedDocumentType<T> => {
  const { _id, ...rest } = doc;
  const mappedDoc: MappedDocumentType<T> = {
    ...rest,
    id: _id.toHexString(),
  };
  return mappedDoc;
};
