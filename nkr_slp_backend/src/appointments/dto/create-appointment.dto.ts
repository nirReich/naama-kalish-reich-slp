import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDivisibleBy,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Sam Patient', maxLength: 120 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  patientName!: string;

  @ApiProperty({ example: 'sam@example.com', maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  patientEmail!: string;

  @ApiPropertyOptional({ example: '+972501234567', maxLength: 40 })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  patientPhone?: string | null;

  @ApiProperty({ example: '2026-10-26T09:00:00+02:00' })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i)
  startsAt!: string;

  @ApiProperty({ minimum: 15, maximum: 240, multipleOf: 15, example: 60 })
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(240)
  @IsDivisibleBy(15)
  durationMinutes!: number;
}
