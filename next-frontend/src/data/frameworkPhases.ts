import { IconType } from 'react-icons';
import {
    MdPeople as PeopleIcon,
    MdTopic as TopicIcon,
    MdAssessment as AssessmentIcon,
    MdReport as ReportIcon,
} from 'react-icons/md';

export interface Phase {
    id: number;
    title: string;
    description: string;
    icon: IconType;
    delay: number;
    iconSize?: number;
}

export const frameworkPhases: Phase[] = [
    {
        id: 1,
        title: "Phase 1: Stakeholder Mapping",
        description: "Identify and engage relevant internal and external stakeholders to gather diverse perspectives.",
        icon: PeopleIcon,
        delay: 0.1,
        iconSize: 32,
    },
    {
        id: 2,
        title: "Phase 2: Topic Identification", 
        description: "Determine key sustainability topics aligned with ESRS and SusAF frameworks.",
        icon: TopicIcon,
        delay: 0.2,
        iconSize: 32,
    },
    {
        id: 3,
        title: "Phase 3: Impact & Financial Assessment",
        description: "Evaluate the material impacts and financial implications of identified topics.",
        icon: AssessmentIcon,
        delay: 0.3,
        iconSize: 32,
    },
    {
        id: 4,
        title: "Phase 4: Reporting & Action",
        description: "Generate compliant reports and develop actionable strategies based on assessment results.",
        icon: ReportIcon,
        delay: 0.4,
        iconSize: 32,
    },
];
