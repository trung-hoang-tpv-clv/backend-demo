import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../src/modules/auth/auth.service';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { SignInResDto } from '../../src/modules/auth/dto';
import { User } from '../../src/domain/entities';

const mockUserRepositoryFactory = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  insert: jest.fn((entity) => entity),
}));

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('SignIn', () => {
    it('Should sign-in successful', async () => {
      const username = 'test@gmail.com';
      const password = '123';

      const mockSignIn = jest.spyOn(authService, 'signIn').mockImplementation(
        async (): Promise<SignInResDto> => ({
          userId: '123',
          accessToken: 'token',
          fullName: 'trung hoang',
          username,
        }),
      );

      const result = await authController.signIn({
        username,
        password,
      });

      expect(mockSignIn).toBeCalled();
      expect(mockSignIn).toBeCalledWith({
        username,
        password,
      });
      expect(result.accessToken).toEqual('token');
      expect(result.fullName).toEqual('trung hoang');
      expect(result.username).toEqual(username);
    });
  });

  describe('SignUp', () => {
    it('Should sign-up successful', async () => {
      const username = 'test@gmail.com';
      const password = '123';

      const mockSignUp = jest.spyOn(authService, 'signUp').mockImplementation(
        async (): Promise<SignInResDto> => ({
          userId: '123',
          accessToken: 'token',
          fullName: 'trung hoang',
          username,
        }),
      );

      const result = await authController.signUp({
        username,
        password,
        firstName: "trung",
        lastName: "hoang",
      });

      expect(mockSignUp).toBeCalled();
      expect(mockSignUp).toBeCalledWith({
        username,
        password,
        firstName: "trung",
        lastName: "hoang",
      });
      expect(result.accessToken).toEqual('token');
      expect(result.fullName).toEqual('trung hoang');
      expect(result.username).toEqual(username);
    });
  });
});
