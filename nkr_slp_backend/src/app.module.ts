import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
import { PrismaModule } from './prisma/prisma.module';
import { validateEnvironment } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    PrismaModule,
    GoogleCalendarModule,
    AppointmentsModule,
    AdminModule,
  ],
})
export class AppModule {}
