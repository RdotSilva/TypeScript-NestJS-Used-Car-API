import { UsersService } from './users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Use promise rather than callback for scrypt
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if user already exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email currently in use');
    }

    // Encrypt password and create user
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(email, result);

    return user;
  }
}
