import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const SCENARIO_TYPES = [
  'system_error',
  'success',
  'slow_operation',
  'validation_error',
  'business_event',
] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export class RunScenarioDto {
  @ApiProperty({
    enum: SCENARIO_TYPES,
    example: 'success',
    description: 'Scenario to execute',
  })
  @IsIn(SCENARIO_TYPES)
  scenario!: ScenarioType;
}
