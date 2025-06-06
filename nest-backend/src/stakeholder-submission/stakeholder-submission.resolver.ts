import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StakeholderSubmission } from './entities/stakeholder-submission.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CreateStakeholderSubmissionInput } from './dto/create-stakeholder-submission.input';
import { StakeholderSubmissionService } from './stakeholder-submission.service';
import {
    StakeholderSubmissionResponse,
    StakeholderSubmissionsByReportResponse,
    StakeholderSubmissionsResponse,
} from './dto/stakeholder-submission.response';
import { TopicRatingType } from 'src/common/enums';
import { MaterialityMatrixResponse } from './dto/materiality-matrix.response';

@Resolver(() => StakeholderSubmission)
export class StakeholderSubmissionResolver {
    constructor(
        private readonly stakeholderSubmissionService: StakeholderSubmissionService,
    ) {}

    @Mutation(() => StakeholderSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async createStakeholderSubmission(
        @Args('createStakeholderSubmissionInput')
        createStakeholderSubmissionInput: CreateStakeholderSubmissionInput,
    ) {
        const result = await this.stakeholderSubmissionService.create(
            createStakeholderSubmissionInput,
        );
        return result;
    }

    @Query(() => StakeholderSubmissionsResponse)
    @UseGuards(GqlAuthGuard)
    async stakeholderSubmissions() {
        const result = await this.stakeholderSubmissionService.findAll();
        return result;
    }

    @Query(() => StakeholderSubmissionsResponse)
    @UseGuards(GqlAuthGuard)
    async stakeholderSubmissionsByStakeholder(
        @Args('stakeholderId', { type: () => String })
        stakeholderId: string,
    ) {
        const result =
            await this.stakeholderSubmissionService.findByStakeholder(
                stakeholderId,
            );
        return result;
    }

    @Query(() => StakeholderSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async stakeholderSubmission(
        @Args('id', { type: () => String }) id: string,
    ) {
        const result = await this.stakeholderSubmissionService.findOne(id);
        return result;
    }

    @Mutation(() => StakeholderSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async removeStakeholderSubmission(
        @Args('id', { type: () => String }) id: string,
    ) {
        const result = await this.stakeholderSubmissionService.remove(id);
        return result;
    }

    @Query(() => StakeholderSubmissionsByReportResponse)
    @UseGuards(GqlAuthGuard)
    async stakeholderSubmissionsByReportGrouped(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        return this.stakeholderSubmissionService.findByReportGrouped(reportId);
    }

    @Query(() => StakeholderSubmissionsByReportResponse)
    @UseGuards(GqlAuthGuard)
    async stakeholderSubmissionsByReportAndRatingTypeGrouped(
        @Args('reportId', { type: () => String }) reportId: string,
        @Args('ratingType', { type: () => TopicRatingType })
        ratingType: TopicRatingType,
    ) {
        return this.stakeholderSubmissionService.findByReportAndRatingTypeGrouped(
            reportId,
            ratingType,
        );
    }

    // Add this query to your existing resolver
    @Query(() => MaterialityMatrixResponse)
    async materialityMatrixByReport(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        return this.stakeholderSubmissionService.getMaterialityMatrixData(
            reportId,
        );
    }
}
