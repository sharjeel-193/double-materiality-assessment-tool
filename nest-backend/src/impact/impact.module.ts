import { Module } from '@nestjs/common';
import { ImpactService } from './impact.service';
import { ImpactResolver } from './impact.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [ImpactService, ImpactResolver, PrismaService],
    exports: [ImpactService],
})
export class ImpactModule {}
