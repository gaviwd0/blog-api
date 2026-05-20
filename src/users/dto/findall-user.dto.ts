import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/user.entity';

export class findAllUserDto {
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
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: Role;
}
