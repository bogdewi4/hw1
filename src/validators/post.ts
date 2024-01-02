import { body } from 'express-validator';

import { inputValidation } from '../middlewares/input-model';

import { blogRepository as blogQueryRepository } from '../query-repositories';

export const titleValidation = body('title')
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Incorrect title!');

export const shortDescriptionValidation = body('shortDescription')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Incorrect shortDescription!');

export const contentValidation = body('content')
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Incorrect content!');

export const blogIdValidation = body('blogId')
  .isString()
  .trim()
  .custom(async (value) => {
    const blog = await blogQueryRepository.getBlogById(value);

    if (!blog) {
      throw Error('Incorrect blogId!');
    }

    return true;
  })
  .withMessage('Incorrect blogId!');

export const basePostValidations = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];

export const postValidation = () => [
  ...basePostValidations(),
  blogIdValidation,
  inputValidation,
];
