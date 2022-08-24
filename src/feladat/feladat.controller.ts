import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, parse } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GetId } from 'src/csoport/decorators/get-id.decorator';
import { AlexGuard } from 'src/csoport/guards/alex.guard';
import { TryFeladatDto } from './dto/try-feladat.dto';
import { FeladatService } from './feladat.service';
import { of } from 'rxjs';

@Controller('feladat')
@UseGuards(AuthGuard())
export class FeladatController {
  constructor(private readonly feladatService: FeladatService) {}

  @Get('get/:id')
  async getTask(@Param('id') id: number, @GetId() csopId: number) {
    return this.feladatService.getTask(id, csopId);
  }

  @Post('/try/:id')
  async try(
    @Body() tryFeladatDto: TryFeladatDto,
    @Param('id') id: number,
    @GetId() csopId: number,
  ) {
    return this.feladatService.try(tryFeladatDto, id, csopId);
  }

  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename(req, file, callback) {
          const filename = `${parse(file.originalname).name.replace(/\s/g, '')}.${uuidv4()}`;
          const ext = parse(file.originalname).ext;
          callback(null, `${filename}${ext}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 15 },
    }),
  )
  async uploadFile(
    @Param('id') id: number,
    @GetId() csopId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.feladatService.try({ answer: file.path }, id, csopId);
  }

  @UseGuards(AlexGuard)
  @Get('getpicture/:id')
  async getPicture(@Param('id') id: number, @Res() res) {
    const fileName = await this.feladatService.getPicture(id);
    return of(res.sendFile(join(process.cwd(), fileName)));
  }

  @UseGuards(AlexGuard)
  @Get('/acceptable')
  async getAcceptable() {
    return this.feladatService.getAcceptable();
  }
  @UseGuards(AlexGuard)
  @Get('/accept/:id')
  async accept(@Param('id') id: number) {
    return this.feladatService.accept(id);
  }
  @UseGuards(AlexGuard)
  @Get('/decline/:id')
  async decline(@Param('id') id: number) {
    return this.feladatService.decline(id);
  }
}
