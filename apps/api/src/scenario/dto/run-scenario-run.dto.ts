import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export const RUN_TYPES = [
  'success',
  'slow_operation',
  'slow_request',
  'business_event',
  'validation_error',
  'system_error',
  'teapot',
] as const;

export type RunType = (typeof RUN_TYPES)[number];

export class RunScenarioRunDto {
  @ApiProperty({
    enum: RUN_TYPES,
    example: 'success',
    description:
      'Scenario type. Use `teapot` for the Signal 42 easter egg (418).',
  })
  @IsIn(RUN_TYPES)
  type!: RunType;

  @ApiPropertyOptional({ description: 'Optional label stored on ScenarioRun' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Optional JSON metadata (e.g. { "easter": true })',
    example: { easter: true },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
