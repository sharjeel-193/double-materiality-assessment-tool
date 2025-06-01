import { Module } from '@nestjs/common';
import { StandardService } from './standard.service';
import { StandardResolver } from './standard.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [StandardService, StandardResolver],
    exports: [StandardService],
})
export class StandardModule {}
