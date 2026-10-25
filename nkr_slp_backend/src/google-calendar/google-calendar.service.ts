import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { calendar_v3, google } from 'googleapis';
import { CalendarBusyInterval } from '../appointments/availability.service';
import { CalendarEventDetails, CalendarGateway } from './calendar-gateway';

@Injectable()
export class GoogleCalendarService implements CalendarGateway {
  private readonly client: calendar_v3.Calendar;
  private readonly calendarId: string;
  private readonly timeZone: string;

  constructor(config: ConfigService) {
    const oauthClient = new google.auth.OAuth2(
      config.get<string>('GOOGLE_CLIENT_ID'),
      config.get<string>('GOOGLE_CLIENT_SECRET'),
    );
    const refreshToken = config.get<string>('GOOGLE_REFRESH_TOKEN');
    if (refreshToken) {
      oauthClient.setCredentials({ refresh_token: refreshToken });
    }
    this.client = google.calendar({ version: 'v3', auth: oauthClient });
    this.calendarId = config.get<string>('GOOGLE_CALENDAR_ID', 'primary');
    this.timeZone = config.get<string>('CALENDAR_TIME_ZONE', 'UTC');
  }

  async getBusyIntervals(start: Date, end: Date): Promise<CalendarBusyInterval[]> {
    try {
      const response = await this.client.freebusy.query({
        requestBody: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          items: [{ id: this.calendarId }],
        },
      });
      const intervals = response.data.calendars?.[this.calendarId]?.busy ?? [];
      return intervals
        .filter((interval): interval is { start: string; end: string } =>
          Boolean(interval.start && interval.end),
        )
        .map((interval) => ({ start: new Date(interval.start), end: new Date(interval.end) }));
    } catch {
      throw new ServiceUnavailableException('Google Calendar is unavailable');
    }
  }

  async createEvent(details: CalendarEventDetails): Promise<{ id: string }> {
    try {
      const response = await this.client.events.insert({
        calendarId: this.calendarId,
        requestBody: {
          summary: `Appointment: ${details.patientName}`,
          description: `Booking reference: ${details.bookingId}`,
          start: { dateTime: details.startsAt.toISOString(), timeZone: this.timeZone },
          end: { dateTime: details.endsAt.toISOString(), timeZone: this.timeZone },
        },
      });
      if (!response.data.id) {
        throw new Error('Google Calendar did not return an event ID');
      }
      return { id: response.data.id };
    } catch {
      throw new ServiceUnavailableException('Google Calendar could not create the appointment');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.client.events.delete({ calendarId: this.calendarId, eventId });
    } catch {
      throw new ServiceUnavailableException('Google Calendar could not remove the appointment');
    }
  }
}
