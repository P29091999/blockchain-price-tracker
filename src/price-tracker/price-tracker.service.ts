import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Between, Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';

@Injectable()
export class PriceTrackerService {
    private readonly logger = new Logger(PriceTrackerService.name);

    constructor(
        @InjectRepository(Price)
        private readonly priceRepository: Repository<Price>,
        private readonly mailerService: MailerService,
        @InjectRepository(Alert)
        private readonly alertRepository: Repository<Alert>,
    ) {}

    @Cron('*/5 * * * *')
    async fetchPrices() {
        const chains = ['ethereum', 'polygon'];
        for (const chain of chains) {
            const price = await this.getPriceFromAPI(chain);
            await this.priceRepository.save({ chain, price });
            this.logger.debug(`Saved price for ${chain}: ${price}`);
        }
    }

    @Cron('*/5 * * * *')
    async checkPriceAlerts() {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        const prices = await this.priceRepository.find({
            where: { timestamp: Between(oneHourAgo, now) },
            order: { timestamp: 'ASC' },
        });

        for (const chain of ['ethereum', 'polygon']) {
            const chainPrices = prices.filter((price) => price.chain === chain);

            if (chainPrices.length > 0) {
                const latestPrice = chainPrices[chainPrices.length - 1].price;
                const oneHourAgoPrice = chainPrices[0].price;

                const percentageChange =
                    ((latestPrice - oneHourAgoPrice) / oneHourAgoPrice) * 100;

                if (percentageChange > 3) {
                    await this.mailerService.sendMail({
                        to: 'hyperhire_assignment@hyperhire.in',
                        subject: `Price Alert: ${chain.toUpperCase()} increased by more than 3%`,
                        text: `The price of ${chain.toUpperCase()} has increased by ${percentageChange.toFixed(2)}% in the last hour. Current price: $${latestPrice}.`,
                    });

                    this.logger.debug(`Sent email alert for ${chain}`);
                }
            }
        }
    }

    async getHourlyPrices(chain: string): Promise<any> {
        const now = new Date();
        const twentyFourHoursAgo = new Date(
            now.getTime() - 24 * 60 * 60 * 1000,
        );

        const prices = await this.priceRepository.find({
            where: { chain, timestamp: Between(twentyFourHoursAgo, now) },
            order: { timestamp: 'ASC' },
        });

        const hourlyPrices = prices.reduce((acc, curr) => {
            const hour = curr.timestamp.getHours();
            acc[hour] = curr;
            return acc;
        }, {});

        return Object.values(hourlyPrices);
    }

    async getPriceFromAPI(chain: string): Promise<number> {
        try {
            let url = '';
            let tokenAddress = '';
            if (chain === 'ethereum') {
                tokenAddress = '0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2';
                url = `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/price`;
            } else if (chain === 'polygon') {
                tokenAddress = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0';
                url = `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/price`;
            } else {
                throw new Error(`Unsupported chain: ${chain}`);
            }

            const response = await axios.get(url, {
                headers: {
                    accept: 'application/json',
                    'x-api-key':
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjI4YWFiYTQ0LTllODctNDA2NS1hODRiLWZhMTc0NTM3MzBhYiIsIm9yZ0lkIjoiNDEwMzU4IiwidXNlcklkIjoiNDIxNzA3IiwidHlwZUlkIjoiMTZjMTQ4NDgtNzQ0Ny00N2FkLTk3OTYtOTJiZjM1ZWIwZmM0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjc5NzcwNDUsImV4cCI6NDg4MzczNzA0NX0.Jk62MZ_M6rpYY8SHXYpDVytu3R9mr4LJKtjSHk_ebfQ',
                },
            });

            const price = response.data.usdPrice;

            return price;
        } catch (error) {
            throw new Error(`Failed to fetch price for ${chain}`);
        }
    }

    async setPriceAlert(alertDto: {
        chain: string;
        price: number;
        email: string;
    }) {
        const alert = this.alertRepository.create(alertDto);
        await this.alertRepository.save(alert);
        this.logger.debug(
            `Alert set for ${alert.chain} at $${alert.price} for ${alert.email}`,
        );
        await this.mailerService.sendMail({
            to: alertDto.email,
            subject: `Price Alert Set for ${alertDto.chain.toUpperCase()}`,
            text: `Your price alert for ${alertDto.chain.toUpperCase()} at $${alertDto.price} has been successfully set. You will be notified once the price reaches this value.`,
        });

        return { message: 'Alert set successfully' };
    }

    async sendAlertEmail(email: string, chain: string, currentPrice: number) {
        await this.mailerService.sendMail({
            to: email,
            subject: `Price Alert for ${chain.toUpperCase()}`,
            text: `The price of ${chain.toUpperCase()} has reached $${currentPrice}.`,
        });
    }
}
