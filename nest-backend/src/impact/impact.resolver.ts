import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ImpactService } from './impact.service';
import { Impact } from './entities/impact.entity';
import { CreateImpactInput } from './dto/create-impact.input';
import { UpdateImpactInput } from './dto/update-impact.input';
import { ImpactResponse, ImpactsResponse } from './dto/impact-response';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Impact)
export class ImpactResolver {
    constructor(private readonly impactService: ImpactService) {}

    @Mutation(() => ImpactResponse, { name: 'createImpact' })
    @UseGuards(GqlAuthGuard)
    createImpact(
        @Args('createImpactInput') createImpactInput: CreateImpactInput,
    ) {
        return this.impactService.create(createImpactInput);
    }

    @Query(() => ImpactsResponse, { name: 'impactsByReport' })
    @UseGuards(GqlAuthGuard)
    findImpactsByReport(
        @Args('reportId', { type: () => ID }) reportId: string,
    ) {
        return this.impactService.findByReport(reportId);
    }

    @Query(() => ImpactResponse, { name: 'impact' })
    @UseGuards(GqlAuthGuard)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.impactService.findOne(id);
    }

    @Mutation(() => ImpactResponse, { name: 'updateImpact' })
    @UseGuards(GqlAuthGuard)
    updateImpact(
        @Args('id', { type: () => ID }) id: string,
        @Args('updateImpactInput') updateImpactInput: UpdateImpactInput,
    ) {
        return this.impactService.update(id, updateImpactInput);
    }

    @Mutation(() => ImpactResponse, { name: 'removeImpact' })
    @UseGuards(GqlAuthGuard)
    removeImpact(@Args('id', { type: () => ID }) id: string) {
        return this.impactService.remove(id);
    }
}
