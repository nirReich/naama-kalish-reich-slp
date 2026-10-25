import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiProperty({ example: '2026-10-26', description: 'First calendar date to check (inclusive).' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  startDate!: string;

  @ApiProperty({ example: '2026-10-30', description: 'Last calendar date to check (inclusive).' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  endDate!: string;

  @ApiPropertyOptional({ minimum: 15, maximum: 240, default: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;
}
