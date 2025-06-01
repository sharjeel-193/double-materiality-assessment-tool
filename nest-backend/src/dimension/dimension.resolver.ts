import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DimensionService } from './dimension.service';
import { Dimension } from './entities/dimension.entity';
import { CreateDimensionInput } from './dto/create-dimension.input';
import { UpdateDimensionInput } from './dto/update-dimension.input';

@Resolver(() => Dimension)
export class DimensionResolver {
    constructor(private readonly dimensionService: DimensionService) {}

    @Mutation(() => Dimension, { description: 'Create a new dimension' })
    createDimension(
        @Args('createDimensionInput')
        createDimensionInput: CreateDimensionInput,
    ) {
        return this.dimensionService.create(createDimensionInput);
    }

    @Query(() => [Dimension], {
        name: 'dimensions',
        description: 'Get all dimensions',
    })
    findAll() {
        return this.dimensionService.findAll();
    }

    @Query(() => Dimension, {
        name: 'dimension',
        description: 'Get a dimension by ID',
    })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.dimensionService.findOne(id);
    }

    @Query(() => [Dimension], {
        name: 'dimensionsByStandard',
        description: 'Get dimensions by standard ID',
    })
    findByStandard(
        @Args('standardId', { type: () => String }) standardId: string,
    ) {
        return this.dimensionService.findByStandard(standardId);
    }

    // src/dimension/dimension.resolver.ts
    @Mutation(() => Dimension, { description: 'Update a dimension' })
    updateDimension(
        @Args('id', { type: () => String }) id: string,
        @Args('updateDimensionInput')
        updateDimensionInput: UpdateDimensionInput,
    ) {
        return this.dimensionService.update(id, updateDimensionInput);
    }

    @Mutation(() => Dimension, { description: 'Delete a dimension' })
    removeDimension(@Args('id', { type: () => String }) id: string) {
        return this.dimensionService.remove(id);
    }
}
