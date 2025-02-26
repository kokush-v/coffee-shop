export type PaginatedResponse<T> = {
  count: number;
  previous: string | null;
  next: string | null;
  results: T;
};
