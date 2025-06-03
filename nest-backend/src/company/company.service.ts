import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getCurrentCompany(companyId: string) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                name: true,
                address: true,
                reports: {
                    select: {
                        year: true,
                    },
                },
            },
        });

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        // Extract distinct years from reports
        const reportYears = Array.from(
            new Set(company.reports.map((r) => r.year)),
        );

        return {
            id: company.id,
            name: company.name,
            address: company.address,
            reportYears,
        };
    }
}
