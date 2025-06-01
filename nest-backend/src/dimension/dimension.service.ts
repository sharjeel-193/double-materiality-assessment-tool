import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDimensionInput } from './dto/create-dimension.input';
import { UpdateDimensionInput } from './dto/update-dimension.input';

@Injectable()
export class DimensionService {
    constructor(private prisma: PrismaService) {}

    async create(createDimensionInput: CreateDimensionInput) {
        return this.prisma.dimension.create({
            data: createDimensionInput,
        });
    }

    async findAll() {
        return this.prisma.dimension.findMany({
            include: {
                topics: true,
                standard: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.dimension.findUnique({
            where: { id },
            include: {
                topics: true,
                standard: true,
            },
        });
    }

    async findByStandard(standardId: string) {
        return this.prisma.dimension.findMany({
            where: { standardId },
            include: {
                topics: true,
            },
        });
    }

    async update(id: string, updateDimensionInput: UpdateDimensionInput) {
        return this.prisma.dimension.update({
            where: { id },
            data: updateDimensionInput,
        });
    }

    async remove(id: string) {
        return this.prisma.dimension.delete({
            where: { id },
        });
    }
}
