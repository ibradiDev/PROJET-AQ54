import { Controller, Get, UseGuards } from '@nestjs/common';
import { AqService } from './aq.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('air-quality')
export class AqController {
  constructor(private aqService: AqService) {}

  @Get('api/current')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Get realtime data for the two stations' })
  @ApiResponse({
    status: 200,
    description: 'Returns current data in JSON format.',
  })
  async getCurrentValues() {
    return await this.aqService.getCurrentStationData();
  }

  @Get('api/hourly-avg')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Get latest hourly average data for the two stations',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns hourly average data in JSON format.',
  })
  async getHourlyAvg() {
    return await this.aqService.getStationHourlyAvg();
  }
}
