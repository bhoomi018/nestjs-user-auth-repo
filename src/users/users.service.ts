// src/users/users.service.ts
// Business methods for user CRUD-like operations

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    if ((dto as any).password) {
      const bcrypt = await import('bcryptjs');
      (dto as any).password = await bcrypt.hash((dto as any).password, 10);
    }
    const updated = await this.userModel.findByIdAndUpdate(id, dto as any, { new: true }).select('-password');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async softDelete(id: string) {
    const u = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!u) throw new NotFoundException('User not found');
    return { message: 'User soft-deleted' };
  }

  async findAll(options: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = options;
    const filter: any = { isDeleted: false };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const data = await this.userModel.find(filter).select('-password').skip(skip).limit(Number(limit));
    const total = await this.userModel.countDocuments(filter);
    return { data, total, page, limit };
  }
}
