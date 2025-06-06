import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StakeholderSubmission } from './entities/stakeholder-submission.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CreateStakeholderSubmissionInput } from './dto/create-stakeholder-submission.input';
import { StakeholderSubmissionService } from './stakeholder-submission.service';
import {
    StakeholderSubmissionResponse,
    StakeholderSubmissionsResponse,
} from './dto/stakeholder-submission.response';

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

    @Mutation(() => StakeholderSubmission)
    @UseGuards(GqlAuthGuard)
    async removeStakeholderSubmission(
        @Args('id', { type: () => String }) id: string,
    ) {
        const result = await this.stakeholderSubmissionService.remove(id);
        return result;
    }
}
