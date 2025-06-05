// dto/stakeholder-submission-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Stakeholder } from '../entities/stakeholder.entity';

@ObjectType()
export class StakeholderResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => Stakeholder)
    data: Stakeholder;
}

@ObjectType()
export class StakeholdersResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [Stakeholder])
    data: Stakeholder[];
}
