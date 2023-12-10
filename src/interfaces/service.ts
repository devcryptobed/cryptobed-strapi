export interface ServiceResponse<T, K extends keyof T> {
  results: Pick<T, K>[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
