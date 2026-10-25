import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from '../appointments/appointments.service';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminService } from './admin.service';
import { UpdateBookingSettingsDto } from './dto/update-booking-settings.dto';

@ApiTags('Admin')
@ApiSecurity('admin-api-key')
@UseGuards(AdminApiKeyGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly appointments: AppointmentsService,
  ) {}

  @Get('booking-settings')
  @ApiOperation({ summary: 'Read booking settings.' })
  getBookingSettings() {
    return this.admin.getBookingSettings();
  }

  @Patch('booking-settings')
  @ApiOperation({ summary: 'Enable or disable automatic appointment confirmation.' })
  updateBookingSettings(@Body() body: UpdateBookingSettingsDto) {
    return this.admin.updateBookingSettings(body.autoConfirm);
  }

  @Get('appointments/pending')
  @ApiOperation({ summary: 'List pending appointment requests for review.' })
  listPendingAppointments() {
    return this.admin.listPendingAppointments();
  }

  @Post('appointments/:id/approve')
  @ApiOperation({ summary: 'Approve a pending appointment request.' })
  async approve(@Param('id') id: string) {
    const booking = await this.appointments.approvePending(id);
    return {
      id: booking.id,
      status: booking.status,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    };
  }
}
