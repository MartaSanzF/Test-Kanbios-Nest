import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  password: string;
}
