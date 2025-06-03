// report/dto/create-report.input.ts
import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsInt, IsString, IsNotEmpty, Min, Max } from 'class-validator';

@InputType()
export class CreateReportInput {
    @Field(() => Int)
    @IsInt()
    @Min(2020)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    standardId: string;

    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    totalTopics?: number;

    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    materialTopics?: number;

    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    totalImpacts?: number;

    @Field(() => Int, { defaultValue: 0 })
    @IsInt()
    @Min(0)
    materialImpacts?: number;
}
