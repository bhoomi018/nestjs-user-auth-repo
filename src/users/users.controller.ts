// src/users/users.controller.ts
// Routes: profile, update, soft-delete, admin list, avatar upload

import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Query,
  Delete,
  ForbiddenException,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @CurrentUser() user,
  ) {
    if (user.role !== 'admin') throw new ForbiddenException('Admin only');
    return this.usersService.findAll({ page: Number(page), limit: Number(limit), search });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user) {
    return this.usersService.findById(user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  deleteMe(@CurrentUser() user) {
    return this.usersService.softDelete(user.userId);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
      }),
    }),
  )
  async uploadAvatar(@CurrentUser() user, @UploadedFile() file) {
    await this.usersService.update(user.userId, { avatar: file.filename } as any);
    return { message: 'Uploaded', filename: file.filename };
  }
}
