import { BadRequestException } from '@nestjs/common';
import { AvailabilityService, BookingSchedule, CalendarBusyInterval, CalendarFreeBusy } from './availability.service';

describe('AvailabilityService', () => {
  const schedule: BookingSchedule = {
    timeZone: 'UTC',
    daysOfWeek: [1, 2, 3, 4, 5],
    openingTime: '09:00',
    closingTime: '12:00',
    defaultDurationMinutes: 60,
    slotIntervalMinutes: 60,
    maximumRangeDays: 31,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-25T08:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns only bookable slots that do not overlap Google Calendar busy intervals', async () => {
    const busy: CalendarBusyInterval[] = [
      {
        start: new Date('2026-10-26T10:00:00.000Z'),
        end: new Date('2026-10-26T11:00:00.000Z'),
      },
    ];
    const calendar: CalendarFreeBusy = {
      getBusyIntervals: jest.fn().mockResolvedValue(busy),
    };
    const service = new AvailabilityService(calendar, schedule);

    const slots = await service.listAvailableSlots('2026-10-26', '2026-10-26');

    expect(slots).toEqual([
      { startsAt: '2026-10-26T09:00:00.000Z', endsAt: '2026-10-26T10:00:00.000Z' },
      { startsAt: '2026-10-26T11:00:00.000Z', endsAt: '2026-10-26T12:00:00.000Z' },
    ]);
    expect(calendar.getBusyIntervals).toHaveBeenCalledWith(
      new Date('2026-10-26T00:00:00.000Z'),
      new Date('2026-10-27T00:00:00.000Z'),
    );
  });

  it('rejects a reversed date range before querying Google Calendar', async () => {
    const calendar: CalendarFreeBusy = {
      getBusyIntervals: jest.fn().mockResolvedValue([]),
    };
    const service = new AvailabilityService(calendar, schedule);

    await expect(service.listAvailableSlots('2026-10-27', '2026-10-26')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(calendar.getBusyIntervals).not.toHaveBeenCalled();
  });

  it('does not return appointment slots in the past', async () => {
    const calendar: CalendarFreeBusy = {
      getBusyIntervals: jest.fn().mockResolvedValue([]),
    };
    const service = new AvailabilityService(calendar, schedule);

    const slots = await service.listAvailableSlots('2020-10-26', '2020-10-26');

    expect(slots).toEqual([]);
  });

  it('converts configured local working hours to UTC timestamps', async () => {
    const calendar: CalendarFreeBusy = {
      getBusyIntervals: jest.fn().mockResolvedValue([]),
    };
    const service = new AvailabilityService(calendar, {
      ...schedule,
      timeZone: 'Asia/Bangkok',
      closingTime: '10:00',
    });

    const slots = await service.listAvailableSlots('2026-10-26', '2026-10-26');

    expect(slots).toEqual([
      { startsAt: '2026-10-26T02:00:00.000Z', endsAt: '2026-10-26T03:00:00.000Z' },
    ]);
  });
});
