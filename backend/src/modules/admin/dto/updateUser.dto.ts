// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class updateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
}
