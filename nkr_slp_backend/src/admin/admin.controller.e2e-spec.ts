import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminController } from './admin.controller';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminService } from './admin.service';
import { AppointmentsService } from '../appointments/appointments.service';

describe('AdminController (HTTP)', () => {
  let app: INestApplication;
  const adminService = {
    getBookingSettings: jest.fn().mockResolvedValue({ autoConfirm: true }),
    updateBookingSettings: jest.fn().mockResolvedValue({ autoConfirm: false }),
    listPendingAppointments: jest.fn().mockResolvedValue([
      { id: 'booking-1', patientName: 'Sam Patient', startsAt: '2026-10-26T07:00:00.000Z' },
    ]),
  };
  const appointmentsService = {
    approvePending: jest.fn().mockResolvedValue({ id: 'booking-1', status: 'CONFIRMED' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminApiKeyGuard,
        { provide: 'ADMIN_API_KEY', useValue: 'test-admin-key' },
        { provide: AdminService, useValue: adminService },
        { provide: AppointmentsService, useValue: appointmentsService },
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
    adminService.getBookingSettings.mockResolvedValue({ autoConfirm: true });
    adminService.updateBookingSettings.mockResolvedValue({ autoConfirm: false });
    adminService.listPendingAppointments.mockResolvedValue([
      { id: 'booking-1', patientName: 'Sam Patient', startsAt: '2026-10-26T07:00:00.000Z' },
    ]);
    appointmentsService.approvePending.mockResolvedValue({ id: 'booking-1', status: 'CONFIRMED' });
  });

  it('rejects public requests to change auto-confirm settings', async () => {
    await request(app.getHttpServer())
      .patch('/api/v1/admin/booking-settings')
      .send({ autoConfirm: false })
      .expect(401);

    expect(adminService.updateBookingSettings).not.toHaveBeenCalled();
  });

  it('allows an authenticated admin to change auto-confirm through the API', async () => {
    await request(app.getHttpServer())
      .patch('/api/v1/admin/booking-settings')
      .set('x-admin-api-key', 'test-admin-key')
      .send({ autoConfirm: false })
      .expect(200)
      .expect({ autoConfirm: false });

    expect(adminService.updateBookingSettings).toHaveBeenCalledWith(false);
  });

  it('rejects public requests to approve pending appointments', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/admin/appointments/booking-1/approve')
      .expect(401);

    expect(appointmentsService.approvePending).not.toHaveBeenCalled();
  });

  it('requires admin authentication to list pending appointment requests', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/appointments/pending').expect(401);

    await request(app.getHttpServer())
      .get('/api/v1/admin/appointments/pending')
      .set('x-admin-api-key', 'test-admin-key')
      .expect(200)
      .expect([
        { id: 'booking-1', patientName: 'Sam Patient', startsAt: '2026-10-26T07:00:00.000Z' },
      ]);

    expect(adminService.listPendingAppointments).toHaveBeenCalledTimes(1);
  });
});
