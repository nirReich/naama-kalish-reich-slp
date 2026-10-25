import { ConflictException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarGateway } from '../google-calendar/calendar-gateway';
import { AvailabilityService } from './availability.service';
import { AppointmentsService, CreateAppointmentInput } from './appointments.service';

describe('AppointmentsService', () => {
  const input: CreateAppointmentInput = {
    patientName: 'Sam Patient',
    patientEmail: 'sam@example.com',
    patientPhone: null,
    startsAt: '2026-10-26T09:00:00.000Z',
    durationMinutes: 60,
  };

  function setup(autoConfirm = true) {
    const schedule = {
      timeZone: 'UTC',
      daysOfWeek: [1, 2, 3, 4, 5],
      openingTime: '09:00',
      closingTime: '17:00',
      defaultDurationMinutes: 60,
      slotIntervalMinutes: 60,
      maximumRangeDays: 31,
    };
    const prisma = {
      bookingSettings: {
        upsert: jest.fn().mockResolvedValue({ id: 'default', autoConfirm }),
      },
      booking: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'booking-1', ...data }),
        ),
        findUnique: jest.fn().mockResolvedValue({
          id: 'booking-1',
          patientName: input.patientName,
          patientEmail: input.patientEmail,
          patientPhone: null,
          startsAt: new Date(input.startsAt),
          endsAt: new Date('2026-10-26T10:00:00.000Z'),
          status: 'PENDING',
          googleEventId: null,
        }),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'booking-1', ...data }),
        ),
      },
    } as unknown as PrismaService;
    const calendar = {
      createEvent: jest.fn().mockResolvedValue({ id: 'google-event-1' }),
      deleteEvent: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CalendarGateway>;
    const availability = {
      listAvailableSlots: jest.fn().mockResolvedValue([
        { startsAt: input.startsAt, endsAt: '2026-10-26T10:00:00.000Z' },
      ]),
    } as unknown as jest.Mocked<Pick<AvailabilityService, 'listAvailableSlots'>>;
    return {
      prisma,
      calendar,
      availability,
      service: new AppointmentsService(
        prisma,
        calendar,
        availability as unknown as AvailabilityService,
        schedule,
      ),
    };
  }

  it('creates a Google Calendar event and persists a confirmed booking by default', async () => {
    const { prisma, calendar, service } = setup();

    const booking = await service.createBooking(input);

    expect(booking).toMatchObject({ status: 'CONFIRMED', googleEventId: 'google-event-1' });
    expect(calendar.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({ startsAt: new Date(input.startsAt), patientName: input.patientName }),
    );
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        status: 'CONFIRMED',
        googleEventId: 'google-event-1',
      }),
    });
  });

  it('stores a pending request without creating a calendar event when auto-confirm is disabled', async () => {
    const { prisma, calendar, service } = setup(false);

    const booking = await service.createBooking(input);

    expect(booking.status).toBe('PENDING');
    expect(calendar.createEvent).not.toHaveBeenCalled();
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ status: 'PENDING', googleEventId: null }),
    });
  });

  it('does not confirm a request when its time is no longer available', async () => {
    const { prisma, calendar, availability, service } = setup();
    availability.listAvailableSlots.mockResolvedValue([]);

    await expect(service.createBooking(input)).rejects.toBeInstanceOf(ConflictException);

    expect(calendar.createEvent).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('does not persist a confirmed booking when Google Calendar creation fails', async () => {
    const { prisma, calendar, service } = setup();
    calendar.createEvent.mockRejectedValue(new Error('Google API unavailable'));

    await expect(service.createBooking(input)).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('approves a pending request only after creating its Google Calendar event', async () => {
    const { prisma, calendar, service } = setup();

    const booking = await service.approvePending('booking-1');

    expect(booking).toMatchObject({ status: 'CONFIRMED', googleEventId: 'google-event-1' });
    expect(calendar.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: 'booking-1', patientName: input.patientName }),
    );
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking-1' },
      data: { status: 'CONFIRMED', googleEventId: 'google-event-1' },
    });
  });

  it('refuses to approve a request whose time is no longer available', async () => {
    const { prisma, calendar, availability, service } = setup();
    availability.listAvailableSlots.mockResolvedValue([]);

    await expect(service.approvePending('booking-1')).rejects.toBeInstanceOf(ConflictException);

    expect(calendar.createEvent).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });
});
