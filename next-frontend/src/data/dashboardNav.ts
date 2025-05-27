import { IconType } from "react-icons";
import {
    MdHome as HomeIcon,
    MdBusiness as CompanyIcon,
    MdPeople as StakeholdersIcon,
    MdEco as SustainabilityIcon,
    MdAssessment as DMAIcon,
} from 'react-icons/md';

interface NavItem {
    label: string;
    path: string;
    icon: IconType;
}

export const dashboardNavItems: NavItem[] = [
    {
        label: 'Home',
        icon: HomeIcon,
        path: '/dashboard',
    },
    {
        label: 'Company Context',
        icon: CompanyIcon,
        path: '/dashboard/company-context',
    },
    {
        label: 'Stakeholders',
        icon: StakeholdersIcon,
        path: '/dashboard/stakeholders',
    },
    {
        label: 'Sustainability Topics',
        icon: SustainabilityIcon,
        path: '/dashboard/sustainability-topics',
    },
    {
        label: 'DMA',
        icon: DMAIcon,
        path: '/dashboard/dma',
    },
];