// report/report.module.ts
import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [ReportResolver, ReportService, PrismaService],
    exports: [ReportService],
})
export class ReportModule {}
