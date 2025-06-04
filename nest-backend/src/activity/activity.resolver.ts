import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => Activity)
export class ActivityResolver {
    constructor(private readonly activityService: ActivityService) {}

    @Mutation(() => Activity)
    @UseGuards(GqlAuthGuard)
    async createActivity(
        @Args('createActivityInput') createActivityInput: CreateActivityInput,
    ) {
        return this.activityService.create(createActivityInput);
    }

    @Query(() => [Activity])
    @UseGuards(GqlAuthGuard)
    async activitiesByContext(
        @Args('contextId', { type: () => String }) contextId: string,
    ) {
        return this.activityService.findByContext(contextId);
    }

    @Query(() => Activity)
    @UseGuards(GqlAuthGuard)
    async activity(@Args('id', { type: () => String }) id: string) {
        return this.activityService.findOne(id);
    }

    @Mutation(() => Activity)
    @UseGuards(GqlAuthGuard)
    async updateActivity(
        @Args('id', { type: () => String }) id: string,
        @Args('updateActivityInput') updateActivityInput: UpdateActivityInput,
    ) {
        return this.activityService.update(id, updateActivityInput);
    }

    @Mutation(() => Activity)
    @UseGuards(GqlAuthGuard)
    async removeActivity(@Args('id', { type: () => String }) id: string) {
        return this.activityService.remove(id);
    }
}
