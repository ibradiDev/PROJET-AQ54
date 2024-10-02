import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AqModule } from './aq/aq.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AqModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
