import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(loginInput: LoginInput) {
        // Input validation
        this.validateLoginInput(loginInput);

        // User validation
        const user = await this.validateUser(
            loginInput.email,
            loginInput.password,
        );

        // Generate and return only access token
        return this.generateAccessToken(user);
    }

    async getCurrentUser(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new UnauthorizedException(
                    'You are not authorized to access this feature',
                );
            }

            // Don't return password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...result } = user;
            return result;
        } catch (error) {
            this.logger.error(
                `Failed to get current user: ${userId}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                'Unable to fetch user details',
            );
        }
    }

    private validateLoginInput(loginInput: LoginInput) {
        if (!loginInput.email || !loginInput.password) {
            throw new BadRequestException(
                'Email and password are required fields',
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginInput.email)) {
            throw new BadRequestException('Please enter a valid email address');
        }
    }

    private async validateUser(email: string, password: string) {
        try {
            this.logger.log(`Login attempt for email: ${email}`);

            const user = await this.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
                include: { company: true },
            });

            if (!user) {
                throw new UnauthorizedException(
                    'No account found with this email address',
                );
            }

            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
                throw new UnauthorizedException(
                    'Invalid password. Please check your credentials and try again',
                );
            }

            this.logger.log(`Successful login for user: ${user.email}`);
            return user;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Login failed for email: ${email}`, error.stack);
            throw new InternalServerErrorException(
                'Unable to process login request. Please try again later',
            );
        }
    }

    private generateAccessToken(user: any) {
        try {
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
            };

            // ✅ Return only access token
            return {
                accessToken: this.jwtService.sign(payload),
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to generate authentication token. Please try again',
            );
        }
    }
}
