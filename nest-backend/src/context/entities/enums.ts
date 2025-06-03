// common/enums/context.enums.ts
import { registerEnumType } from '@nestjs/graphql';

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
