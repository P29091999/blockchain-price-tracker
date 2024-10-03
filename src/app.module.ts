import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTrackerModule } from './price-tracker/price-tracker.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            username: 'postgres.fumkqloqwkgpmfecusci',
            password: 'Pulkit@123#',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
        }),
        ScheduleModule.forRoot(),
        PriceTrackerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
