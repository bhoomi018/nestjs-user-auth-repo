// src/auth/dto/register.dto.ts
// Validation DTO for registration

import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
