import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { findAllUserDto } from './dto/findall-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// el create user es el auth/register
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: findAllUserDto) {
    return this.usersService.findAll(query);
  }

  // pide rol admin o mismo id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() userReq: { id: string; username: string; role: string },
  ) {
    return this.usersService.findOne(id, userReq);
  }

  // pide rol admin o mismo id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() userReq: { id: string; username: string; role: string },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto, userReq);
  }

  // pide rol admin o mismo id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() userReq: { id: string; username: string; role: string },
  ) {
    return this.usersService.remove(id, userReq);
  }
}
