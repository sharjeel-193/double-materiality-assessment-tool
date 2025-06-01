import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Company } from 'src/company/entities/company.entity';

@ObjectType()
export class AuthUserResponse {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    role: string;

    @Field(() => ID)
    companyId: string;

    @Field(() => Company, { nullable: true })
    company: Company;
}
