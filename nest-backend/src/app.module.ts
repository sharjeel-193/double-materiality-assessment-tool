import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StandardModule } from './standard/standard.module';
import { DimensionModule } from './dimension/dimension.module';
import { TopicModule } from './topic/topic.module';
import { ReportModule } from './report/report.module';
import { ContextModule } from './context/context.module';
import { ActivityModule } from './activity/activity.module';
import { StakeholderModule } from './stakeholder/stakeholder.module';
import { UserSubmissionModule } from './user-submission/user-submission.module';
import { StakeholderSubmissionModule } from './stakeholder-submission/stakeholder-submission.module';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true, // Enable auto-schema generation
            graphiql: true,
            context: ({ req, res }) => ({ req, res }),
        }),
        PrismaModule,
        CompanyModule,
        UserModule,
        AuthModule,
        StandardModule,
        DimensionModule,
        TopicModule,
        ReportModule,
        ContextModule,
        ActivityModule,
        StakeholderModule,
        UserSubmissionModule,
        StakeholderSubmissionModule,
    ],
    controllers: [AppController],
    providers: [AppService], // Remove PrismaService, UserService, UserResolver
})
export class AppModule {}
