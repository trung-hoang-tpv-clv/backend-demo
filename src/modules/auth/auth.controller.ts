import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignInResDto, SignUpDto, SignUpResDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: SignUpResDto,
    description: 'This API to register user',
  })
  async signUp(@Body() data: SignUpDto): Promise<SignUpResDto> {
    return this.authService.signUp(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: SignInResDto,
    description: 'This API to sign-in',
  })
  async signIn(@Body() data: SignInDto): Promise<SignInResDto> {
    return this.authService.signIn(data);
  }
}
