import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImpactInput } from './dto/create-impact.input';
import { UpdateImpactInput } from './dto/update-impact.input';

@Injectable()
export class ImpactService {
    constructor(private prisma: PrismaService) {}

    async create(createImpactInput: CreateImpactInput) {
        try {
            const impact = await this.prisma.impact.create({
                data: createImpactInput,
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
                message: 'Impact created successfully',
                data: impact,
            };
        } catch (error) {
            console.log('Error creating impact:', error);
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid topic or report ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to create impact. Please try again.',
            );
        }
    }

    async findByReport(reportId: string) {
        try {
            const impacts = await this.prisma.impact.findMany({
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
            });

            return {
                success: true,
                message: `Found ${impacts.length} impacts for report`,
                data: impacts,
            };
        } catch (error) {
            console.log('Error fetching impacts by report:', error);
            throw new BadRequestException(
                'Failed to fetch impacts by report. Please try again.',
            );
        }
    }

    async findOne(id: string) {
        try {
            const impact = await this.prisma.impact.findUnique({
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

            if (!impact) {
                throw new NotFoundException(`Impact with ID "${id}" not found`);
            }

            return {
                success: true,
                message: 'Impact found successfully',
                data: impact,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.log('Error fetching impact:', error);
            throw new BadRequestException(
                'Failed to fetch impact. Please try again.',
            );
        }
    }

    async update(id: string, updateImpactInput: UpdateImpactInput) {
        try {
            const impact = await this.prisma.impact.update({
                where: { id },
                data: updateImpactInput,
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
                message: 'Impact updated successfully',
                data: impact,
            };
        } catch (error) {
            console.log('Error updating impact:', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(`Impact with ID ${id} not found`);
            }
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid topic or report ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to update impact. Please try again.',
            );
        }
    }

    async remove(id: string) {
        try {
            const impact = await this.prisma.impact.delete({
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
                message: 'Impact deleted successfully',
                data: impact,
            };
        } catch (error) {
            console.log('Error deleting impact:', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(`Impact with ID "${id}" not found`);
            }
            throw new BadRequestException(
                'Failed to delete impact. Please try again.',
            );
        }
    }
}
