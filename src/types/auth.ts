export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}