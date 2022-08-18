import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateQrPosDto {
  @IsNotEmpty()
  @ApiProperty({ example: '25.1234', description: 'A QR koordinátájának hosszúsága' })
  lat: number;

  @IsNotEmpty()
  @ApiProperty({ example: '25.1234', description: 'A QR koordinátájának szélessége' })
  lng: number;
}
