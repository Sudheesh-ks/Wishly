import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';
import { IAuthService } from '../interface/IAuthService';
import { toAuthDTO } from '../../mappers/auth.mapper';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { IAdminRepository } from '../../repositories/interface/IAdminRepository';

export class AuthService implements IAuthService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _adminRepo: IAdminRepository
  ) { }

  async handleGoogleLogin(user: any) {
    return {
      accessToken: generateAccessToken(user._id, user.email, 'user'),
      refreshToken: generateRefreshToken(user._id),
    };
  }

  async getProfile(user: any) {
    if (user.role === 'santa') return toAuthDTO(await this._adminRepo.findById(user.id), 'santa');
    return toAuthDTO(await this._userRepo.findById(user.id), 'user');
  }

  async refresh(cookies: any, role?: string) {
    const userToken = cookies.refreshToken_user;
    const santaToken = cookies.refreshToken_santa;

    if (!userToken && !santaToken) throw new Error('No refresh token');

    let token = '';
    let targetRole = '';

    if (role === 'santa') {
      if (!santaToken) throw new Error('No santa refresh token');
      token = santaToken;
      targetRole = 'santa';
    } else if (role === 'user') {
      if (!userToken) throw new Error('No user refresh token');
      token = userToken;
      targetRole = 'user';
    } else {
      // Fallback or mixed scenario (prioritize existing logic or user)
      token = userToken || santaToken;
      targetRole = userToken ? 'user' : 'santa';
    }


    const decoded = verifyRefreshToken(token);

    if (targetRole === 'user') {
      const user = await this._userRepo.findById(decoded.id);
      if (!user) throw new Error('User not found');

      return {
        token: generateAccessToken(user._id.toString(), user.email, 'user'),
        role: 'user',
      };
    }

    const admin = await this._adminRepo.findById(decoded.id);
    if (!admin) throw new Error('Santa not found');

    return {
      token: generateAccessToken(admin._id.toString(), 'santa@northpole.com', 'santa'),
      role: 'santa',
    };
  }

  async santaLogin(password: string) {
    const admin = await this._adminRepo.findOne({});
    const valid = await bcrypt.compare(password, admin!.password);
    if (!valid) throw new Error('Invalid password');

    return {
      accessToken: generateAccessToken(admin!._id.toString(), 'santa@northpole.com', 'santa'),
      refreshToken: generateRefreshToken(admin!._id.toString()),
    };
  }
}
