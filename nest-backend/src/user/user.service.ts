/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(createUserInput: CreateUserInput) {
        // Hash password before saving!
        const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
        const userData = {
            ...createUserInput,
            password: hashedPassword,
        };
        return this.prisma.user.create({ data: userData });
    }

    async findAll() {
        // Exclude passwords from returned users
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...rest }) => rest);
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        // Exclude password
        const { password, ...rest } = user;
        return rest;
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async update(id: string, updateUserInput: UpdateUserInput) {
        // If password is being updated, hash it
        const data = { ...updateUserInput } as any;
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        // Exclude password
        const { password, ...rest } = user;
        return rest;
    }

    async remove(id: string) {
        // Optionally check if user exists first
        await this.findOne(id);
        await this.prisma.user.delete({ where: { id } });
        return { deleted: true };
    }
}
