import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver'; // ✅ Import resolver
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './auth.guard';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard], // ✅ Make sure AuthResolver is here
    exports: [AuthService],
})
export class AuthModule {}
