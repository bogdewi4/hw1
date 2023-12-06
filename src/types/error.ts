type ErrorMessage = {
  message: string;
  field: string;
};

export type Error = {
  errorsMessages: ErrorMessage[];
};
