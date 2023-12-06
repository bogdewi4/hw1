import { RESOLUTIONS } from '../types';

type Constraint = {
  maxLength?: number;
};

enum Limitaion {
  MAX_LENGTH = 'maxLength',
}

export const isValidString = (value: string, constraint?: Constraint) => {
  if (!value) {
    // throw new Error('Value is not existed.');
    return false;
  }

  if (typeof value !== 'string') {
    // throw new Error('Value is not a string.');
    return false;
  }

  if (constraint) {
    const constraints = Object.entries(constraint);

    return constraints.every(([constraint, limit]) => {
      switch (constraint) {
        case Limitaion.MAX_LENGTH:
          return value.trim().length <= limit;
        default:
          //   throw new Error('Cannot find constraint.');
          return false;
      }
    });
  }

  return true;
};

export const isValidResolutions = (resolutions: string[]) => {
  if (!resolutions) {
    // throw new Error('Resolutions is not existed.');
    return false;
  }

  if (!Array.isArray(resolutions)) {
    // throw new Error('Resolutions is not an array.');
    return false;
  }

  if (!resolutions.length) {
    // throw new Error('Resolutions cannot be empty.');
    return false;
  }

  return resolutions.every((resolution) => RESOLUTIONS.includes(resolution));
};

export const isValidMinAgeRestriction = (minAgeRestriction: any) => {
  return (
    minAgeRestriction &&
    typeof minAgeRestriction === 'number' &&
    (minAgeRestriction >= 1 || minAgeRestriction <= 18)
  );
};
export const isValidTypeOf = (
  value: any,
  type: 'boolean' | 'string' | 'number'
) => {
  return value && typeof value === type;
};
