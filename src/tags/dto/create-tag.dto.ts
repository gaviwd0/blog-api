import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nombre de la etiqueta',
    example: 'Tecnologia',
    required: true,
    nullable: false,
  })
  name!: string;
}
