import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateBookingSettingsDto {
  @ApiProperty({ example: false, description: 'When false, new appointment submissions remain pending.' })
  @IsBoolean()
  autoConfirm!: boolean;
}
