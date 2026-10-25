# Patient Appointment API Design

## Goal

Let patients view available appointment times and book appointments with Naama through a NestJS API that uses Google Calendar as the scheduling source of truth. The initial release is backend-only; it does not add frontend screens or clinical-record functionality.

## Stack

- NestJS with TypeScript
- PostgreSQL with Prisma
- Google Calendar API through Google's Node.js client
- DTO validation with `class-validator` and `class-transformer`
- OpenAPI documentation for the API

## API behavior

- `GET /api/v1/appointments/availability?start=...&end=...` checks Naama's configured calendar and returns available times within the requested range.
- `POST /api/v1/appointments` accepts a patient's name and contact details plus the requested start time and duration. The API rechecks calendar availability before creating a booking.
- Automatic confirmation is enabled by default. When enabled, a free slot is added to Google Calendar and returned as confirmed.
- `GET /api/v1/admin/booking-settings` returns the current `autoConfirm` setting.
- `PATCH /api/v1/admin/booking-settings` changes `autoConfirm`. This endpoint is protected by an admin API key; it is not public.
- When `autoConfirm` is disabled, booking submissions are saved as pending requests and are not added to Google Calendar until an authorized approval request is made.
- `GET /api/v1/admin/appointments/pending` lists pending requests for review. It is protected by the admin API key so the approval flow can be operated without a frontend.
- `POST /api/v1/admin/appointments/:id/approve` approves a pending request, rechecks calendar availability, creates the Google Calendar event, and marks the booking confirmed. It is protected by the admin API key.

## Data and calendar handling

- PostgreSQL stores booking requests and their status, the `autoConfirm` setting, and the Google Calendar event ID after a confirmed event is created.
- Booking records contain only the patient name, contact details needed to respond, requested appointment time/duration, status, and timestamps. No insurance, diagnosis, treatment notes, or other clinical history is collected in this first release.
- Google Calendar is the source of truth for busy times. The API reads availability from the calendar and creates events there for confirmed bookings.
- Calendar event text is limited to the information Naama needs to identify and manage the appointment; it will not contain diagnosis or treatment details.
- Appointment times are stored in UTC and interpreted using Naama's configured Google Calendar timezone.

## Security and failure handling

- Patient booking and availability endpoints are public but validate and limit input; admin settings and approval endpoints require the admin API key.
- Google Calendar credentials are provided through environment configuration and are never returned by API responses.
- If Google Calendar is unavailable, the API returns a service error and does not report the booking as confirmed.
- The API rechecks the requested slot immediately before creating a calendar event. Calendar availability checks and event creation are separate Google Calendar operations, so an external calendar change during that small window can still create a conflict; the API will minimize this window and report conflicts clearly.
- Avoid sensitive patient details in calendar events, logs, and error responses.

## Out of scope for this release

- Frontend booking screens
- Patient accounts, sign-in, and self-service appointment history
- Canceling or rescheduling appointments
- Insurance processing and clinical records
- Automatic SMS/email notifications
- Multi-provider or multi-calendar scheduling

## Open implementation detail

Naama's Google Calendar must be connected with credentials that permit availability checks and event creation. The actual credentials and calendar identifier will be supplied through deployment configuration; no secrets are committed to the repository.

The appointment duration and bookable working hours are not specified yet. For an initial implementation, these can be configuration values rather than a scheduling UI; the duration should be fixed for each booking unless the practice requires multiple appointment types.
