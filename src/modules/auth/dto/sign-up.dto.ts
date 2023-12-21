import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { SignInDto, SignInResDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName!: string;
}

@Exclude()
export class SignUpResDto extends SignInResDto {}
