import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStandardInput } from './dto/create-standard.input';
import { UpdateStandardInput } from './dto/update-standard.input';

@Injectable()
export class StandardService {
    constructor(private prisma: PrismaService) {}

    async create(createStandardInput: CreateStandardInput) {
        return this.prisma.standard.create({
            data: createStandardInput,
        });
    }

    async findAll() {
        return this.prisma.standard.findMany({
            include: {
                dimensions: true, // Include dimensions of this standard
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.standard.findUnique({
            where: { id },
            include: {
                dimensions: {
                    include: {
                        topics: true, // Include topics within dimensions
                    },
                },
            },
        });
    }

    async update(id: string, updateStandardInput: UpdateStandardInput) {
        return this.prisma.standard.update({
            where: { id },
            data: updateStandardInput,
        });
    }

    async remove(id: string) {
        return this.prisma.standard.delete({
            where: { id },
        });
    }
}
