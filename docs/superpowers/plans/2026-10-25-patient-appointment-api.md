# Patient Appointment API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a backend-only NestJS API that checks Naama's Google Calendar availability and creates or queues patient appointment requests.

**Architecture:** The NestJS service uses PostgreSQL and Prisma for booking requests and the auto-confirm setting. Google Calendar is the scheduling source of truth. Public routes expose availability and booking; admin routes use an API key to control confirmation and approve pending requests.

**Tech Stack:** NestJS, TypeScript, PostgreSQL, Prisma, Google Calendar API, class-validator/class-transformer, Swagger/OpenAPI.

**Spec:** `docs/superpowers/specs/2026-10-25-patient-appointment-api-design.md`

## Global Constraints

- Keep this release backend-only; do not modify the Next.js frontend.
- Default `autoConfirm` to `true`; allow changing it through a protected API endpoint.
- Store only the patient name and contact details needed for scheduling, appointment time/duration, status, timestamps, and Google Calendar event ID; do not collect clinical details or insurance.
- Use Google Calendar as the source of truth for busy times and create confirmed events there.
- Keep Google credentials and the admin API key in environment configuration; never commit secrets.
- Keep patched transitive versions of `multer`, `js-yaml`, and `deepmerge-ts` through package overrides when required by the current dependency advisories.
- No frontend screens, patient accounts, appointment cancel/reschedule, or notification delivery in this release.
- Add automated Jest tests for booking rules, authorization, and API behavior; mock Google Calendar and Prisma so tests do not need secrets or live external services.

## Review Focus

- Malformed or out-of-range date/time input must be rejected before calling Google Calendar (DTO validation test).
- A slot that is busy at the final availability check must not be reported as confirmed (booking service test).
- A Google Calendar failure must not leave a booking reported as confirmed (booking service test).
- Disabling auto-confirm must create a pending request without a calendar event (booking service test).
- Public callers must not be able to change booking settings or approve pending requests (HTTP end-to-end authorization tests).

## Files and Responsibilities

- `nkr_slp_backend/package.json`, `package-lock.json`, `tsconfig*.json`: backend scripts and NestJS configuration.
- `nkr_slp_backend/src/main.ts`, `app.module.ts`: application bootstrap, CORS, API versioning, validation, and module composition.
- `nkr_slp_backend/src/config/`: validated environment configuration and booking defaults.
- `nkr_slp_backend/prisma/schema.prisma` and migration files: booking request and booking setting persistence.
- `nkr_slp_backend/src/prisma/`: Prisma service lifecycle.
- `nkr_slp_backend/src/google-calendar/`: Calendar API client, Freebusy lookup, and event creation.
- `nkr_slp_backend/src/appointments/`: public availability/booking routes, DTOs, and booking workflow.
- `nkr_slp_backend/src/admin/`: API-key guard, booking settings, and pending approval route.
- `nkr_slp_backend/.env.example`, `README.md`: local setup, credentials, route usage, and operating notes.

## Implementation Tasks

### Task 1: Scaffold the NestJS backend

**Files:** backend project files listed above, excluding Prisma and feature modules.

- [x] Initialize a standalone NestJS TypeScript project in `nkr_slp_backend/` without modifying the frontend; retain the Jest test setup.
- [x] Configure scripts for development, build, and production start; enable strict TypeScript settings.
- [x] Add environment loading and validation for the database URL, Google Calendar credentials/calendar ID/timezone, admin API key, and booking defaults.
- [x] Add Swagger/OpenAPI setup at `/api/docs` and version the API under `/api/v1`.
- [x] Confirm `npm run build` succeeds.

### Task 2: Add booking persistence

**Files:** `prisma/schema.prisma`, Prisma migration/configuration, `src/prisma/`.

- [x] Define a `Booking` model with patient name, email, optional phone, start/end timestamps, status (`PENDING` or `CONFIRMED`), optional `googleEventId`, and created/updated timestamps.
- [x] Define a persisted booking setting with `autoConfirm` defaulting to `true`.
- [x] Add Prisma client lifecycle management and initialize the default setting safely.
- [x] Generate and validate the development migration SQL. Applying it locally remains pending because this workspace has no PostgreSQL URL or server configured.

### Task 3: Implement Google Calendar access and public availability

**Files:** `src/google-calendar/`, `src/appointments/availability*`, app module wiring.

- [x] Create a Google Calendar adapter that loads credentials from environment configuration, queries Freebusy, and creates events with minimal non-clinical details.
- [x] Add `GET /api/v1/appointments/availability?startDate=...&endDate=...` with validated ISO date inputs and configured appointment duration/working-hours rules.
- [x] Return available appointment start times in the configured calendar timezone and handle Calendar API errors without leaking credentials.
- [x] Add unit tests for ISO date validation, time-window calculation, and busy-slot exclusion using a mocked Calendar adapter.
- [x] Run `npm test -- --runInBand` and confirm the availability tests pass.
- [x] Confirm `npm run build` succeeds.

### Task 4: Implement public booking and confirmation behavior

**Files:** `src/appointments/` DTOs, controller, and service.

- [x] Add `POST /api/v1/appointments` accepting patient name, email, optional phone, start time, and duration.
- [x] Recheck Calendar availability immediately before attempting event creation.
- [x] With `autoConfirm=true`, create the Calendar event and persist a confirmed booking with its event ID.
- [x] With `autoConfirm=false`, persist a pending booking and do not create a Calendar event.
- [x] Ensure Calendar failures or conflicts never produce a confirmed API response.
- [x] Add unit tests for default auto-confirm, pending mode, final slot conflicts, Calendar failures, and successful event ID persistence with mocked Prisma and Calendar dependencies.
- [x] Run `npm test -- --runInBand` and confirm the booking tests pass.

### Task 5: Implement protected admin controls

**Files:** `src/admin/` API-key guard, controller, DTOs, and service.

- [x] Protect admin routes with a constant-time comparison against the configured admin API key.
- [x] Add `GET /api/v1/admin/booking-settings` and `PATCH /api/v1/admin/booking-settings` for the `autoConfirm` setting.
- [x] Add `GET /api/v1/admin/appointments/pending` to return pending requests ordered by appointment time with only the details Naama needs to review them.
- [x] Add `POST /api/v1/admin/appointments/:id/approve`; it must require a pending booking, recheck availability, create the Calendar event, and then mark the booking confirmed.
- [x] Return safe conflict and authorization errors.
- [x] Add HTTP end-to-end tests proving public access to admin routes is rejected, valid admin credentials can change settings, and pending requests require authorization.
- [x] Run `npm run test:e2e -- --runInBand` and confirm the admin/API tests pass.
- [x] Confirm `npm run build` succeeds.

### Task 6: Document setup and API operation

**Files:** `nkr_slp_backend/.env.example`, `nkr_slp_backend/README.md`.

- [x] Document PostgreSQL setup, Prisma migration commands, Google Calendar authorization and required calendar permissions, environment variables, and API documentation URL.
- [x] Include request/response examples for availability, booking, toggling auto-confirm, and approving a pending request.
- [x] State that credentials are not committed and that calendar events must not contain diagnosis, treatment, insurance, or other clinical history.
- [x] Run `npm test -- --runInBand`, `npm run test:e2e -- --runInBand`, and `npm run build`; report that applying the migration and live Calendar access require configured services and credentials.
