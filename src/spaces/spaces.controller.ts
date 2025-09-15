import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SpacesService } from './spaces.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('spaces')
export class SpacesController {
  constructor(private spacesService: SpacesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      const parsedBody = {
        ...body,
        capacity: Number(body.capacity),
        hourlyRate: Number(body.hourlyRate),
        dailyRate: Number(body.dailyRate),
        amenities: Array.isArray(body.amenities)
          ? body.amenities
          : JSON.parse(body.amenities || '[]'),
      };

      const images = files.filter(f => f.mimetype.startsWith('image/')).map(f => f.path);
      const videos = files.filter(f => f.mimetype.startsWith('video/')).map(f => f.path);

      return this.spacesService.create({
        ...parsedBody,
        images,
        videos,
      });
    } catch (err) {
      console.error('Error creating space:', err);
      throw err;
    }
  }

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const parsedBody: any = { ...body };
    if (parsedBody.capacity) parsedBody.capacity = Number(parsedBody.capacity);
    if (parsedBody.hourlyRate) parsedBody.hourlyRate = Number(parsedBody.hourlyRate);
    if (parsedBody.dailyRate) parsedBody.dailyRate = Number(parsedBody.dailyRate);
    if (parsedBody.amenities && typeof parsedBody.amenities === 'string') {
      parsedBody.amenities = JSON.parse(parsedBody.amenities);
    }

    return this.spacesService.update(id, parsedBody);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}
