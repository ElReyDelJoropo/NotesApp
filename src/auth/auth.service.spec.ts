import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { FakeUserRepository } from 'src/user/repositories/fake.user.repository';
import { JwtModule } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: DeepMocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'misecreto101',
          signOptions: {
            expiresIn: '200s',
          },
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Login', () => {
    it('Happy path, user logins successfully', async () => {
      const randomUser = FakeUserRepository.generateRandomUser();

      userService.findBy.mockImplementationOnce(async () => randomUser);

      const access_token = await authService.login({
        email: randomUser.email,
        password: randomUser.password,
      });

      expect(access_token).toMatchObject({
        access_token: expect.any(String),
      });
    });
    it('Valid credentials but user is not registered', async () => {
      userService.findBy.mockImplementationOnce(async () => null);
      const loginRejected = async () =>
        await authService.login({
          email: 'noexist@noexist.com',
          password: '12345678',
        });

      expect(loginRejected).rejects.toThrowError(BadRequestException);
    });

    describe('Register', () => {
      it('Successfully registered', async () => {
        const { id, ...userDto } = FakeUserRepository.generateRandomUser();

        userService.create.mockResolvedValue({ id, ...userDto });
        userService.findBy.mockImplementationOnce(async () => null);

        const newUser = await authService.register(userDto);

        expect(newUser).toMatchObject<User>({
          ...userDto,
          id: expect.any(String),
        });
      });

      // it('Failed because user already exist', async () => {
      //   const { id, ...userDto } = FakeUserRepository.generateRandomUser();
      //
      //   userService.create.mockResolvedValue({ id, ...userDto });
      //
      //   userService.findBy.mockImplementationOnce(async () =>
      //     FakeUserRepository.generateRandomUser(),
      //   );
      //
      //   const registerRejected = async () =>
      //     await authService.register(userDto);
      //
      //   expect(registerRejected).rejects.toThrowError(BadRequestException);
      // });
    });
  });
});
