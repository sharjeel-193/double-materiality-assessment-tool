import { Module } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { DimensionResolver } from './dimension.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [DimensionService, DimensionResolver],
    exports: [DimensionService],
})
export class DimensionModule {}
