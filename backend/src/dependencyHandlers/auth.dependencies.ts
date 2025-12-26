import { AuthController } from '../controllers/implementation/AuthController';
import { AdminRepository } from '../repositories/implementation/AdminRepository';
import { UserRepository } from '../repositories/implementation/UserRepository';
import { AuthService } from '../services/implementation/AuthService';


const userRepository = new UserRepository();
const adminRepository = new AdminRepository();

const authService = new AuthService(userRepository, adminRepository);

export const authController = new AuthController(authService);
