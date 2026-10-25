const REQUIRED_ENVIRONMENT_KEYS = [
  'DATABASE_URL',
  'ADMIN_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_CALENDAR_ID',
  'CALENDAR_TIME_ZONE',
  'BOOKING_DAYS',
  'BOOKING_OPEN_TIME',
  'BOOKING_CLOSE_TIME',
  'APPOINTMENT_DURATION_MINUTES',
  'APPOINTMENT_SLOT_INTERVAL_MINUTES',
] as const;

function parseClockTime(value: string, name: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`${name} must use HH:mm`);
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new Error(`${name} must be a valid 24-hour time`);
  }
  return hour * 60 + minute;
}

function parseQuarterHourInteger(value: string, name: string): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 15 || number > 240 || number % 15 !== 0) {
    throw new Error(`${name} must be a multiple of 15 between 15 and 240`);
  }
  return number;
}

export function validateEnvironment(environment: Record<string, string | undefined>) {
  for (const key of REQUIRED_ENVIRONMENT_KEYS) {
    if (!environment[key]?.trim()) {
      throw new Error(`${key} is required`);
    }
  }

  if ((environment.ADMIN_API_KEY?.length ?? 0) < 32) {
    throw new Error('ADMIN_API_KEY must contain at least 32 characters');
  }

  let databaseUrl: URL;
  try {
    databaseUrl = new URL(environment.DATABASE_URL as string);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL');
  }
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the PostgreSQL protocol');
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: environment.CALENDAR_TIME_ZONE });
  } catch {
    throw new Error('CALENDAR_TIME_ZONE must be a valid IANA timezone');
  }

  const days = (environment.BOOKING_DAYS as string).split(',').map((day) => Number(day.trim()));
  if (
    days.length === 0 ||
    days.some((day) => !Number.isInteger(day) || day < 1 || day > 7)
  ) {
    throw new Error('BOOKING_DAYS must be comma-separated ISO weekdays from 1 to 7');
  }

  const openingTime = parseClockTime(environment.BOOKING_OPEN_TIME as string, 'BOOKING_OPEN_TIME');
  const closingTime = parseClockTime(environment.BOOKING_CLOSE_TIME as string, 'BOOKING_CLOSE_TIME');
  if (closingTime <= openingTime) {
    throw new Error('BOOKING_CLOSE_TIME must be after BOOKING_OPEN_TIME');
  }

  parseQuarterHourInteger(
    environment.APPOINTMENT_DURATION_MINUTES as string,
    'APPOINTMENT_DURATION_MINUTES',
  );
  parseQuarterHourInteger(
    environment.APPOINTMENT_SLOT_INTERVAL_MINUTES as string,
    'APPOINTMENT_SLOT_INTERVAL_MINUTES',
  );
  return environment;
}
