import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TryFeladatDto {
  @IsNotEmpty()
  @ApiProperty({ example: '23' })
  answer: string;
}
