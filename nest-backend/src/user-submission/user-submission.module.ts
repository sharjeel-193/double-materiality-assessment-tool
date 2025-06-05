// user-submission/user-submission.module.ts
import { Module } from '@nestjs/common';
import { UserSubmissionService } from './user-submission.service';
import { UserSubmissionResolver } from './user-submission.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [UserSubmissionResolver, UserSubmissionService, PrismaService],
    exports: [UserSubmissionService],
})
export class UserSubmissionModule {}
