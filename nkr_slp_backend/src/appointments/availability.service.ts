import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { CALENDAR_FREE_BUSY, BOOKING_SCHEDULE } from './appointments.constants';

export interface CalendarBusyInterval {
  start: Date;
  end: Date;
}

export interface CalendarFreeBusy {
  getBusyIntervals(start: Date, end: Date): Promise<CalendarBusyInterval[]>;
}

export interface BookingSchedule {
  timeZone: string;
  daysOfWeek: number[];
  openingTime: string;
  closingTime: string;
  defaultDurationMinutes: number;
  slotIntervalMinutes: number;
  maximumRangeDays: number;
}

export interface AvailableSlot {
  startsAt: string;
  endsAt: string;
}

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(CALENDAR_FREE_BUSY) private readonly calendar: CalendarFreeBusy,
    @Inject(BOOKING_SCHEDULE) private readonly schedule: BookingSchedule,
  ) {}

  async listAvailableSlots(
    startDate: string,
    endDate: string,
    durationMinutes = this.schedule.defaultDurationMinutes,
  ): Promise<AvailableSlot[]> {
    const firstDay = this.parseDate(startDate);
    const lastDay = this.parseDate(endDate);

    if (lastDay < firstDay) {
      throw new BadRequestException('endDate must be on or after startDate');
    }

    const firstOrdinal = Date.UTC(firstDay.year, firstDay.month - 1, firstDay.day);
    const lastOrdinal = Date.UTC(lastDay.year, lastDay.month - 1, lastDay.day);
    const rangeDays = Math.floor((lastOrdinal - firstOrdinal) / 86_400_000) + 1;
    if (rangeDays > this.schedule.maximumRangeDays) {
      throw new BadRequestException(
        `Date range cannot exceed ${this.schedule.maximumRangeDays} days`,
      );
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new BadRequestException('durationMinutes must be a positive integer');
    }

    const queryStart = firstDay.startOf('day');
    const queryEnd = lastDay.plus({ days: 1 }).startOf('day');
    const busy = await this.calendar.getBusyIntervals(
      queryStart.toUTC().toJSDate(),
      queryEnd.toUTC().toJSDate(),
    );
    const slots: AvailableSlot[] = [];
    const now = Date.now();

    for (let day = firstDay; day <= lastDay; day = day.plus({ days: 1 })) {
      if (!this.schedule.daysOfWeek.includes(day.weekday)) {
        continue;
      }

      const opening = this.atTime(day, this.schedule.openingTime);
      const closing = this.atTime(day, this.schedule.closingTime);
      if (closing <= opening) {
        throw new Error('Configured closingTime must be after openingTime');
      }

      for (
        let slotStart = opening;
        slotStart.plus({ minutes: durationMinutes }) <= closing;
        slotStart = slotStart.plus({ minutes: this.schedule.slotIntervalMinutes })
      ) {
        if (slotStart.toMillis() < now) {
          continue;
        }
        const slotEnd = slotStart.plus({ minutes: durationMinutes });
        const overlapsBusyTime = busy.some(
          (interval) =>
            interval.start.getTime() < slotEnd.toMillis() &&
            interval.end.getTime() > slotStart.toMillis(),
        );
        if (!overlapsBusyTime) {
          slots.push({
            startsAt: slotStart.toUTC().toISO() as string,
            endsAt: slotEnd.toUTC().toISO() as string,
          });
        }
      }
    }

    return slots;
  }

  private parseDate(value: string): DateTime {
    const date = DateTime.fromISO(value, { zone: this.schedule.timeZone });
    if (!date.isValid || date.toISODate() !== value) {
      throw new BadRequestException('Dates must use the YYYY-MM-DD format');
    }
    return date.startOf('day');
  }

  private atTime(day: DateTime, time: string): DateTime {
    const match = /^(\d{2}):(\d{2})$/.exec(time);
    if (!match) {
      throw new Error('Configured booking hours must use HH:mm');
    }
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const result = day.set({ hour, minute, second: 0, millisecond: 0 });
    if (!result.isValid || result.hour !== hour || result.minute !== minute) {
      throw new Error('Configured booking hour is invalid for the calendar timezone');
    }
    return result;
  }
}
