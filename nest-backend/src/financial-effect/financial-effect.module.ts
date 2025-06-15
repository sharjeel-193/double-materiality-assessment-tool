import { Module } from '@nestjs/common';
import { FinancialEffectService } from './financial-effect.service';
import { FinancialEffectResolver } from './financial-effect.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [FinancialEffectService, FinancialEffectResolver, PrismaService],
    exports: [FinancialEffectService],
})
export class FinancialEffectModule {}
