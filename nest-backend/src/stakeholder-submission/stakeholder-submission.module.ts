import { Module } from '@nestjs/common';
import { StakeholderSubmissionService } from './stakeholder-submission.service';
import { StakeholderSubmissionResolver } from './stakeholder-submission.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [
        StakeholderSubmissionService,
        StakeholderSubmissionResolver,
        PrismaService,
    ],
    exports: [StakeholderSubmissionService],
})
export class StakeholderSubmissionModule {}
