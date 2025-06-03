// report/report.service.ts
import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';

@Injectable()
export class ReportService {
    constructor(private prisma: PrismaService) {}

    async create(createReportInput: CreateReportInput) {
        try {
            return await this.prisma.report.create({
                data: createReportInput,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException(
                    'A report for this year already exists for the company',
                );
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.report.findMany({
            orderBy: { year: 'desc' },
        });
    }

    async findOne(id: string) {
        const report = await this.prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }

        return report;
    }

    async findByCompany(companyId: string) {
        return this.prisma.report.findMany({
            where: { companyId },
            orderBy: { year: 'desc' },
        });
    }

    async findByCompanyAndYear(companyId: string, year: number) {
        const result = await this.prisma.report.findUnique({
            where: {
                companyId_year: {
                    companyId,
                    year,
                },
            },
            include: {
                context: true,
            },
        });
        console.log({ Result: result });
        return result;
    }

    async update(id: string, updateReportInput: UpdateReportInput) {
        try {
            const report = await this.prisma.report.update({
                where: { id },
                data: updateReportInput,
            });
            return report;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Report with ID ${id} not found`);
            }
            if (error.code === 'P2002') {
                throw new ConflictException(
                    'A report for this year already exists for the company',
                );
            }
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.report.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Report with ID ${id} not found`);
            }
            throw error;
        }
    }

    async getLatestByCompany(companyId: string) {
        return this.prisma.report.findFirst({
            where: { companyId },
            orderBy: { year: 'desc' },
        });
    }
}
