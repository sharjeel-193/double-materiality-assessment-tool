// dto/company-response.dto.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CurrentCompanyResponse {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => String, { nullable: true })
    address: string | null;

    @Field(() => [Number])
    reportYears: number[];
}
