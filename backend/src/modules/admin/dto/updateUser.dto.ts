// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, Length, IsNotEmpty, Validate } from 'class-validator';

export class updateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
}
