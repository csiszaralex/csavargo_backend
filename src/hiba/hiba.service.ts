import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHibaDto } from './dto/create-hiba.dto';

@Injectable()
export class HibaService {
  constructor(private prisma: PrismaService) {}

  create(createHibaDto: CreateHibaDto, ip: string, ua: string) {
    const { eloidezes, leiras, link } = createHibaDto;
    return this.prisma.hiba.create({ data: { eloidezes, leiras, link, ip, ua } });
  }
}
