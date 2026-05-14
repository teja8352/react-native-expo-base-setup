export type ApiSuccess<T> = {
  ok: true;
  data: T;
  status: number;
};

export type ApiFailure = {
  ok: false;
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
