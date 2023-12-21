import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
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
      username: request.username,
    });

    if (!user) {
      throw new BadRequestException('Username does not exist');
    }

    const isMatch = await bcrypt.compare(
      request.password.concat(request.username),
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password incorect');
    }

    const accessToken = await this.jwtService.signAsync(
      JSON.stringify({
        sub: user.userId,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        exp: process.env.EXPIRY_TIME,
        iat: Date.now(),
      }),
      { secret: process.env.SECRET_KEY },
    );

    return plainToInstance(SignInResDto, {
      ...user,
      accessToken,
    });
  }

  async signUp(request: SignUpDto): Promise<SignUpResDto> {
    const userExisted = await this.userRepository.findOneBy({
      username: request.username,
    });

    if (userExisted) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt();

    const passwordHashed = await bcrypt.hash(
      request.password.concat(request.username),
      salt,
    );

    const user = new User({
      userId: uuidv4(),
      firstName: request.firstName,
      lastName: request.lastName,
      password: passwordHashed,
      username: request.username,
    });

    await this.userRepository.insert(user);

    const accessToken = await this.jwtService.signAsync(
      JSON.stringify({
        sub: user.userId,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        exp: process.env.EXPIRY_TIME,
        iat: Date.now(),
      }),
      { secret: process.env.SECRET_KEY },
    );

    return plainToInstance(SignUpResDto, {
      ...user,
      accessToken,
    });
  }
}
