import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // Create fake copy of UsersService
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // Create new instance of AuthService with all dependencies initialized
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('fakeemail@fake.com', 'abc123');

    expect(user.password).not.toEqual('abc123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if users signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'test123');
    await expect(service.signup('test@test.com', 'test123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with a user that doesnt exist', (done) => {
    service
      .signin('test@test.com', 'test123!')
      .catch((err: BadRequestException) => {
        expect(err.message).toEqual('user not found');
        done();
      });
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'test123!');
    await expect(
      service.signin('test@test.com', 'badpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'password123!');
    const user = await service.signin('test@test.com', 'password123!');
    expect(user).toBeDefined();
  });
});
