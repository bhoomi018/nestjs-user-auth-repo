// src/auth/auth.service.ts
// Business logic for registration and login

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
    });

    return { id: created._id, name: created.name, email: created.email };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email, isDeleted: false });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id.toString(), role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
