// validation/contextSchema.ts
import { z } from 'zod';

export const contextSchema = z.object({
    location: z.enum(['LOCAL', 'NATIONAL', 'CONTINENTAL', 'GLOBAL'], {
        required_error: 'Business location is required'
    }),
    type: z.enum(['PRODUCTION', 'TRADE', 'SERVICE', 'EXTRACTION'], {
        required_error: 'Business type is required'
    }),
    form: z.enum(['SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'CORPORATION'], {
        required_error: 'Legal form is required'
    }),
    size_employees: z.enum(['SMALLER', 'SMALL', 'MEDIUM', 'BIG'], {
        required_error: 'Company size (employees) is required'
    }),
    size_revenue: z.enum(['SMALLER', 'SMALL', 'MEDIUM', 'BIG'], {
        required_error: 'Company size (revenue) is required'
    }),
    customer_scope: z.enum(['LOCAL', 'NATIONAL', 'CONTINENTAL', 'GLOBAL'], {
        required_error: 'Customer scope is required'
    }),
    supply_chain_scope: z.enum(['LOCAL', 'NATIONAL', 'CONTINENTAL', 'GLOBAL'], {
        required_error: 'Supply chain scope is required'
    }),
    extra_details: z.string().optional()
});

export type ContextFormData = z.infer<typeof contextSchema>;
