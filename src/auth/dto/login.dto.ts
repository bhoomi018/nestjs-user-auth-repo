// src/auth/dto/login.dto.ts
// Validation DTO for login

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
