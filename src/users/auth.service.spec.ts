import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of UsersService
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('throws an error if users signs up with email that is in use', (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'testperson@test.com',
          password: 'password123',
        } as User,
      ]);

    service
      .signup('test@test.com', 'test123')
      .catch((err: BadRequestException) => {
        expect(err.message).toEqual('email currently in use');
        done();
      });
  });

  it('throws an error if signin is called with a user that doesnt exist', (done) => {
    service
      .signin('test@test.com', 'test123!')
      .catch((err: BadRequestException) => {
        expect(err.message).toEqual('user not found');
        done();
      });
  });

  it('throws an error if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'test@test.com', password: 'test123!' } as User,
      ]);

    await expect(service.signin('test@t.com', 'password')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'a',
          password:
            '05101ae2e62275c1.2061a2ab9a85c3900fd67f7a1ddae293a904591e34c428283bca142880578bc2',
        } as User,
      ]);

    const user = await service.signin('test@test.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
