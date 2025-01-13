// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, Length, IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

export class createUserDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(5, 255, { message: 'Password must be at least 5 characters long.' })
  password: string;

   @IsString()
   @Transform(({ value }) => value.trim())
   @IsNotEmpty({ message: 'Name is required.' })
   name: string;
}
