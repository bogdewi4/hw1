import { RESOLUTIONS } from '../types';

type Constraint = {
  maxLength?: number;
};

enum Limitaion {
  MAX_LENGTH = 'maxLength',
}

export const isValidString = (value: string, constraint?: Constraint) => {
  if (!value) {
    throw new Error('Value is not existed.');
  }

  if (typeof value !== 'string') {
    throw new Error('Value is not a string.');
  }

  if (constraint) {
    const constraints = Object.entries(constraint);

    return constraints.every(([constraint, limit]) => {
      switch (constraint) {
        case Limitaion.MAX_LENGTH:
          return value.trim().length <= limit;
        default:
          throw new Error('Cannot find constraint.');
      }
    });
  }

  return true;
};

export const isValidResolutions = (resolutions: string[]) => {
  if (!resolutions) {
    throw new Error('Resolutions is not existed.');
  }

  if (!Array.isArray(resolutions)) {
    throw new Error('Resolutions is not an array.');
  }

  if (!resolutions.length) {
    throw new Error('Resolutions cannot be empty.');
  }

  return resolutions.every((resolution) => RESOLUTIONS.includes(resolution));
};
