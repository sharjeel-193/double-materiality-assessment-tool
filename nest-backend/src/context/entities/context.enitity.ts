// context/entities/context.entity.ts
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import {
    LocationScope,
    BusinessForm,
    ContextType,
    CompanySize,
} from '../../common/enums';

@ObjectType()
@InputType('ContextInput') // ✅ Make it usable as InputType too
export class Context {
    @Field(() => ID)
    id: string;

    @Field(() => LocationScope)
    @IsEnum(LocationScope)
    location: LocationScope;

    @Field(() => ContextType)
    @IsEnum(ContextType)
    type: ContextType;

    @Field(() => BusinessForm)
    @IsEnum(BusinessForm)
    form: BusinessForm;

    @Field(() => CompanySize)
    @IsEnum(CompanySize)
    size_employees: CompanySize;

    @Field(() => CompanySize)
    @IsEnum(CompanySize)
    size_revenue: CompanySize;

    @Field(() => LocationScope)
    @IsEnum(LocationScope)
    customer_scope: LocationScope;

    @Field(() => LocationScope)
    @IsEnum(LocationScope)
    supply_chain_scope: LocationScope;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    extra_details?: string;

    @Field(() => ID)
    @IsNotEmpty()
    reportId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
