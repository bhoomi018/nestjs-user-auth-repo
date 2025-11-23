// src/auth/guards/jwt-auth.guard.ts
// Simple wrapper around Passport JWT AuthGuard

import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}
