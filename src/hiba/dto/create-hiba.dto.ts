import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateHibaDto {
  @IsNotEmpty()
  @ApiProperty({ example: '/' })
  link: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Valami történt' })
  leiras: string;

  @ApiProperty({ example: 'Eddig ilyen nem volt' })
  eloidezes: string;
}
