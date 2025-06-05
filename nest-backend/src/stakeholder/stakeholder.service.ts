// stakeholder/stakeholder.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStakeholderInput } from './dto/create-stakeholder.input';
import { UpdateStakeholderInput } from './dto/update-stakeholder.input';

@Injectable()
export class StakeholderService {
    constructor(private prisma: PrismaService) {}

    async create(createStakeholderInput: CreateStakeholderInput) {
        try {
            const stakeholder = await this.prisma.stakeholder.create({
                data: createStakeholderInput,
                include: {
                    activity: true,
                },
            });

            return {
                success: true,
                message: 'Stakeholder created successfully',
                data: stakeholder,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(
                    'Stakeholder with this name already exists',
                );
            }
            if (error.code === 'P2003') {
                throw new BadRequestException('Invalid activity ID provided');
            }
            throw new BadRequestException(
                'Failed to create stakeholder. Please try again.',
            );
        }
    }

    async findAll() {
        try {
            const stakeholders = await this.prisma.stakeholder.findMany({
                include: {
                    activity: true, // Include related activity
                },
            });

            return {
                success: true,
                message: `Found ${stakeholders.length} stakeholder(s)`,
                data: stakeholders,
            };
        } catch (error) {
            console.log('Stakeholder Fetch Error: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholders. Please try again.',
            );
        }
    }

    async findByActivity(activityId: string) {
        try {
            const stakeholders = await this.prisma.stakeholder.findMany({
                where: { activityId },
            });

            return {
                success: true,
                message: `Found ${stakeholders.length} stakeholder(s) for this activity`,
                data: stakeholders,
            };
        } catch (error) {
            console.log('Stakeholder Fetch Error: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholders. Please try again.',
            );
        }
    }

    // ✅ New service method: Get stakeholders by report and context
    async findByReport(reportId: string) {
        try {
            const stakeholders = await this.prisma.stakeholder.findMany({
                where: {
                    activity: {
                        context: {
                            reportId: reportId,
                        },
                    },
                },
                include: {
                    activity: true,
                },
            });

            return {
                success: true,
                message: `Found ${stakeholders.length} stakeholder(s) for report ${reportId}`,
                data: stakeholders,
            };
        } catch (error) {
            console.log('Stakeholder Fetch Error: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholders by report and context. Please try again.',
            );
        }
    }

    async findOne(id: string) {
        try {
            const stakeholder = await this.prisma.stakeholder.findUnique({
                where: { id },
                include: {
                    activity: true,
                    submissions: true,
                    StakeholderRating: true,
                },
            });

            if (!stakeholder) {
                throw new NotFoundException(
                    `Stakeholder with ID ${id} not found`,
                );
            }

            return {
                success: true,
                message: 'Stakeholder retrieved successfully',
                data: stakeholder,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to fetch stakeholder. Please try again.',
            );
        }
    }

    async update(id: string, updateStakeholderInput: UpdateStakeholderInput) {
        try {
            const stakeholder = await this.prisma.stakeholder.update({
                where: { id },
                data: updateStakeholderInput,
            });

            return {
                success: true,
                message: 'Stakeholder updated successfully',
                data: stakeholder,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `Stakeholder with ID ${id} not found`,
                );
            }
            if (error.code === 'P2002') {
                throw new BadRequestException(
                    'Stakeholder with this name already exists',
                );
            }
            if (error.code === 'P2003') {
                throw new BadRequestException('Invalid activity ID provided');
            }
            throw new BadRequestException(
                'Failed to update stakeholder. Please try again.',
            );
        }
    }

    async remove(id: string) {
        try {
            const stakeholder = await this.prisma.stakeholder.delete({
                where: { id },
            });

            return {
                success: true,
                message: 'Stakeholder deleted successfully',
                data: stakeholder,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `Stakeholder with ID ${id} not found`,
                );
            }
            throw new BadRequestException(
                'Failed to delete stakeholder. Please try again.',
            );
        }
    }

    async countByActivity(activityId: string) {
        try {
            const count = await this.prisma.stakeholder.count({
                where: { activityId },
            });

            return {
                success: true,
                message: `Found ${count} stakeholder(s) for this activity`,
                data: count,
            };
        } catch (error) {
            console.log('Stakeholder Count Error: ', error);
            throw new BadRequestException(
                'Failed to count stakeholders. Please try again.',
            );
        }
    }
}
