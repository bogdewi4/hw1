import { body } from 'express-validator';

 

import { basePostValidations } from './post';
import {inputValidation} from '../middlewares/input-model';

export const nameValidation = body('name')
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Incorrect name!');

export const descriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Incorrect description!');

export const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Incorrect websiteUrl!')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/gi
  )
  .withMessage('Incorrect websiteUrl!');

export const blogValidation = () => [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
  inputValidation,
];

export const blogPostValidation = () => [
  ...basePostValidations(),
  inputValidation,
];
