interface Phase {
    id: number;
    title: string;
    description: string;
    icon: string
}

export const frameworkPhases: Phase[] = [
    {
        id: 1,
        title: "Phase 1: Stakeholder Mapping",
        description: "Identify and engage relevant internal and external stakeholders to gather diverse perspectives.",
        icon: "/icons/phase1-icon.png",

    },
    {
        id: 2,
        title: "Phase 2: Topic Identification", 
        description: "Determine key sustainability topics aligned with ESRS and SusAF frameworks.",
        icon: "/icons/phase2-icon.png",

    },
    {
        id: 3,
        title: "Phase 3: Impact & Financial Assessment",
        description: "Evaluate the material impacts and financial implications of identified topics.",
        icon: "/icons/phase3-icon.png",

    },
    {
        id: 4,
        title: "Phase 4: Reporting & Action",
        description: "Generate compliant reports and develop actionable strategies based on assessment results.",
        icon: "/icons/phase4-icon.png",

    },
];

