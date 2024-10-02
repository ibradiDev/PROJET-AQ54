import { Module } from '@nestjs/common';
import { AqService } from './aq.service';
import { AqController } from './aq.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AqService, PrismaService],
  controllers: [AqController],
})
export class AqModule {}
