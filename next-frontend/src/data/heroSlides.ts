interface HeroSlideItem {
    id: number,
    title: string,
    subtitle: string,
    primaryAction: string,
    secondaryAction: string,
    highlight: string,
    features: string[]
}
export const heroSlideItems: HeroSlideItem[] = [
    {
        id: 1,
        title: 'Empower Your Sustainability Journey',
        subtitle: 'Streamline your double materiality assessment with our comprehensive, ESRS-compliant platform designed specifically for software companies.',
        primaryAction: 'Start Assessment',
        secondaryAction: 'Watch Demo',
        highlight: 'ESRS Compliant',
        features: ['Automated Reporting', 'Stakeholder Management', 'Real-time Analytics'],
    },
    {
        id: 2,
        title: 'SusAF Framework Integration',
        subtitle: 'Leverage the power of Sustainable Awareness Framework to conduct thorough impact assessments and generate actionable insights.',
        primaryAction: 'Explore Features',
        secondaryAction: 'Learn More',
        highlight: 'SusAF Integrated',
        features: ['Impact Assessment', 'Materiality Matrix', 'Compliance Tracking'],
    },
    {
        id: 3,
        title: 'Built for Digital Excellence',
        subtitle: 'Tailored specifically for software-based companies with intuitive workflows, modern design, and powerful automation capabilities.',
        primaryAction: 'Get Started',
        secondaryAction: 'View Pricing',
        highlight: 'Software-Focused',
        features: ['Modern Interface', 'API Integration', 'Cloud-Native'],
    },
];