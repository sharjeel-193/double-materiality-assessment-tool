/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// report/report.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportService {
    constructor(private readonly prisma: PrismaService) {}

    // Helper method to transform Prisma result to Report entity
    private transformPrismaToReport(prismaReport: any): Report {
        return {
            ...prismaReport,
            impactRadar: prismaReport.ImpactRadar
                ? JSON.stringify(prismaReport.ImpactRadar)
                : '',
            financialRadar: prismaReport.financialRadar
                ? JSON.stringify(prismaReport.financialRadar)
                : '',
            topStakeholders: prismaReport.topStakeholders
                ? JSON.stringify(prismaReport.topStakeholders)
                : undefined,
            topTopics: prismaReport.topTopics
                ? JSON.stringify(prismaReport.topTopics)
                : undefined,
        };
    }

    async getByCompanyAndYear(companyId: string, year: number) {
        try {
            // Validate inputs
            if (!companyId || !year) {
                throw new BadRequestException(
                    'CompanyId and year are required',
                );
            }

            if (year < 1900 || year > new Date().getFullYear() + 10) {
                throw new BadRequestException('Invalid year provided');
            }

            const prismaReport = await this.prisma.report.findUnique({
                where: {
                    companyId_year: {
                        companyId,
                        year,
                    },
                },
                include: {
                    standard: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    context: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            if (!prismaReport) {
                throw new NotFoundException('Report not found');
            }

            const report = this.transformPrismaToReport(prismaReport);

            return {
                success: true,
                message: 'Report retrieved successfully',
                data: report,
            };
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }

            // Handle Prisma errors
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException(
                    'Invalid query parameters provided',
                );
            }

            throw new BadRequestException('Failed to fetch report');
        }
    }

    async createReport(createReportInput: CreateReportInput) {
        try {
            // Check if company exists
            const companyExists = await this.prisma.company.findUnique({
                where: { id: createReportInput.companyId },
            });

            if (!companyExists) {
                throw new NotFoundException(
                    `Company with id ${createReportInput.companyId} not found`,
                );
            }

            // Check if standard exists
            const standardExists = await this.prisma.standard.findUnique({
                where: { id: createReportInput.standardId },
            });

            if (!standardExists) {
                throw new NotFoundException(
                    `Standard with id ${createReportInput.standardId} not found`,
                );
            }

            // Check for duplicate report (same company and year)
            const existingReport = await this.prisma.report.findUnique({
                where: {
                    companyId_year: {
                        companyId: createReportInput.companyId,
                        year: createReportInput.year,
                    },
                },
            });

            if (existingReport) {
                throw new ConflictException(
                    `Report for company ${createReportInput.companyId} and year ${createReportInput.year} already exists`,
                );
            }

            const prismaReport = await this.prisma.report.create({
                data: createReportInput,
                include: {
                    standard: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    context: true,
                },
            });

            const report = this.transformPrismaToReport(prismaReport);

            return {
                success: true,
                message: 'Report created successfully',
                data: report,
            };
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            // Handle Prisma errors
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'Report with these details already exists',
                    );
                }
                if (error.code === 'P2003') {
                    throw new BadRequestException(
                        'Invalid foreign key reference provided',
                    );
                }
            }

            throw new BadRequestException('Failed to create report');
        }
    }

    async updateReport(id: string, updateReportInput: UpdateReportInput) {
        try {
            // Check if report exists
            const existingReport = await this.prisma.report.findUnique({
                where: { id },
            });

            if (!existingReport) {
                throw new NotFoundException(`Report with id ${id} not found`);
            }

            const prismaReport = await this.prisma.report.update({
                where: { id },
                data: updateReportInput,
                include: {
                    standard: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    context: true,
                },
            });

            const report = this.transformPrismaToReport(prismaReport);

            return {
                success: true,
                message: 'Report updated successfully',
                data: report,
            };
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            // Handle Prisma errors
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'Report with these details already exists',
                    );
                }
                if (error.code === 'P2025') {
                    throw new NotFoundException(
                        `Report with id ${id} not found`,
                    );
                }
            }

            throw new BadRequestException('Failed to update report');
        }
    }

    /**
     * Enhanced method to update report status with automatic metric calculations
     * Status 4+: Total and important stakeholders
     * Status 5+: Material topics
     * Status 6+: Total impacts
     * Status 7+: Total financial effects (risk opportunities)
     */
    async updateReportStatus(id: string, status: number) {
        try {
            // Validate status range
            if (status < 1 || status > 8) {
                throw new BadRequestException('Status must be between 1 and 8');
            }

            const updateInput: UpdateReportInput = {
                status: status,
            };

            // Status 4+: Calculate stakeholder metrics
            if (status > 3) {
                updateInput.totalStakeholders =
                    await this._countTotalStakeholders(id);
            }

            if (status > 4) {
                updateInput.importantStakeholders =
                    await this._countImportantStakeholders(id);
            }

            // Status 5+: Calculate material topics
            if (status > 5) {
                updateInput.materialTopics =
                    await this._calculateMaterialTopics(id);
            }

            // Status 6+: Calculate total impacts
            if (status > 6) {
                updateInput.totalImpacts = await this._countImpacts(id);
                updateInput.impactRadar =
                    (await this._getImpactRadar(id)) || '';
            }

            // Status 7+: Calculate total risk opportunities (financial effects)
            if (status > 7) {
                updateInput.totalFinancialEffects =
                    await this._countRiskOpportunities(id);
                updateInput.financialRadar =
                    (await this._getFinancialRadar(id)) || '';
            }

            const report = await this.updateReport(id, updateInput);
            return report;
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            console.error('Error updating report status:', error);
            throw new BadRequestException('Failed to update report status');
        }
    }

    /**
     * Counts total stakeholders associated with the report through activities
     */
    private async _countTotalStakeholders(reportId: string): Promise<number> {
        try {
            const count = await this.prisma.stakeholder.count({
                where: {
                    activity: {
                        context: {
                            reportId: reportId,
                        },
                    },
                },
            });
            return count;
        } catch (error) {
            console.error('Error counting total stakeholders:', error);
            return 0;
        }
    }

    /**
     * Counts important stakeholders (avgInfluence > 2.5 AND avgImpact > 2.5)
     */
    private async _countImportantStakeholders(
        reportId: string,
    ): Promise<number> {
        try {
            const count = await this.prisma.stakeholder.count({
                where: {
                    activity: {
                        context: {
                            reportId: reportId,
                        },
                    },
                    AND: [
                        { avgInfluence: { gt: 2.5 } },
                        { avgImpact: { gt: 2.5 } },
                    ],
                },
            });
            return count;
        } catch (error) {
            console.error('Error counting important stakeholders:', error);
            return 0;
        }
    }

    /**
     * Calculates material topics based on stakeholder submissions
     * Topics where BOTH average financial and impact scores > 2.5
     */
    private async _calculateMaterialTopics(reportId: string): Promise<number> {
        try {
            // Get topics with average financial score > 2.5
            const financialTopics = await this.prisma.topicRating.groupBy({
                by: ['topicId'],
                where: {
                    submission: {
                        reportId: reportId,
                    },
                    ratingType: 'FINANCIAL',
                },
                _avg: {
                    score: true,
                },
                having: {
                    score: {
                        _avg: {
                            gt: 2.5,
                        },
                    },
                },
            });

            // Get topics with average impact score > 2.5
            const impactTopics = await this.prisma.topicRating.groupBy({
                by: ['topicId'],
                where: {
                    submission: {
                        reportId: reportId,
                    },
                    ratingType: 'IMPACT',
                },
                _avg: {
                    score: true,
                },
                having: {
                    score: {
                        _avg: {
                            gt: 2.5,
                        },
                    },
                },
            });

            // Find intersection: topics that appear in BOTH results
            const financialTopicIds = new Set(
                financialTopics.map((t) => t.topicId),
            );
            const materialTopicIds = impactTopics.filter((t) =>
                financialTopicIds.has(t.topicId),
            );

            return materialTopicIds.length;
        } catch (error) {
            console.error('Error calculating material topics:', error);
            return 0;
        }
    }

    /**
     * Counts total impacts associated with the report
     */
    private async _countImpacts(reportId: string): Promise<number> {
        try {
            const count = await this.prisma.impact.count({
                where: {
                    reportId: reportId,
                },
            });
            return count;
        } catch (error) {
            console.error('Error counting impacts:', error);
            return 0;
        }
    }

    /**
     * Counts total risk opportunities (financial effects) associated with the report
     */
    private async _countRiskOpportunities(reportId: string): Promise<number> {
        try {
            const count = await this.prisma.riskOpportunity.count({
                where: {
                    reportId: reportId,
                },
            });
            return count;
        } catch (error) {
            console.error('Error counting risk opportunities:', error);
            return 0;
        }
    }

    private async _getImpactRadar(reportId: string): Promise<string | null> {
        try {
            // Single query with proper includes for your schema
            const impacts = await this.prisma.impact.findMany({
                where: {
                    reportId: reportId,
                },
                include: {
                    topic: {
                        include: {
                            dimension: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Early return if no impacts
            if (!impacts.length) {
                return JSON.stringify({});
            }

            // Group impacts by dimension name
            const impactRadar: Record<
                string,
                Array<{
                    id: string;
                    orderOfImpact: string;
                    type: string;
                    score: number;
                }>
            > = {};

            impacts.forEach((impact) => {
                const dimensionName = impact.topic?.dimension?.name;

                if (dimensionName) {
                    // Initialize dimension array if not exists
                    if (!impactRadar[dimensionName]) {
                        impactRadar[dimensionName] = [];
                    }

                    // Calculate score (severity + likelihood) / 2
                    const severity =
                        (impact.scale + impact.scope + impact.irremediability) /
                        3;
                    const score = (severity + impact.likelihood) / 2;

                    impactRadar[dimensionName].push({
                        id: impact.id,
                        score: Number(score.toFixed(2)),
                        orderOfImpact: impact.orderOfEffect,
                        type: impact.type,
                    });
                }
            });

            return JSON.stringify(impactRadar);
        } catch (error) {
            console.error('Error creating Impact Radar:', error);
            return null;
        }
    }

    private async _getFinancialRadar(reportId: string): Promise<string | null> {
        try {
            // Single query with proper includes for your schema
            const effects = await this.prisma.riskOpportunity.findMany({
                where: {
                    reportId: reportId,
                },
                include: {
                    topic: {
                        include: {
                            dimension: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Early return if no impacts
            if (!effects.length) {
                return JSON.stringify({});
            }

            // Group impacts by dimension name
            const financialRadar: Record<
                string,
                Array<{
                    id: string;
                    type: string;
                    score: number;
                }>
            > = {};

            effects.forEach((effect) => {
                const dimensionName = effect.topic?.dimension?.name;

                if (dimensionName) {
                    // Initialize dimension array if not exists
                    if (!financialRadar[dimensionName]) {
                        financialRadar[dimensionName] = [];
                    }
                    const score = (effect.magnitude + effect.likelihood) / 2;

                    financialRadar[dimensionName].push({
                        id: effect.id,
                        score: Number(score.toFixed(2)),
                        type: effect.type,
                    });
                }
            });

            return JSON.stringify(financialRadar);
        } catch (error) {
            console.error('Error creating Impact Radar:', error);
            return null;
        }
    }

    /**
     * Method to manually recalculate all statistics for a report
     * Useful for data migration or manual refresh
     */
    async recalculateReportStatistics(reportId: string): Promise<void> {
        try {
            const report = await this.prisma.report.findUnique({
                where: { id: reportId },
            });

            if (!report) {
                throw new NotFoundException(
                    `Report with id ${reportId} not found`,
                );
            }

            // Recalculate all metrics based on current status
            await this.updateReportStatus(reportId, report.status);
        } catch (error) {
            console.error('Error recalculating report statistics:', error);
            throw new BadRequestException(
                'Failed to recalculate report statistics',
            );
        }
    }
}
