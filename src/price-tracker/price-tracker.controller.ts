import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
    FetchPriceDto,
    GetHourlyPricesDto,
    SetPriceAlertDto,
} from './dto/price-tracker.dto';
import { PriceTrackerService } from './price-tracker.service';

@Controller('prices')
export class PriceTrackerController {
    constructor(private readonly priceTrackerService: PriceTrackerService) {}

    @Get('fetch/:chain')
    async fetchPrice(@Param() fetchPriceDto: FetchPriceDto) {
        const { chain } = fetchPriceDto;
        return this.priceTrackerService.getPriceFromAPI(chain);
    }

    @Post('alert')
    async setPriceAlert(@Body() alertDto: SetPriceAlertDto) {
        await this.priceTrackerService.setPriceAlert(alertDto);
        return { message: 'Alert set successfully' };
    }

    @Get('hourly/:chain')
    async getHourlyPrices(@Param() getHourlyPricesDto: GetHourlyPricesDto) {
        const { chain } = getHourlyPricesDto;
        return this.priceTrackerService.getHourlyPrices(chain);
    }
}
