// API Response Types based on documentation

export interface ApiErrorDetail {
  property: string;
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  statusCode: number;
  error: string;
  errorCode: string;
  message: string;
  details: ApiErrorDetail[];
}

export interface LoginSuccessResponse {
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_expires: number;
}

export interface RegisterSuccessResponse {
  message: string;
  status_code: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

// Error codes for login API
export enum LoginErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
}

// Error codes for register API
export enum RegisterErrorCode {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  REGISTRATION_DISABLED = 'REGISTRATION_DISABLED',
  EMAIL_DOMAIN_RESTRICTED = 'EMAIL_DOMAIN_RESTRICTED',
}

// HTTP Status Codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
}
