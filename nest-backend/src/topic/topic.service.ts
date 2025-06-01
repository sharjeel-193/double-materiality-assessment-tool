import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicInput } from './dto/create-topic.input';
import { UpdateTopicInput } from './dto/update-topic.input';

@Injectable()
export class TopicService {
    constructor(private prisma: PrismaService) {}

    async create(createTopicInput: CreateTopicInput) {
        // Check if dimension exists
        const dimensionExists = await this.prisma.dimension.findUnique({
            where: { id: createTopicInput.dimensionId },
        });

        if (!dimensionExists) {
            throw new BadRequestException(
                `Dimension with ID ${createTopicInput.dimensionId} not found`,
            );
        }

        return this.prisma.topic.create({
            data: createTopicInput,
            include: {
                dimension: {
                    include: {
                        standard: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.topic.findMany({
            include: {
                dimension: {
                    include: {
                        standard: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const topic = await this.prisma.topic.findUnique({
            where: { id },
            include: {
                dimension: {
                    include: {
                        standard: true,
                    },
                },
            },
        });

        if (!topic) {
            throw new NotFoundException(`Topic with ID ${id} not found`);
        }

        return topic;
    }

    async findByDimension(dimensionId: string) {
        const dimensionExists = await this.prisma.dimension.findUnique({
            where: { id: dimensionId },
        });

        if (!dimensionExists) {
            throw new NotFoundException(
                `Dimension with ID ${dimensionId} not found`,
            );
        }

        return this.prisma.topic.findMany({
            where: { dimensionId },
            include: {
                dimension: true,
            },
        });
    }

    async update(id: string, updateTopicInput: UpdateTopicInput) {
        const existingTopic = await this.prisma.topic.findUnique({
            where: { id },
        });

        if (!existingTopic) {
            throw new NotFoundException(`Topic with ID ${id} not found`);
        }

        if (updateTopicInput.dimensionId) {
            const dimensionExists = await this.prisma.dimension.findUnique({
                where: { id: updateTopicInput.dimensionId },
            });

            if (!dimensionExists) {
                throw new BadRequestException(
                    `Dimension with ID ${updateTopicInput.dimensionId} not found`,
                );
            }
        }

        return this.prisma.topic.update({
            where: { id },
            data: updateTopicInput,
            include: {
                dimension: true,
            },
        });
    }

    async remove(id: string) {
        const existingTopic = await this.prisma.topic.findUnique({
            where: { id },
            include: {
                topicRatings: true,
            },
        });

        if (!existingTopic) {
            throw new NotFoundException(`Topic with ID ${id} not found`);
        }

        if (existingTopic.topicRatings.length > 0) {
            throw new BadRequestException(
                `Cannot delete topic with associated ratings`,
            );
        }

        return this.prisma.topic.delete({
            where: { id },
        });
    }

    async getDimension(dimensionId: string) {
        return this.prisma.dimension.findUnique({
            where: { id: dimensionId },
            include: {
                standard: true,
            },
        });
    }

    async findByStandard(standardId: string) {
        try {
            const topics = await this.prisma.topic.findMany({
                where: {
                    dimension: { standardId },
                },
                include: {
                    dimension: true,
                },
            });
            return topics;
        } catch (error) {
            throw new BadRequestException(
                `Failed to fetch topics for standard ${standardId}: ${error.message}`,
            );
        }
    }
}
