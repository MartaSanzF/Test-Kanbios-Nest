// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, Length, IsNotEmpty, Validate } from 'class-validator';

export class createUserDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string;

  @IsString()
  @Length(5, 255, { message: 'Password must be at least 5 characters long.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
}
