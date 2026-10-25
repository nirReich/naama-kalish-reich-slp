import { CalendarBusyInterval } from '../appointments/availability.service';

export interface CalendarEventDetails {
  bookingId: string;
  patientName: string;
  startsAt: Date;
  endsAt: Date;
}

export interface CalendarGateway {
  getBusyIntervals(start: Date, end: Date): Promise<CalendarBusyInterval[]>;
  createEvent(details: CalendarEventDetails): Promise<{ id: string }>;
  deleteEvent(eventId: string): Promise<void>;
}
