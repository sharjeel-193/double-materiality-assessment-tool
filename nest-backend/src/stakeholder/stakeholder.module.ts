import { Module } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { StakeholderResolver } from './stakeholder.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [StakeholderService, StakeholderResolver, PrismaService],
    exports: [StakeholderService],
})
export class StakeholderModule {}
