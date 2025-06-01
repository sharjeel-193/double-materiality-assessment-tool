import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyInput } from './dto/create-company.input';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async create(createCompanyInput: CreateCompanyInput) {
        return this.prisma.company.create({ data: createCompanyInput });
    }

    async findAll() {
        return this.prisma.company.findMany();
    }

    async findOne(id: string) {
        return this.prisma.company.findUnique({ where: { id } });
    }
}
