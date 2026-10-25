import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { BOOKING_SCHEDULE, CALENDAR_FREE_BUSY } from './appointments.constants';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AvailabilityService, BookingSchedule } from './availability.service';

function parseDays(value: string): number[] {
  const days = value.split(',').map((part) => Number(part.trim()));
  if (days.some((day) => !Number.isInteger(day) || day < 1 || day > 7)) {
    throw new Error('BOOKING_DAYS must be comma-separated ISO weekdays from 1 to 7');
  }
  return [...new Set(days)];
}

function parsePositiveInteger(value: string, name: string): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return number;
}

@Module({
  imports: [PrismaModule, GoogleCalendarModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    AvailabilityService,
    { provide: CALENDAR_FREE_BUSY, useExisting: GoogleCalendarService },
    {
      provide: BOOKING_SCHEDULE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): BookingSchedule => {
        const timeZone = config.get<string>('CALENDAR_TIME_ZONE', 'UTC');
        try {
          new Intl.DateTimeFormat('en-US', { timeZone });
        } catch {
          throw new Error('CALENDAR_TIME_ZONE must be a valid IANA timezone');
        }
        return {
          timeZone,
          daysOfWeek: parseDays(config.get<string>('BOOKING_DAYS', '1,2,3,4,5')),
          openingTime: config.get<string>('BOOKING_OPEN_TIME', '09:00'),
          closingTime: config.get<string>('BOOKING_CLOSE_TIME', '17:00'),
          defaultDurationMinutes: parsePositiveInteger(
            config.get<string>('APPOINTMENT_DURATION_MINUTES', '60'),
            'APPOINTMENT_DURATION_MINUTES',
          ),
          slotIntervalMinutes: parsePositiveInteger(
            config.get<string>('APPOINTMENT_SLOT_INTERVAL_MINUTES', '60'),
            'APPOINTMENT_SLOT_INTERVAL_MINUTES',
          ),
          maximumRangeDays: 31,
        };
      },
    },
  ],
  exports: [AppointmentsService, AvailabilityService],
})
export class AppointmentsModule {}
