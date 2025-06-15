import { ObjectType, Field } from '@nestjs/graphql';
import { Impact } from '../entities/impact.entity';

@ObjectType()
export class ImpactResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => Impact)
    data: Impact;
}

@ObjectType()
export class ImpactsResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [Impact])
    data: Impact[];
}
