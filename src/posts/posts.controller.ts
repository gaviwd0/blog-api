import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalGuard } from '../auth/guards/jwt-optional.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { findAllPostDto } from './dto/findall-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // si tiene auth o admin -> acceso a privados y deleteds
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() userReq: { id: string; username: string; role: string },
  ) {
    return this.postsService.create(createPostDto, userReq);
  }

  @Get()
  @UseGuards(JwtOptionalGuard)
  findAll(
    @Query() query: findAllPostDto,
    @CurrentUser() user?: { id: string; username: string; role: string },
  ) {
    return this.postsService.findAll(query, user?.id, user?.role);
  }

  // si tiene auth o admin -> acceso a privados y deleteds
  @Get(':id')
  @UseGuards(JwtOptionalGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() userReq?: { id: string; username: string; role: string },
  ) {
    return this.postsService.findOne(+id, userReq);
  }

  // auth o admin
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() userReq: { id: string; username: string; role: string },
  ) {
    return this.postsService.update(+id, updatePostDto, userReq);
  }

  // auth o admin
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() userReq: { id: string; username: string; role: string },
  ) {
    return this.postsService.remove(+id, userReq);
  }
}
