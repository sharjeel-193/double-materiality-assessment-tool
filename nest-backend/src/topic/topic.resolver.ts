import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
} from '@nestjs/graphql';
import { TopicService } from './topic.service';
import { Topic } from './entities/topic.entity';
import { Dimension } from '../dimension/entities/dimension.entity';
import { CreateTopicInput } from './dto/create-topic.input';
import { UpdateTopicInput } from './dto/update-topic.input';

@Resolver(() => Topic)
export class TopicResolver {
    constructor(private readonly topicService: TopicService) {}

    @Mutation(() => Topic, { description: 'Create a new topic' })
    createTopic(@Args('createTopicInput') createTopicInput: CreateTopicInput) {
        return this.topicService.create(createTopicInput);
    }

    @Query(() => [Topic], { name: 'topics', description: 'Get all topics' })
    findAll() {
        return this.topicService.findAll();
    }

    @Query(() => Topic, { name: 'topic', description: 'Get a topic by ID' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.topicService.findOne(id);
    }

    @Query(() => [Topic], {
        name: 'topicsByDimension',
        description: 'Get topics by dimension ID',
    })
    findByDimension(
        @Args('dimensionId', { type: () => String }) dimensionId: string,
    ) {
        return this.topicService.findByDimension(dimensionId);
    }

    @Query(() => [Topic], {
        name: 'topicsByStandard',
        description: 'Get topics by Standard ID',
    })
    findByStandard(
        @Args('standardId', { type: () => String }) standardId: string,
    ) {
        return this.topicService.findByStandard(standardId);
    }

    @Mutation(() => Topic, { description: 'Update a topic' })
    updateTopic(@Args('updateTopicInput') updateTopicInput: UpdateTopicInput) {
        return this.topicService.update(updateTopicInput.id, updateTopicInput);
    }

    @Mutation(() => Topic, { description: 'Delete a topic' })
    removeTopic(@Args('id', { type: () => String }) id: string) {
        return this.topicService.remove(id);
    }

    // Field resolver for dimension relationship
    @ResolveField(() => Dimension, { nullable: true })
    async dimension(@Parent() topic: Topic) {
        return this.topicService.getDimension(topic.dimensionId);
    }
}
