import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateQrDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'ValamiKod',
    description: 'A QR kód egyedi azonosítója, mely a QR-be van írva',
  })
  kod: string;

  @ApiProperty({ example: '2', description: 'Hány pontot ér a megtalálása', default: '1' })
  ertek: number;

  @ApiProperty({ example: '1', description: 'Hányszor használható', default: '1' })
  hasznalhato: number;

  @ApiProperty({
    example: '25.1234',
    description: 'A QR koordinátájának hosszúsága',
    default: '0.0',
  })
  lat: number;

  @ApiProperty({
    example: '25.1234',
    description: 'A QR koordinátájának szélessége',
    default: '0.0',
  })
  lng: number;
}
