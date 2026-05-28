import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  imageProfile?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
