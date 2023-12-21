import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

@Exclude()
export class SignInResDto {
  @Expose()
  userId!: string;

  @Expose()
  fullName!: string;

  @Expose()
  username!: string;

  @Expose()
  accessToken!: string;
}
