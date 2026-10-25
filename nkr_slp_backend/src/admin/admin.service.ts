import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getBookingSettings() {
    return this.prisma.bookingSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', autoConfirm: true },
      update: {},
    });
  }

  updateBookingSettings(autoConfirm: boolean) {
    return this.prisma.bookingSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', autoConfirm },
      update: { autoConfirm },
    });
  }

  listPendingAppointments() {
    return this.prisma.booking.findMany({
      where: { status: BookingStatus.PENDING },
      orderBy: { startsAt: 'asc' },
      select: {
        id: true,
        patientName: true,
        patientEmail: true,
        patientPhone: true,
        startsAt: true,
        endsAt: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
