import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { User } from '../../domain/entities';
import { SignInDto, SignInResDto, SignUpDto, SignUpResDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(request: SignInDto): Promise<SignInResDto> {
    const user = await this.userRepository.findOneBy({
      email: request.email,
    });

    if (!user) {
      throw new BadRequestException('email does not exist');
    }

    const isMatch = await bcrypt.compare(
      request.password.concat(request.email),
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password incorect');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
    }, { secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRY_TIME });

    return plainToInstance(SignInResDto, {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      accessToken,
    });
  }

  async signUp(request: SignUpDto): Promise<SignUpResDto> {
    const userExisted = await this.userRepository.findOneBy({
      email: request.email,
    });

    if (userExisted) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt();

    const passwordHashed = await bcrypt.hash(
      request.password.concat(request.email),
      salt,
    );

    const user = new User({
      userId: uuidv4(),
      code: faker.finance.bic(),
      firstName: request.firstName,
      lastName: request.lastName,
      password: passwordHashed,
      email: request.email,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
    }, { secret: process.env.JWT_SECRET_KEY, expiresIn: process.env.JWT_EXPIRY_TIME });

    await this.userRepository.insert(user);

    return plainToInstance(SignUpResDto, {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      accessToken,
    });
  }
}
