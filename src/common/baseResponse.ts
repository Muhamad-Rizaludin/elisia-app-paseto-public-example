export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type BaseResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
  meta: PaginationMeta;
};

export type SuccessResponse<T> = BaseResponse<T> & {
  success: true;
};

export type ErrorResponse = BaseResponse<null> & {
  success: false;
};

export const emptyMeta = (): PaginationMeta => ({
  currentPage: 0,
  pageSize: 0,
  total: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false
});

export const buildMeta = (page: number, pageSize: number, total: number): PaginationMeta => {
  const totalPage = Math.ceil(total / pageSize) || 0;
  return {
    currentPage: page,
    pageSize,
    total,
    totalPage,
    hasNext: page < totalPage,
    hasPrev: page > 1
  };
};

export const successResponse = <T>(
  status: number,
  message: string,
  data: T,
  meta = emptyMeta()
): SuccessResponse<T> => ({
  status,
  success: true,
  message,
  data,
  meta
});

export const errorResponse = (status: number, message: string): ErrorResponse => ({
  status,
  success: false,
  message,
  data: null,
  meta: emptyMeta()
});
