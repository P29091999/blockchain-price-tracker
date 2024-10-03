import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class FetchPriceDto {
    @ApiProperty({
        description: 'The blockchain network to fetch the price from',
        example: 'ethereum',
    })
    @IsString()
    chain: string;
}

export class SetPriceAlertDto {
    @ApiProperty({
        description: 'The blockchain network to set the alert for',
        example: 'ethereum',
    })
    @IsString()
    chain: string;

    @ApiProperty({
        description: 'The price at which the alert should trigger',
        example: 3000,
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'The email address to notify when the alert is triggered',
        example: 'hyperhire_assignment@hyperhire.in',
    })
    @IsEmail()
    email: string;
}

export class GetHourlyPricesDto {
    @ApiProperty({
        description: 'The blockchain network to retrieve hourly prices from',
        example: 'ethereum',
    })
    @IsString()
    chain: string;
}
