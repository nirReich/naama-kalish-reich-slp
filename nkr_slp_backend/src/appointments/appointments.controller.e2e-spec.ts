import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AvailabilityService } from './availability.service';

describe('AppointmentsController (HTTP)', () => {
  let app: INestApplication;
  const appointmentsService = { createBooking: jest.fn() };
  const availabilityService = { listAvailableSlots: jest.fn().mockResolvedValue([]) };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: appointmentsService },
        { provide: AvailabilityService, useValue: availabilityService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    availabilityService.listAvailableSlots.mockResolvedValue([]);
  });

  it('rejects malformed dates before querying availability', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/appointments/availability?startDate=tomorrow&endDate=2026-10-26')
      .expect(400);

    expect(availabilityService.listAvailableSlots).not.toHaveBeenCalled();
  });

  it('rejects invalid patient contact data before creating a booking', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/appointments')
      .send({
        patientName: 'Sam Patient',
        patientEmail: 'not-an-email',
        startsAt: '2026-10-26T09:00:00Z',
        durationMinutes: 60,
      })
      .expect(400);

    expect(appointmentsService.createBooking).not.toHaveBeenCalled();
  });
});
