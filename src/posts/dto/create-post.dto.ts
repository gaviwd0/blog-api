import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
