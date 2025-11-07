export interface AuthResponse {
  token: string;
  managerName?: string;
  yearId?: number;
  schoolName?: string;
  userName?: string;
  schoolId?: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  errorMasseges: string[];
  result: T;          // make this generic, not `any`
}
