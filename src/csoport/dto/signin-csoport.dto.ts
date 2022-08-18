import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SigninCsoportDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'ABC123' })
  code: string;
}
