export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    username: string;
    created_at: string;
  };
  token: string;
}