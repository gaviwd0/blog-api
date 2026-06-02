import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class findAllTagsDto {
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
  name?: string;
}
