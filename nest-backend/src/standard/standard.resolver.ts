import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StandardService } from './standard.service';
import { Standard } from './entities/standard.entity';
import { CreateStandardInput } from './dto/create-standard.input';
import { UpdateStandardInput } from './dto/update-standard.input';

@Resolver(() => Standard)
export class StandardResolver {
    constructor(private readonly standardService: StandardService) {}

    @Mutation(() => Standard, { description: 'Create a new standard' })
    createStandard(
        @Args('createStandardInput') createStandardInput: CreateStandardInput,
    ) {
        return this.standardService.create(createStandardInput);
    }

    @Query(() => [Standard], {
        name: 'standards',
        description: 'Get all standards',
    })
    findAll() {
        return this.standardService.findAll();
    }

    @Query(() => Standard, {
        name: 'standard',
        description: 'Get a standard by ID',
    })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.standardService.findOne(id);
    }

    @Mutation(() => Standard, { description: 'Update a standard' })
    updateStandard(
        @Args('updateStandardInput') updateStandardInput: UpdateStandardInput,
    ) {
        return this.standardService.update(
            updateStandardInput.id,
            updateStandardInput,
        );
    }

    @Mutation(() => Standard, { description: 'Delete a standard' })
    removeStandard(@Args('id', { type: () => String }) id: string) {
        return this.standardService.remove(id);
    }
}
