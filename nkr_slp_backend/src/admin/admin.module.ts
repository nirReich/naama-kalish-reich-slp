import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule, AppointmentsModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminApiKeyGuard,
    {
      provide: 'ADMIN_API_KEY',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get<string>('ADMIN_API_KEY', ''),
    },
  ],
})
export class AdminModule {}
