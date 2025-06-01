import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Import PrismaModule to access PrismaService
    providers: [UserService, UserResolver],
    exports: [UserService], // Export if other modules need UserService
})
export class UserModule {}
