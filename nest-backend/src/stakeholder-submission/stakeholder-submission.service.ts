import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStakeholderSubmissionInput } from './dto/create-stakeholder-submission.input';
import { SubmissionType, TopicRatingType } from '../common/enums';
import { TopicRating } from './entities/topic-rating.entity';

@Injectable()
export class StakeholderSubmissionService {
    constructor(private prisma: PrismaService) {}

    async create(
        createStakeholderSubmissionInput: CreateStakeholderSubmissionInput,
    ) {
        try {
            const { topicRatings, ...submissionData } =
                createStakeholderSubmissionInput;
            const submission = await this.prisma.submission.create({
                data: {
                    ...submissionData,
                    type: SubmissionType.STAKEHOLDER,
                },
            });

            const createdRatings: any[] = [];
            for (const rating of topicRatings) {
                const topicRating = await this.prisma.topicRating.create({
                    data: {
                        submissionId: submission.id,
                        relevance: rating.relevance,
                        magnitude: rating.magnitude,
                        topicId: rating.topicId,
                        remarks: rating.remarks,
                        ratingType: rating.ratingType,
                        score:
                            rating.score ||
                            (rating.magnitude + rating.relevance) / 2,
                    },
                    include: {
                        topic: true,
                    },
                });
                createdRatings.push(topicRating);
            }
            const result = await this.prisma.submission.findUnique({
                where: { id: submission.id },
                include: {
                    stakeholder: true,
                    topicRatings: {
                        include: {
                            topic: true,
                        },
                    },
                },
            });
            return {
                success: true,
                data: result,
                message: `Stakeholder submission created successfully with ${createdRatings.length} topci rating(s)`,
            };
        } catch (error) {
            console.log('Error in Creation of stakeholder Submission: ', error);
            if (error.code === 'P2002') {
                throw new BadRequestException(
                    'Duplicate rating for topic in this submission',
                );
            }
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    'Invalid user or stakeholder ID provided',
                );
            }
            throw new BadRequestException(
                'Failed to create stakeholder submission. Please try again.',
            );
        }
    }

    async findAll() {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    type: SubmissionType.STAKEHOLDER,
                },
                include: {
                    stakeholder: true,
                    topicRatings: {
                        include: {
                            topic: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                success: true,
                message: `Found ${submissions.length} Stakeholder submission(s)`,
                data: submissions,
            };
        } catch (error) {
            console.log('Error Fetching Stakeholder Submission: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholder submissions. Please try again.',
            );
        }
    }

    async findByStakeholder(stakeholderId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    type: SubmissionType.STAKEHOLDER,
                    stakeholderId,
                },
                include: {
                    stakeholder: true,
                    topicRatings: {
                        include: {
                            topic: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                success: true,
                message: `Found ${submissions.length} Stakeholder submission(s)`,
                data: submissions,
            };
        } catch (error) {
            console.log('Error Fetching Stakeholder Submission: ', error);
            throw new BadRequestException(
                'Failed to fetch stakeholder submissions. Please try again.',
            );
        }
    }

    async findOne(id: string) {
        try {
            const submission = await this.prisma.submission.findUnique({
                where: { id },
                include: {
                    stakeholder: true,
                    topicRatings: {
                        include: {
                            topic: true,
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
                message: 'Stakeholder submission retrieved successfully',
                data: submission,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to fetch stakeholder submission. Please try again.',
            );
        }
    }

    async remove(id: string) {
        try {
            const submission = await this.prisma.submission.findUnique({
                where: { id },
                include: {
                    topicRatings: true,
                },
            });

            if (!submission || submission.type !== SubmissionType.STAKEHOLDER) {
                throw new NotFoundException(
                    `Stakeholder submission with ID ${id} not found`,
                );
            }

            // ✅ Delete submission (cascade will delete topic ratings)
            const deletedSubmission = await this.prisma.submission.delete({
                where: { id },
            });

            return {
                success: true,
                message:
                    'Stakeholder submission and associated topic ratings deleted successfully',
                data: deletedSubmission,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(
                    `Stakeholder submission with ID ${id} not found`,
                );
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to delete stakeholder submission. Please try again.',
            );
        }
    }

    async findByReportGrouped(reportId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    reportId: reportId,
                    type: 'STAKEHOLDER',
                },
                include: {
                    stakeholder: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    topicRatings: {
                        include: {
                            topic: {
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
                    stakeholderName: string;
                    stakeholderId: string;
                    topicRatings: TopicRating[];
                }
            > = {};

            submissions.forEach((submission) => {
                if (submission.stakeholderId && submission.stakeholder) {
                    groupedData[submission.id] = {
                        stakeholderId: submission.stakeholder.id,
                        stakeholderName: submission.stakeholder.name,
                        topicRatings: submission.topicRatings as TopicRating[],
                    };
                }
            });

            return {
                success: true,
                message: `Found submissions for ${Object.keys(groupedData).length} stakeholders`,
                data: JSON.stringify(groupedData),
            };
        } catch (error) {
            console.log('Error fetching Stakeholder Submissions: ', error);
            throw new BadRequestException(
                'Failed to fetch grouped stakeholder submissions by report. Please try again.',
            );
        }
    }
    async findByReportAndRatingTypeGrouped(
        reportId: string,
        ratingType: TopicRatingType,
    ) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    reportId: reportId,
                    type: 'STAKEHOLDER',
                    topicRatings: {
                        some: {
                            ratingType: ratingType,
                        },
                    },
                },
                include: {
                    stakeholder: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    topicRatings: {
                        where: {
                            ratingType: ratingType,
                        },
                        include: {
                            topic: {
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
                    stakeholderName: string;
                    stakeholderId: string;
                    topicRatings: TopicRating[];
                }
            > = {};

            submissions.forEach((submission) => {
                if (submission.stakeholderId && submission.stakeholder) {
                    groupedData[submission.id] = {
                        stakeholderId: submission.stakeholder.id,
                        stakeholderName: submission.stakeholder.name,
                        topicRatings: submission.topicRatings as TopicRating[],
                    };
                }
            });

            return {
                success: true,
                message: `Found submissions for ${Object.keys(groupedData).length} stakeholders with ratingType ${ratingType}`,
                data: JSON.stringify(groupedData),
            };
        } catch (error) {
            console.log(
                'Error fetching Stakeholder Submissions by report and ratingType: ',
                error,
            );
            throw new BadRequestException(
                'Failed to fetch grouped stakeholder submissions by report and ratingType. Please try again.',
            );
        }
    }

    async getMaterialityMatrixData(reportId: string) {
        try {
            const submissions = await this.prisma.submission.findMany({
                where: {
                    reportId: reportId,
                    type: 'STAKEHOLDER',
                },
                include: {
                    topicRatings: {
                        include: {
                            topic: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Group ratings by topic and rating type
            const topicData = new Map<
                string,
                {
                    topicId: string;
                    topicName: string;
                    impactRatings: { relevance: number; magnitude: number }[];
                    financialRatings: {
                        relevance: number;
                        magnitude: number;
                    }[];
                }
            >();

            // Process all topic ratings from all submissions
            submissions.forEach((submission) => {
                submission.topicRatings.forEach((rating) => {
                    const topicId = rating.topicId;
                    const topicName = rating.topic?.name || '';
                    const ratingType = rating.ratingType;
                    const relevance = rating.relevance || 0;
                    const magnitude = rating.magnitude || 0;

                    // Initialize topic data if not exists
                    if (!topicData.has(topicId)) {
                        topicData.set(topicId, {
                            topicId,
                            topicName,
                            impactRatings: [],
                            financialRatings: [],
                        });
                    }

                    const topic = topicData.get(topicId)!;

                    // Add rating to appropriate array based on type
                    if (ratingType === 'IMPACT') {
                        topic.impactRatings.push({ relevance, magnitude });
                    } else if (ratingType === 'FINANCIAL') {
                        topic.financialRatings.push({ relevance, magnitude });
                    }
                });
            });

            // Calculate average scores for each topic
            const materialityMatrix = Array.from(topicData.values()).map(
                (topic) => {
                    // Calculate impact score average
                    let impactScore = 0;
                    if (topic.impactRatings.length > 0) {
                        const impactSum = topic.impactRatings.reduce(
                            (sum, rating) =>
                                sum + (rating.relevance + rating.magnitude) / 2,
                            0,
                        );
                        impactScore =
                            Math.round(
                                (impactSum / topic.impactRatings.length) * 100,
                            ) / 100;
                    }

                    // Calculate financial score average
                    let financialScore = 0;
                    if (topic.financialRatings.length > 0) {
                        const financialSum = topic.financialRatings.reduce(
                            (sum, rating) =>
                                sum + (rating.relevance + rating.magnitude) / 2,
                            0,
                        );
                        financialScore =
                            Math.round(
                                (financialSum / topic.financialRatings.length) *
                                    100,
                            ) / 100;
                    }

                    return {
                        topicId: topic.topicId,
                        topicName: topic.topicName,
                        impactScore,
                        financialScore,
                        impactRatingsCount: topic.impactRatings.length,
                        financialRatingsCount: topic.financialRatings.length,
                    };
                },
            );

            // Filter out topics that have no ratings at all
            const validMatrixData = materialityMatrix.filter(
                (item) =>
                    item.impactRatingsCount > 0 ||
                    item.financialRatingsCount > 0,
            );

            return {
                success: true,
                message: `Generated materiality matrix data for ${validMatrixData.length} topics`,
                data: validMatrixData,
            };
        } catch (error) {
            console.log('Error generating materiality matrix data: ', error);
            throw new BadRequestException(
                'Failed to generate materiality matrix data. Please try again.',
            );
        }
    }
}
