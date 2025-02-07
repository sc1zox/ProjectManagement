export interface ApiResponse<T> {
  code: number;
  data: T;
  details: unknown;
  error: unknown;
}
