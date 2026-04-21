import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RunScenarioRunDto } from './dto/run-scenario-run.dto';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenarioService } from './scenario.service';

@ApiTags('scenarios')
@Controller('api/scenarios')
export class ScenarioController {
  constructor(private readonly scenarios: ScenarioService) {}

  @Get()
  @ApiOperation({ summary: 'List recent scenario runs (PostgreSQL)' })
  @ApiQuery({ name: 'limit', required: false, example: 30 })
  @ApiOkResponse({ description: 'Array of ScenarioRun records' })
  list(@Query('limit') limit?: string) {
    const n = limit ? Math.min(100, Math.max(1, parseInt(limit, 10) || 50)) : 50;
    return this.scenarios.listRecent(n);
  }

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute a scenario (canonical PRD shape: type, optional name & metadata)',
  })
  @ApiBody({ type: RunScenarioRunDto })
  @ApiOkResponse({
    description: 'Success path',
    schema: { example: { ok: true, scenario: 'success' } },
  })
  @ApiBadRequestResponse({ description: 'validation_error scenario or bad payload' })
  runCanonical(@Body() body: RunScenarioRunDto) {
    return this.scenarios.executeRun(body);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute a scenario (legacy body: { scenario })',
    deprecated: true,
  })
  @ApiBody({ type: RunScenarioDto })
  @ApiOkResponse({
    description: 'Success path',
    schema: { example: { ok: true, scenario: 'success' } },
  })
  @ApiBadRequestResponse({ description: 'validation_error scenario or bad payload' })
  run(@Body() body: RunScenarioDto) {
    return this.scenarios.execute(body.scenario);
  }
}
