# Naama SLP Backend

NestJS API for checking available appointment times and booking appointments in Naama's Google Calendar. The Next.js frontend is a separate project and is not changed here.

## Local setup

Requires Node.js 22.12 or newer on the Node 22 line, npm, and a PostgreSQL database.

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set the database URL, Google OAuth credentials, calendar ID/timezone, working hours, and a private admin API key.
3. Generate the Prisma client: `npm run prisma:generate`.
4. Apply the database migration: `npm run prisma:migrate`.
5. Start the API: `npm run start:dev`.

Swagger documentation is available at `http://localhost:3001/api/docs`.

## Google Calendar access

Configure an OAuth client and authorize Naama's Google account with permission to check calendar availability and create/delete events. Supply the OAuth client ID, client secret, and refresh token through environment variables. Set `GOOGLE_CALENDAR_ID` to `primary` or the ID of Naama's calendar. Use `CALENDAR_TIME_ZONE` matching that calendar; the sample value in `.env.example` should be confirmed for the actual account.

Do not commit real credentials. For production, use a secret manager and rotate the admin API key if it is exposed.

## Schedule configuration

`BOOKING_DAYS` uses ISO weekdays (Monday = `1`, Sunday = `7`). `BOOKING_OPEN_TIME` and `BOOKING_CLOSE_TIME` are local calendar times in 24-hour `HH:mm` format. `APPOINTMENT_DURATION_MINUTES` supplies the default duration, and `APPOINTMENT_SLOT_INTERVAL_MINUTES` controls how often candidate start times are offered. The sample settings describe weekdays from 09:00 to 17:00; update them to Naama's actual schedule before accepting bookings.

Availability requests cover inclusive date ranges up to 31 days. The API returns start and end timestamps in UTC. Calendar free/busy checks and event creation are separate Google Calendar operations; another calendar change in between can still cause a conflict.

## API routes

### Patient routes

- `GET /api/v1/appointments/availability?startDate=2026-10-26&endDate=2026-10-30&durationMinutes=60`
- `POST /api/v1/appointments`

Example request body:

```json
{
  "patientName": "Sam Patient",
  "patientEmail": "sam@example.com",
  "patientPhone": "+972501234567",
  "startsAt": "2026-10-26T09:00:00+02:00",
  "durationMinutes": 60
}
```

Automatic confirmation is on by default. The API returns `CONFIRMED` when an event is created in Google Calendar. When auto-confirm is disabled, a request is stored as `PENDING` and must be approved by Naama.

### Admin routes

Send the private `x-admin-api-key` header with each admin request:

- `GET /api/v1/admin/booking-settings`
- `PATCH /api/v1/admin/booking-settings` with `{"autoConfirm": false}` or `{"autoConfirm": true}`
- `GET /api/v1/admin/appointments/pending`
- `POST /api/v1/admin/appointments/{bookingId}/approve`

The booking-setting and approval endpoints are protected. Do not expose the admin key in the frontend or a public client; call them from a trusted server or administrative tool.

## Data and privacy

Bookings store patient name, email, optional phone, appointment times, status, and the Google Calendar event ID. Calendar events contain the patient's name and a booking reference so the therapist can identify the appointment. Do not put diagnoses, treatment notes, insurance data, or other clinical history in booking requests or calendar events. Provide the required privacy notice before collecting personal information and confirm the practice's privacy, retention, and security requirements before production use.

This first release does not include patient accounts, appointment history, cancellation/rescheduling, notifications, or frontend booking screens.

## Development checks

- Unit tests: `npm test -- --runInBand`
- HTTP end-to-end tests: `npm run test:e2e -- --runInBand`
- Production TypeScript build: `npm run build`
