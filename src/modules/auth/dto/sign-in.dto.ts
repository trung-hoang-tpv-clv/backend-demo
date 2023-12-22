import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  email!: string;

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
  email!: string;

  @Expose()
  accessToken!: string;
}
