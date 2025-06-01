// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(createUserInput: CreateUserInput) {
        const user = await this.prisma.user.create({
            data: createUserInput,
        });
        return {
            success: true,
            message: 'User created successfully',
            data: user,
        };
    }

    async update(id: string, updateUserInput: UpdateUserInput) {
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserInput,
        });
        return {
            success: true,
            message: 'User updated successfully',
            data: user,
        };
    }

    async findAll() {
        const users = await this.prisma.user.findMany();
        return {
            success: true,
            message: `Found ${users.length} users`,
            data: users,
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return {
            success: true,
            message: 'User found',
            data: user,
        };
    }

    async findByCompany(companyId: string) {
        const users = await this.prisma.user.findMany({ where: { companyId } });
        return {
            success: true,
            message: `Found ${users.length} users for company`,
            data: users,
        };
    }
}
