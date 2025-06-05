// user-submission/user-submission.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSubmissionInput } from './dto/create-user-submission.input';
import { SubmissionType } from '../common/enums';
import { StakeholderRating } from './entities/stakeholder-rating.entity';

@Injectable()
export class UserSubmissionService {
    constructor(private prisma: PrismaService) {}

    async create(createUserSubmissionInput: CreateUserSubmissionInput) {
        try {
            const { stakeholderRatings, ...submissionData } =
                createUserSubmissionInput;

            // ✅ Create submission first
            const submission = await this.prisma.submission.create({
                data: {
                    ...submissionData,
                    type: SubmissionType.INTERNAL,
                },
            });

            // ✅ Create stakeholder ratings within same service
            const createdRatings: any[] = [];
            for (const rating of stakeholderRatings) {
                const stakeholderRating =
                    await this.prisma.stakeholderRating.create({
                        data: {
                            submissionId: submission.id,
                            stakeholderId: rating.stakeholderId,
                            influence: rating.influence,
                            impact: rating.impact,
                            score:
                                rating.score ||
                                (rating.influence + rating.impact) / 2,
                        },
                        include: {
                            stakeholder: true,
                        },
                    });
                createdRatings.push(stakeholderRating);
            }

            // ✅ Update stakeholder averages
            await this.updateStakeholderAverages(
                stakeholderRatings.map((r) => r.stakeholderId),
            );

            // ✅ Return complete submission with ratings
            const result = await this.prisma.submission.findUnique({
                where: { id: submission.id },
                include: {
                    user: true,
                    stakeholderRatings: {
                        include: {
                            stakeholder: true,
                        },
                    },
                },
            });

            return {
                success: true,
                message: `User submission created successfully with ${createdRatings.length} stakeholder rating(s)`,
                data: result,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(
                    'Duplicate rating for stakeholder in this submission',
                );
            }
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid user or stakeholder ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to create user submission. Please try again.',
            );
        }
    }

    async findAll() {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    type: SubmissionType.INTERNAL,
                },
                include: {
                    user: true,
                    stakeholder: true,
                    stakeholderRatings: {
                        include: {
                            stakeholder: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return {
                success: true,
                message: `Found ${submissions.length} user submission(s)`,
                data: submissions,
            };
        } catch (error) {
            console.log('Fetching User Submission Error: ', error);
            throw new BadRequestException(
                'Failed to fetch user submissions. Please try again.',
            );
        }
    }

    async findByUser(userId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    userId,
                    type: SubmissionType.INTERNAL,
                },
                include: {
                    stakeholder: true,
                    stakeholderRatings: {
                        include: {
                            stakeholder: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return {
                success: true,
                message: `Found ${submissions.length} user submission(s) for user`,
                data: submissions,
            };
        } catch (error) {
            console.log('Fetching User Submission Error: ', error);
            throw new BadRequestException(
                'Failed to fetch user submissions. Please try again.',
            );
        }
    }

    async findByReport(reportId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    reportId: reportId,
                    type: SubmissionType.INTERNAL, // Only user submissions
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    stakeholderRatings: {
                        include: {
                            stakeholder: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return {
                success: true,
                message: `Found ${submissions.length} submissions for report ${reportId}`,
                data: submissions,
            };
        } catch (error) {
            console.log('Fetching User Submission Error: ', error);
            throw new BadRequestException(
                'Failed to fetch submissions by report. Please try again.',
            );
        }
    }

    async findByReportGrouped(reportId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    reportId: reportId,
                    type: 'INTERNAL',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    stakeholderRatings: {
                        include: {
                            stakeholder: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Group by submissionId
            const groupedData: Record<
                string,
                {
                    userName: string;
                    userId: string;
                    stakeholderRatings: StakeholderRating[];
                }
            > = {};

            submissions.forEach((submission) => {
                if (submission.userId && submission.user) {
                    groupedData[submission.id] = {
                        userId: submission.user.id,
                        userName: submission.user.name,
                        stakeholderRatings:
                            submission.stakeholderRatings as StakeholderRating[],
                    };
                }
            });

            return {
                success: true,
                message: `Found submissions for ${Object.keys(groupedData).length} users`,
                data: JSON.stringify(groupedData),
            };
        } catch (error) {
            console.log('Fetching Grouped Submissions: ', error);
            throw new BadRequestException(
                'Failed to fetch grouped submissions by report. Please try again.',
            );
        }
    }

    async findOne(id: string) {
        try {
            const submission = await this.prisma.submission.findUnique({
                where: { id },
                include: {
                    user: true,
                    stakeholder: true,
                    stakeholderRatings: {
                        include: {
                            stakeholder: true,
                        },
                    },
                },
            });

            if (!submission || submission.type !== SubmissionType.INTERNAL) {
                throw new NotFoundException(
                    `User submission with ID ${id} not found`,
                );
            }

            return {
                success: true,
                message: 'User submission retrieved successfully',
                data: submission,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to fetch user submission. Please try again.',
            );
        }
    }

    async remove(id: string) {
        try {
            // ✅ Get stakeholder IDs before deletion for average recalculation
            const submission = await this.prisma.submission.findUnique({
                where: { id },
                include: {
                    stakeholderRatings: true,
                },
            });

            if (!submission || submission.type !== SubmissionType.INTERNAL) {
                throw new NotFoundException(
                    `User submission with ID ${id} not found`,
                );
            }

            const stakeholderIds = submission.stakeholderRatings.map(
                (r) => r.stakeholderId,
            );

            // ✅ Delete submission (cascade will delete stakeholder ratings)
            const deletedSubmission = await this.prisma.submission.delete({
                where: { id },
            });

            // ✅ Update stakeholder averages after deletion
            await this.updateStakeholderAverages(stakeholderIds);

            return {
                success: true,
                message:
                    'User submission and associated stakeholder ratings deleted successfully',
                data: deletedSubmission,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `User submission with ID ${id} not found`,
                );
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to delete user submission. Please try again.',
            );
        }
    }

    // ✅ Add/Update stakeholder rating for existing submission
    async addStakeholderRating(
        submissionId: string,
        stakeholderId: string,
        influence: number,
        impact: number,
        score?: number,
    ) {
        try {
            // ✅ Verify submission exists and is user submission
            const submission = await this.prisma.submission.findUnique({
                where: { id: submissionId },
            });

            if (!submission || submission.type !== SubmissionType.INTERNAL) {
                throw new NotFoundException(
                    `User submission with ID ${submissionId} not found`,
                );
            }

            // ✅ Create or update stakeholder rating
            const rating = await this.prisma.stakeholderRating.upsert({
                where: {
                    submissionId_stakeholderId: {
                        submissionId,
                        stakeholderId,
                    },
                },
                update: {
                    influence,
                    impact,
                    score: score || (influence + impact) / 2,
                },
                create: {
                    submissionId,
                    stakeholderId,
                    influence,
                    impact,
                    score: score || (influence + impact) / 2,
                },
                include: {
                    stakeholder: true,
                },
            });

            // ✅ Update stakeholder average
            await this.updateStakeholderAverages([stakeholderId]);

            return {
                success: true,
                message: 'Stakeholder rating added/updated successfully',
                data: rating,
            };
        } catch (error) {
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid submission or stakeholder ID provided',
                );
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to add stakeholder rating. Please try again.',
            );
        }
    }

    // ✅ Remove stakeholder rating from submission
    async removeStakeholderRating(submissionId: string, stakeholderId: string) {
        try {
            const rating = await this.prisma.stakeholderRating.delete({
                where: {
                    submissionId_stakeholderId: {
                        submissionId,
                        stakeholderId,
                    },
                },
            });

            // ✅ Update stakeholder average
            await this.updateStakeholderAverages([stakeholderId]);

            return {
                success: true,
                message: 'Stakeholder rating removed successfully',
                data: rating,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Stakeholder rating not found');
            }
            throw new BadRequestException(
                'Failed to remove stakeholder rating. Please try again.',
            );
        }
    }

    // ✅ Get stakeholder ratings for a submission
    async getStakeholderRatings(submissionId: string) {
        try {
            const ratings = await this.prisma.stakeholderRating.findMany({
                where: { submissionId },
                include: {
                    stakeholder: true,
                },
                orderBy: { stakeholder: { name: 'asc' } },
            });

            return {
                success: true,
                message: `Found ${ratings.length} stakeholder rating(s) for submission`,
                data: ratings,
            };
        } catch (error) {
            console.log('Fetching Stakeholder Ratings Error: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholder ratings. Please try again.',
            );
        }
    }

    // ✅ Private helper method to update stakeholder averages
    private async updateStakeholderAverages(stakeholderIds: string[]) {
        for (const stakeholderId of stakeholderIds) {
            const ratings = await this.prisma.stakeholderRating.findMany({
                where: { stakeholderId },
            });

            if (ratings.length > 0) {
                const avgInfluence =
                    ratings.reduce((sum, r) => sum + r.influence, 0) /
                    ratings.length;
                const avgImpact =
                    ratings.reduce((sum, r) => sum + r.impact, 0) /
                    ratings.length;

                await this.prisma.stakeholder.update({
                    where: { id: stakeholderId },
                    data: {
                        avgInfluence: Number(avgInfluence.toFixed(2)),
                        avgImpact: Number(avgImpact.toFixed(2)),
                    },
                });
            } else {
                // ✅ Reset to defaults if no ratings
                await this.prisma.stakeholder.update({
                    where: { id: stakeholderId },
                    data: {
                        avgInfluence: 0.0,
                        avgImpact: 0.0,
                    },
                });
            }
        }
    }
}
