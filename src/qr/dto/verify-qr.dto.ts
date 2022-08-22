import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyQrDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'kod123', description: 'A QR kód kódja' })
  code: string;
}
