import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class SecurityService {
  hashPassword(password: string): string {
    const salt = genSaltSync();
    return hashSync(password, salt);
  }

  validatePassword(loginPassword: string, storePassword: string): boolean {
    return compareSync(loginPassword, storePassword);
  }
}
