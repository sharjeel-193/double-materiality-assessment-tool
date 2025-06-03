// context/context.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContextInput } from './dto/create-context.input';
import { UpdateContextInput } from './dto/update-context.input';

@Injectable()
export class ContextService {
    constructor(private prisma: PrismaService) {}

    async create(createContextInput: CreateContextInput) {
        return this.prisma.context.create({
            data: createContextInput,
        });
    }

    async findAll() {
        return this.prisma.context.findMany();
    }

    async findOne(id: string) {
        const context = await this.prisma.context.findUnique({
            where: { id },
        });

        if (!context) {
            throw new NotFoundException(`Context with ID ${id} not found`);
        }

        return context;
    }

    async findByReport(reportId: string) {
        return this.prisma.context.findUnique({
            where: { reportId },
        });
    }

    async findByCompany(companyId: string) {
        return this.prisma.context.findMany({
            where: {
                report: {
                    companyId: companyId,
                },
            },
        });
    }

    // context/context.service.ts
    async update(id: string, updateContextInput: UpdateContextInput) {
        try {
            return await this.prisma.context.update({
                where: { id },
                data: updateContextInput,
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
            return await this.prisma.context.delete({
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
