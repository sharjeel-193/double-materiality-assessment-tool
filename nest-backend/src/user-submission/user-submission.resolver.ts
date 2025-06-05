// user-submission/user-submission.resolver.ts
import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserSubmissionService } from './user-submission.service';
import { UserSubmission } from './entities/user-submission.entity';
import { StakeholderRating } from './entities/stakeholder-rating.entity';
import { CreateUserSubmissionInput } from './dto/create-user-submission.input';
import { GqlAuthGuard } from '../auth/auth.guard';
import {
    UserSubmissionResponse,
    UserSubmissionsByReportResponse,
    UserSubmissionsResponse,
} from './dto/user-submission.response';

@Resolver(() => UserSubmission)
export class UserSubmissionResolver {
    constructor(
        private readonly userSubmissionService: UserSubmissionService,
    ) {}

    @Mutation(() => UserSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async createUserSubmission(
        @Args('createUserSubmissionInput')
        createUserSubmissionInput: CreateUserSubmissionInput,
    ) {
        const result = await this.userSubmissionService.create(
            createUserSubmissionInput,
        );
        return result;
    }

    @Query(() => UserSubmissionsResponse)
    @UseGuards(GqlAuthGuard)
    async userSubmissions() {
        const result = await this.userSubmissionService.findAll();
        return result;
    }

    @Query(() => UserSubmissionsResponse)
    @UseGuards(GqlAuthGuard)
    async userSubmissionsByUser(
        @Args('userId', { type: () => String }) userId: string,
    ) {
        const result = await this.userSubmissionService.findByUser(userId);
        return result;
    }

    @Query(() => UserSubmissionsResponse)
    @UseGuards(GqlAuthGuard)
    async userSubmissionsByReport(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        const result = await this.userSubmissionService.findByReport(reportId);
        return result;
    }

    @Query(() => UserSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async userSubmission(@Args('id', { type: () => String }) id: string) {
        const result = await this.userSubmissionService.findOne(id);
        return result;
    }

    @Mutation(() => UserSubmissionResponse)
    @UseGuards(GqlAuthGuard)
    async removeUserSubmission(@Args('id', { type: () => String }) id: string) {
        const result = await this.userSubmissionService.remove(id);
        return result;
    }

    // ✅ Additional stakeholder rating operations
    @Mutation(() => StakeholderRating)
    @UseGuards(GqlAuthGuard)
    async addStakeholderRating(
        @Args('submissionId', { type: () => String }) submissionId: string,
        @Args('stakeholderId', { type: () => String }) stakeholderId: string,
        @Args('influence', { type: () => Float }) influence: number,
        @Args('impact', { type: () => Float }) impact: number,
        @Args('score', { type: () => Float, nullable: true }) score?: number,
    ) {
        const result = await this.userSubmissionService.addStakeholderRating(
            submissionId,
            stakeholderId,
            influence,
            impact,
            score,
        );
        return result;
    }

    @Mutation(() => StakeholderRating)
    @UseGuards(GqlAuthGuard)
    async removeStakeholderRating(
        @Args('submissionId', { type: () => String }) submissionId: string,
        @Args('stakeholderId', { type: () => String }) stakeholderId: string,
    ) {
        const result = await this.userSubmissionService.removeStakeholderRating(
            submissionId,
            stakeholderId,
        );
        return result;
    }

    @Query(() => [StakeholderRating])
    @UseGuards(GqlAuthGuard)
    async stakeholderRatingsBySubmission(
        @Args('submissionId', { type: () => String }) submissionId: string,
    ) {
        const result =
            await this.userSubmissionService.getStakeholderRatings(
                submissionId,
            );
        return result;
    }

    @Query(() => UserSubmissionsByReportResponse)
    async userSubmissionsByReportGrouped(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        return this.userSubmissionService.findByReportGrouped(reportId);
    }
}
