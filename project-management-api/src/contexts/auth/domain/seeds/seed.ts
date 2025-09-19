import { Roles } from '../enum';
import { IUser } from '../abstractions';
import { SecurityService } from '../../infrastructure/services/security.service';

const securityUtilService = new SecurityService();
export const UserSeed: IUser[] = [
  {
    name: 'Admin',
    email: 'admin@test.com',
    password: securityUtilService.hashPassword('Password1!'),
    role: Roles.admin,
  },
];
