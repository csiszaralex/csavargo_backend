import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FeladatTaskDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Hány kiskacsa úszik?' })
  feladat: string;
}
