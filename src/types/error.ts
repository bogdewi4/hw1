type ErrorMessage = {
  message: string;
  field: string;
};

export type Error = {
  errorMessages: ErrorMessage[];
};
