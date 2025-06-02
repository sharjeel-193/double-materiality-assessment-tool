export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    company?: {
        id: string;
        name: string;
    };
}