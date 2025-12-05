export interface ApiResponseType<T> {
  status: boolean;
  message: string;
  data: T;
}

export type AuthData = {
  id: string;
  email: string;
  name: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  photo: string;
};
