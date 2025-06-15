import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    TEAM_LEADER = 'TEAM_LEADER',
    TEAM_MEMBER = 'TEAM_MEMBER',
}

registerEnumType(UserRole, {
    name: 'UserRole',
});

export enum SubmissionType {
    INTERNAL = 'INTERNAL',
    STAKEHOLDER = 'STAKEHOLDER',
}

registerEnumType(SubmissionType, {
    name: 'SubmissionType',
});

export enum TopicRatingType {
    FINANCIAL = 'FINANCIAL',
    IMPACT = 'IMPACT',
}

registerEnumType(TopicRatingType, {
    name: 'TopicRatingType',
});

export enum LocationScope {
    LOCAL = 'LOCAL',
    NATIONAL = 'NATIONAL',
    GLOBAL = 'GLOBAL',
    CONTINENTAL = 'CONTINENTAL',
}

export enum BusinessForm {
    SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
    PARTNERSHIP = 'PARTNERSHIP',
    CORPORATION = 'CORPORATION',
}

export enum ContextType {
    PRODUCTION = 'PRODUCTION',
    TRADE = 'TRADE',
    SERVICE = 'SERVICE',
    EXTRACTION = 'EXTRACTION',
}

export enum CompanySize {
    SMALLER = 'SMALLER',
    SMALL = 'SMALL', // ✅ Fixed typo from 'SMAL'
    MEDIUM = 'MEDIUM',
    BIG = 'BIG',
}

// Register enums for GraphQL
registerEnumType(LocationScope, {
    name: 'LocationScope',
    description: 'Geographic scope of operations',
});

registerEnumType(BusinessForm, {
    name: 'BusinessForm',
    description: 'Legal form of business entity',
});

registerEnumType(ContextType, {
    name: 'ContextType',
    description: 'Type of business context/activity',
});

registerEnumType(CompanySize, {
    name: 'CompanySize',
    description: 'Size classification of company',
});

export enum ActivityType {
    UPSTREAM = 'UPSTREAM',
    DOWNSTREAM = 'DOWNSTREAM',
}

registerEnumType(ActivityType, {
    name: 'ActivityType',
    description: 'Position in value chain',
});

export enum ImpactType {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE',
}

export enum OrderOfImpact {
    IMMEDIATE = 'IMMEDIATE',
    ENABLING = 'ENABLING',
    STRUCTURAL = 'STRUCTURAL',
}

registerEnumType(ImpactType, {
    name: 'ImpactType',
    description: 'The type of impact (positive or negative)',
});

registerEnumType(OrderOfImpact, {
    name: 'OrderOfImpact',
    description: 'The order of effect for the impact',
});

export enum FinancialEffectType {
    RISK = 'RISK',
    OPPORTUNITY = 'OPPORTUNITY',
}

registerEnumType(FinancialEffectType, {
    name: 'FinancialEffectType',
    description: 'Financial Effect Type (Risk or Opportunity)',
});
