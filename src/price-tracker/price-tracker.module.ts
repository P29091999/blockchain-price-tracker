import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';
import { PriceTrackerController } from './price-tracker.controller';
import { PriceTrackerService } from './price-tracker.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Price, Alert]),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'thereciprocalolutions.projects@gmail.com',
                    pass: 'cgenxthsgpwplxoy',
                },
            },
            defaults: {
                from: '"No Reply" <thereciprocalolutions.projects@gmail.com>',
            },
        }),
    ],
    providers: [PriceTrackerService],
    controllers: [PriceTrackerController],
})
export class PriceTrackerModule {}
