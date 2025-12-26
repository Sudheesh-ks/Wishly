import { AuthDTO } from '../dtos/auth.dto';

export const toAuthDTO = (data: any, role: string): AuthDTO => ({
  _id: data._id.toString(),
  email: role === 'santa' ? 'santa@northpole.com' : data.email,
  role,
});
