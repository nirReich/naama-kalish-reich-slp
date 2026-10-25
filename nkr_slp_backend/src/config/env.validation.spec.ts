import { validateEnvironment } from './env.validation';

const validEnvironment = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/naama_slp',
  ADMIN_API_KEY: 'a-long-admin-secret-with-more-than-32-characters',
  GOOGLE_CLIENT_ID: 'client-id.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'client-secret',
  GOOGLE_REFRESH_TOKEN: 'refresh-token',
  GOOGLE_CALENDAR_ID: 'primary',
  CALENDAR_TIME_ZONE: 'Asia/Jerusalem',
  BOOKING_DAYS: '1,2,3,4,5',
  BOOKING_OPEN_TIME: '09:00',
  BOOKING_CLOSE_TIME: '17:00',
  APPOINTMENT_DURATION_MINUTES: '60',
  APPOINTMENT_SLOT_INTERVAL_MINUTES: '60',
};

describe('validateEnvironment', () => {
  it('accepts a complete environment with a valid schedule and secrets', () => {
    expect(validateEnvironment(validEnvironment)).toEqual(validEnvironment);
  });

  it('rejects missing Google credentials before the API starts', () => {
    const { GOOGLE_REFRESH_TOKEN: _refreshToken, ...environment } = validEnvironment;

    expect(() => validateEnvironment(environment)).toThrow('GOOGLE_REFRESH_TOKEN is required');
  });

  it('rejects a closing time that does not follow the opening time', () => {
    expect(() =>
      validateEnvironment({ ...validEnvironment, BOOKING_CLOSE_TIME: '08:00' }),
    ).toThrow('BOOKING_CLOSE_TIME must be after BOOKING_OPEN_TIME');
  });
});
