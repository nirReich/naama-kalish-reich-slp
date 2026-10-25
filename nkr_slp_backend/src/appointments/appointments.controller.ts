import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AvailabilityService } from './availability.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Appointments')
@Controller({ path: 'appointments', version: '1' })
export class AppointmentsController {
  constructor(
    private readonly appointments: AppointmentsService,
    private readonly availability: AvailabilityService,
  ) {}

  @Get('availability')
  @ApiOperation({ summary: 'List available appointment start times.' })
  @ApiOkResponse({
    schema: {
      example: [{ startsAt: '2026-10-26T07:00:00.000Z', endsAt: '2026-10-26T08:00:00.000Z' }],
    },
  })
  listAvailability(@Query() query: AvailabilityQueryDto) {
    return this.availability.listAvailableSlots(
      query.startDate,
      query.endDate,
      query.durationMinutes,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Book an available appointment or create a pending request.' })
  @ApiCreatedResponse({
    schema: {
      example: {
        id: 'booking-uuid',
        status: 'CONFIRMED',
        startsAt: '2026-10-26T07:00:00.000Z',
        endsAt: '2026-10-26T08:00:00.000Z',
      },
    },
  })
  async create(@Body() body: CreateAppointmentDto) {
    const booking = await this.appointments.createBooking({
      patientName: body.patientName,
      patientEmail: body.patientEmail,
      patientPhone: body.patientPhone ?? null,
      startsAt: body.startsAt,
      durationMinutes: body.durationMinutes,
    });
    return {
      id: booking.id,
      status: booking.status,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    };
  }
}
