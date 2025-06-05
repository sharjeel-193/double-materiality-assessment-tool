// stakeholder/stakeholder.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { Stakeholder } from './entities/stakeholder.entity';
import { CreateStakeholderInput } from './dto/create-stakeholder.input';
import { UpdateStakeholderInput } from './dto/update-stakeholder.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => Stakeholder)
export class StakeholderResolver {
    constructor(private readonly stakeholderService: StakeholderService) {}

    @Mutation(() => Stakeholder)
    @UseGuards(GqlAuthGuard)
    async createStakeholder(
        @Args('createStakeholderInput')
        createStakeholderInput: CreateStakeholderInput,
    ) {
        const result = await this.stakeholderService.create(
            createStakeholderInput,
        );
        return result.data;
    }

    @Query(() => [Stakeholder])
    @UseGuards(GqlAuthGuard)
    async stakeholders() {
        const result = await this.stakeholderService.findAll();
        return result.data;
    }

    @Query(() => [Stakeholder])
    @UseGuards(GqlAuthGuard)
    async stakeholdersByActivity(
        @Args('activityId', { type: () => String }) activityId: string,
    ) {
        const result = await this.stakeholderService.findByActivity(activityId);
        return result.data;
    }

    // ✅ New resolver: Get stakeholders by report and context
    @Query(() => [Stakeholder])
    @UseGuards(GqlAuthGuard)
    async stakeholdersByReport(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        const result = await this.stakeholderService.findByReport(reportId);
        return result.data;
    }

    @Query(() => Stakeholder)
    @UseGuards(GqlAuthGuard)
    async stakeholder(@Args('id', { type: () => String }) id: string) {
        const result = await this.stakeholderService.findOne(id);
        return result.data;
    }

    @Mutation(() => Stakeholder)
    @UseGuards(GqlAuthGuard)
    async updateStakeholder(
        @Args('id', { type: () => String }) id: string,
        @Args('updateStakeholderInput')
        updateStakeholderInput: UpdateStakeholderInput,
    ) {
        const result = await this.stakeholderService.update(
            id,
            updateStakeholderInput,
        );
        return result.data;
    }

    @Mutation(() => Stakeholder)
    @UseGuards(GqlAuthGuard)
    async removeStakeholder(@Args('id', { type: () => String }) id: string) {
        const result = await this.stakeholderService.remove(id);
        return result.data;
    }
}
