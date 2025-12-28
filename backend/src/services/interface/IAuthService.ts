export interface IAuthService {
  handleGoogleLogin(user: any): Promise<any>;
  getProfile(user: any): Promise<any>;
  refresh(cookies: any, role?: string): Promise<any>;
  santaLogin(password: string): Promise<any>;
}
