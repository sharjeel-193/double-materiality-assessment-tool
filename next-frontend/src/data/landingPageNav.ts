interface NavItem {
    label: string;
    href: string;
    sectionId: string;
    description: string
}

export const landingPageNavItems: NavItem[] = [
    {
            label: 'Home',
            href: '#hero-section',
            sectionId: 'hero-section',
            description: 'Welcome to our platform',
    },
    {
            label: 'About',
            href: '#about-section',
            sectionId: 'about-section',
            description: 'Learn about our features and benefits',
    },
    {
            label: 'Contact',
            href: '#contact-section',
            sectionId: 'contact-section',
            description: 'Get in touch with us',
    },
];