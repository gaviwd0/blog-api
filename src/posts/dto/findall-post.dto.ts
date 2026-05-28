import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class findAllPostDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  tags?: [string];
}
