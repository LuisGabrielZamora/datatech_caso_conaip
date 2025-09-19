import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../domain/enum';

export const META_ROLE = 'role';

export const RoleProtected = (...args: Roles[]) => SetMetadata(META_ROLE, args);
