// context/context.module.ts
import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { ContextResolver } from './context.resolver';
import { PrismaService } from '../prisma/prisma.service';

// Import enums to ensure they're registered
// import './entities/enums';

@Module({
    providers: [ContextResolver, ContextService, PrismaService],
    exports: [ContextService],
})
export class ContextModule {}
