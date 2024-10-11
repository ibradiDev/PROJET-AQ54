import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AqModule } from './aq/aq.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthService } from './firebase/firebase-auth.service';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AqModule,
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    PrismaService,
    FirebaseAuthService,
    FirebaseAuthGuard,
  ],
})
export class AppModule {}
