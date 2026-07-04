import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [MonitoringModule, PrismaModule],
    controllers: [HealthController],
})
export class HealthModule { }
