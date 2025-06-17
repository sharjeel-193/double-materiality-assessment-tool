// report/entities/report.entity.ts
import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Context } from 'src/context/entities/context.enitity';
import { Company } from 'src/company/entities/company.entity';
import { Standard } from 'src/standard/entities/standard.entity';

@ObjectType()
@InputType('ReportInput')
export class Report {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field(() => Int)
    @IsInt()
    year: number;

    @Field(() => ID)
    @IsUUID()
    companyId: string;

    @Field(() => ID)
    @IsUUID()
    standardId: string;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    totalStakeholders: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    importantStakeholders: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    totalTopics: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    materialTopics: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    totalImpacts: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    totalFinancialEffects: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    impactRadar?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    financialRadar?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    summary?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    topStakeholders?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    topTopics?: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(8)
    status: number;

    @Field(() => Context, { nullable: true })
    @IsOptional()
    @Type(() => Context)
    context?: Context;

    @Field(() => Standard, { nullable: true })
    @IsOptional()
    @Type(() => Standard)
    standard?: Standard;

    @Field(() => Company, { nullable: true })
    @IsOptional()
    @Type(() => Company)
    company?: Company;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
