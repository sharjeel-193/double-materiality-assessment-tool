import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService) {}

    async create(createActivityInput: CreateActivityInput) {
        return this.prisma.activity.create({
            data: createActivityInput,
        });
    }

    async findAll() {
        return this.prisma.activity.findMany();
    }

    async findOne(id: string) {
        const activity = await this.prisma.activity.findUnique({
            where: { id },
        });

        if (!activity) {
            throw new NotFoundException(`Activity with ID ${id} not found`);
        }

        return activity;
    }

    async findByContext(contextId: string) {
        return this.prisma.activity.findMany({
            where: { contextId },
        });
    }

    async update(id: string, UpdateActivityInput: UpdateActivityInput) {
        try {
            return await this.prisma.activity.update({
                where: { id },
                data: UpdateActivityInput,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Context with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.activity.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Context with ID ${id} not found`);
            }
            throw error;
        }
    }
}
