import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { randomUUID } from 'node:crypto';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarGateway } from '../google-calendar/calendar-gateway';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { BOOKING_SCHEDULE } from './appointments.constants';
import { AvailabilityService, BookingSchedule } from './availability.service';

export interface CreateAppointmentInput {
  patientName: string;
  patientEmail: string;
  patientPhone: string | null;
  startsAt: string;
  durationMinutes: number;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(GoogleCalendarService) private readonly calendar: CalendarGateway,
    private readonly availability: AvailabilityService,
    @Inject(BOOKING_SCHEDULE) private readonly schedule: BookingSchedule,
  ) {}

  async createBooking(input: CreateAppointmentInput) {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(startsAt.getTime() + input.durationMinutes * 60_000);
    await this.ensureSlotAvailable(startsAt, endsAt, input.durationMinutes);

    const settings = await this.prisma.bookingSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default' },
      update: {},
    });
    const baseData = {
      patientName: input.patientName,
      patientEmail: input.patientEmail,
      patientPhone: input.patientPhone,
      startsAt,
      endsAt,
    };

    if (!settings.autoConfirm) {
      return this.prisma.booking.create({
        data: { ...baseData, status: BookingStatus.PENDING, googleEventId: null },
      });
    }

    const bookingId = randomUUID();
    const event = await this.createCalendarEvent(bookingId, input.patientName, startsAt, endsAt);
    try {
      return await this.prisma.booking.create({
        data: {
          id: bookingId,
          ...baseData,
          status: BookingStatus.CONFIRMED,
          googleEventId: event.id,
        },
      });
    } catch {
      await this.removeCalendarEvent(event.id);
      throw new ServiceUnavailableException('The appointment could not be saved');
    }
  }

  async approvePending(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Appointment request was not found');
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new ConflictException('Only pending appointment requests can be approved');
    }

    const durationMinutes = Math.round((booking.endsAt.getTime() - booking.startsAt.getTime()) / 60_000);
    await this.ensureSlotAvailable(booking.startsAt, booking.endsAt, durationMinutes);
    const event = await this.createCalendarEvent(
      booking.id,
      booking.patientName,
      booking.startsAt,
      booking.endsAt,
    );
    try {
      return await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CONFIRMED, googleEventId: event.id },
      });
    } catch {
      await this.removeCalendarEvent(event.id);
      throw new ServiceUnavailableException('The appointment could not be confirmed');
    }
  }

  private async ensureSlotAvailable(startsAt: Date, endsAt: Date, durationMinutes: number): Promise<void> {
    if (
      !Number.isFinite(startsAt.getTime()) ||
      !Number.isFinite(endsAt.getTime()) ||
      !Number.isInteger(durationMinutes) ||
      durationMinutes <= 0
    ) {
      throw new ConflictException('The requested appointment time is invalid');
    }

    const localDate = DateTime.fromJSDate(startsAt)
      .setZone(this.schedule.timeZone)
      .toISODate();
    if (!localDate) {
      throw new ConflictException('The requested appointment time is invalid');
    }
    const availableSlots = await this.availability.listAvailableSlots(
      localDate,
      localDate,
      durationMinutes,
    );
    const matches = availableSlots.some(
      (slot) =>
        new Date(slot.startsAt).getTime() === startsAt.getTime() &&
        new Date(slot.endsAt).getTime() === endsAt.getTime(),
    );
    if (!matches) {
      throw new ConflictException('The requested appointment time is not available');
    }
  }

  private async createCalendarEvent(
    bookingId: string,
    patientName: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<{ id: string }> {
    try {
      return await this.calendar.createEvent({ bookingId, patientName, startsAt, endsAt });
    } catch {
      throw new ServiceUnavailableException('Google Calendar could not create the appointment');
    }
  }

  private async removeCalendarEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.deleteEvent(eventId);
    } catch {
      // Keep the API response safe; the orphaned Calendar event can be reconciled manually.
    }
  }
}
