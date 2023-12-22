import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/modules/auth/auth.service';
import { fakeUserData } from '../mock/fake-user';
import { User } from '../../src/domain/entities';

const mockUserRepositoryFactory = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  insert: jest.fn((entity) => entity),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('SignIn', () => {
    it('Should sign-in successful', async () => {
      const username = 'test@gmail.com';
      const password = '123';
      const fakeUser = fakeUserData({
        username,
        password,
      });
      const mockGetUser = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => fakeUser);

      const mockComparePassword = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      const fakeToken = 'token';
      const mockGetAccessToken = jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => fakeToken);

      const result = await authService.signIn({
        username,
        password,
      });

      expect(mockGetUser).toBeCalled();
      expect(mockGetUser).toBeCalledWith({
        username: 'test@gmail.com',
      });
      expect(mockComparePassword).toBeCalled();
      expect(mockGetAccessToken).toBeCalled();
      expect(result.accessToken).toEqual(fakeToken);
      expect(result.fullName).toEqual(
        `${fakeUser.firstName} ${fakeUser.lastName}`,
      );
      expect(result.username).toEqual(username);
    });

    it('Should throw error user does not exist', async () => {
      const mockGetUser = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(() => null);

      await authService
        .signIn({
          username: 'test@gmail.com',
          password: '123',
        })
        .catch((error) => {
          expect(error.message).toEqual('Username does not exist');
          expect(error).toBeInstanceOf(BadRequestException);
        });
      expect(mockGetUser).toBeCalled();
      expect(mockGetUser).toBeCalledWith({
        username: 'test@gmail.com',
      });
    });

    it('Should throw error when password not match', async () => {
      const username = 'test@gmail.com';
      const password = '123';
      const fakeUser = fakeUserData({
        username,
        password,
      });
      const mockGetUser = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => fakeUser);

      const mockComparePassword = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => false);
      await authService
        .signIn({
          username: 'test@gmail.com',
          password: '123',
        })
        .catch((error) => {
          expect(error.message).toEqual('Password incorect');
          expect(error).toBeInstanceOf(BadRequestException);
        });
      expect(mockComparePassword).toBeCalled();
      expect(mockGetUser).toBeCalled();
      expect(mockGetUser).toBeCalledWith({
        username: 'test@gmail.com',
      });
    });
  });

  describe('SignUp', () => {
    it('Should sign-up successful', async () => {
      const mockGetUser = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => null);

      const passwordHashed = 'password_hashed';
      const mockHashPassword = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => passwordHashed);

      const fakeToken = 'token';
      const mockGetAccessToken = jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => fakeToken);

      const result = await authService.signUp({
        firstName: 'trung',
        lastName: 'hoang',
        username: 'test@gmail.com',
        password: '123',
      });

      expect(mockGetUser).toBeCalled();
      expect(mockGetUser).toBeCalledWith({
        username: 'test@gmail.com',
      });
      expect(mockHashPassword).toBeCalled();
      expect(mockGetAccessToken).toBeCalled();
      expect(result.accessToken).toEqual(fakeToken);
      expect(result.fullName).toEqual('trung hoang');
      expect(result.username).toEqual('test@gmail.com');
    });

    it('Should throw error user already exist', async () => {
      const mockGetUser = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => fakeUserData());

      await authService
        .signUp({
          firstName: 'trung',
          lastName: 'hoang',
          username: 'test@gmail.com',
          password: '123',
        })
        .catch((error) => {
          expect(error.message).toEqual('User already exist');
          expect(error).toBeInstanceOf(BadRequestException);
        });
      expect(mockGetUser).toBeCalled();
      expect(mockGetUser).toBeCalledWith({
        username: 'test@gmail.com',
      });
    });
  });
});
