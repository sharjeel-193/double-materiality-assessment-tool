import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinancialEffectInput } from './dto/create-financial-effect.input';
import { UpdateFinancialEffectInput } from './dto/update-financial-effect.input';

@Injectable()
export class FinancialEffectService {
    constructor(private prisma: PrismaService) {}

    async create(createFinancialEffectInput: CreateFinancialEffectInput) {
        try {
            const financialEffect = await this.prisma.riskOpportunity.create({
                data: createFinancialEffectInput,
                include: {
                    topic: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    report: {
                        select: {
                            id: true,
                            year: true,
                        },
                    },
                },
            });

            return {
                success: true,
                message: 'Financial effect created successfully',
                data: financialEffect,
            };
        } catch (error) {
            console.log('Error creating financial effect:', error);
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid topic or report ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to create financial effect. Please try again.',
            );
        }
    }

    async findByReport(reportId: string) {
        try {
            const financialEffects = await this.prisma.riskOpportunity.findMany(
                {
                    where: { reportId },
                    include: {
                        topic: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        report: {
                            select: {
                                id: true,
                                year: true,
                            },
                        },
                    },
                    orderBy: {
                        title: 'asc',
                    },
                },
            );

            return {
                success: true,
                message: `Found ${financialEffects.length} financial effects for report`,
                data: financialEffects,
            };
        } catch (error) {
            console.log('Error fetching financial effects by report:', error);
            throw new BadRequestException(
                'Failed to fetch financial effects by report. Please try again.',
            );
        }
    }

    async findByReportAndType(reportId: string, type: string) {
        try {
            const financialEffects = await this.prisma.riskOpportunity.findMany(
                {
                    where: {
                        reportId,
                        type: type as any,
                    },
                    include: {
                        topic: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        report: {
                            select: {
                                id: true,
                                year: true,
                            },
                        },
                    },
                    orderBy: {
                        title: 'asc',
                    },
                },
            );

            return {
                success: true,
                message: `Found ${financialEffects.length} ${type.toLowerCase()} financial effects for report`,
                data: financialEffects,
            };
        } catch (error) {
            console.log(
                'Error fetching financial effects by report and type:',
                error,
            );
            throw new BadRequestException(
                'Failed to fetch financial effects by report and type. Please try again.',
            );
        }
    }

    async findOne(id: string) {
        try {
            const financialEffect =
                await this.prisma.riskOpportunity.findUnique({
                    where: { id },
                    include: {
                        topic: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        report: {
                            select: {
                                id: true,
                                year: true,
                            },
                        },
                    },
                });

            if (!financialEffect) {
                throw new NotFoundException(
                    `Financial effect with ID "${id}" not found`,
                );
            }

            return {
                success: true,
                message: 'Financial effect found successfully',
                data: financialEffect,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.log('Error fetching financial effect:', error);
            throw new BadRequestException(
                'Failed to fetch financial effect. Please try again.',
            );
        }
    }

    async update(
        id: string,
        updateFinancialEffectInput: UpdateFinancialEffectInput,
    ) {
        try {
            const financialEffect = await this.prisma.riskOpportunity.update({
                where: { id },
                data: updateFinancialEffectInput,
                include: {
                    topic: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    report: {
                        select: {
                            id: true,
                            year: true,
                        },
                    },
                },
            });

            return {
                success: true,
                message: 'Financial effect updated successfully',
                data: financialEffect,
            };
        } catch (error) {
            console.log('Error updating financial effect:', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `Financial effect with ID ${id} not found`,
                );
            }
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid topic or report ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to update financial effect. Please try again.',
            );
        }
    }

    async remove(id: string) {
        try {
            const financialEffect = await this.prisma.riskOpportunity.delete({
                where: { id },
                include: {
                    topic: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    report: {
                        select: {
                            id: true,
                            year: true,
                        },
                    },
                },
            });

            return {
                success: true,
                message: 'Financial effect deleted successfully',
                data: financialEffect,
            };
        } catch (error) {
            console.log('Error deleting financial effect:', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `Financial effect with ID "${id}" not found`,
                );
            }
            throw new BadRequestException(
                'Failed to delete financial effect. Please try again.',
            );
        }
    }
}
