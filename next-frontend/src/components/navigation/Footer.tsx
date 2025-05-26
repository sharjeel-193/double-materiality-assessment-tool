'use client';

import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider,
} from '@mui/material';
import {
    MdEmail as EmailIcon,
    MdPhone as PhoneIcon,
    MdLocationOn as LocationIcon,
    MdArrowUpward as ArrowUpIcon,
} from 'react-icons/md';
import {
    FaLinkedin as LinkedInIcon,
    FaTwitter as TwitterIcon,
    FaGithub as GitHubIcon,
    FaYoutube as YouTubeIcon,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers';

// Footer data
const footerSections = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '/#about-section' },
            { label: 'Assessment Tool', href: '/dashboard' },
            { label: 'Reporting', href: '/reports' },
            { label: 'Integrations', href: '/integrations' },
            { label: 'Pricing', href: '/pricing' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'API Reference', href: '/api-docs' },
            { label: 'Help Center', href: '/help' },
            { label: 'Tutorials', href: '/tutorials' },
            { label: 'Webinars', href: '/webinars' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
            { label: 'Press', href: '/press' },
            { label: 'Partners', href: '/partners' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Security', href: '/security' },
            { label: 'Compliance', href: '/compliance' },
        ],
    },
];

const socialLinks = [
    { icon: <LinkedInIcon size={20} />, href: 'https://linkedin.com/company/matriq', label: 'LinkedIn' },
    { icon: <TwitterIcon size={20} />, href: 'https://twitter.com/matriq', label: 'Twitter' },
    { icon: <GitHubIcon size={20} />, href: 'https://github.com/matriq', label: 'GitHub' },
    { icon: <YouTubeIcon size={20} />, href: 'https://youtube.com/@matriq', label: 'YouTube' },
];

const contactInfo = [
    { icon: <EmailIcon size={16} />, text: 'hello@matriq.com', href: 'mailto:hello@matriq.com' },
    { icon: <PhoneIcon size={16} />, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: <LocationIcon size={16} />, text: '123 Sustainability St, Green City, GC 12345', href: null },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};



export function Footer() {
    const router = useRouter();
    const { mode } = useThemeContext();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleLinkClick = (href: string) => {
        if (href.startsWith('/#')) {
            // Handle anchor links for landing page
            const elementId = href.substring(2);
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (href.startsWith('http')) {
            // External links
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            // Internal navigation
            router.push(href);
        }
    };

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                mt: 'auto',
            }}
        >
            {/* Main Footer Content */}
            <Container maxWidth="lg">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Box sx={{ py: { xs: 6, md: 8 } }}>
                        <Grid container spacing={4}>
                            {/* Brand Section */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <motion.div variants={itemVariants}>
                                    <Box sx={{ mb: 3, display: 'flex' }}>
                                        <Image
                                            src={`/logos/logo-${mode === 'light' ? 'dark' : 'light'}.png`}
                                            alt="MatriQ - Double Materiality Assessment Tool"
                                            width={160}
                                            height={40}
                                            style={{ 
                                                objectFit: 'contain',
                                                objectPosition: 'left center', // Align logo to left
                                                display: 'block',
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 3,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        MatriQ streamlines sustainability reporting with comprehensive 
                                        double materiality assessments aligned with ESRS and SusAF frameworks.
                                    </Typography>

                                    {/* Contact Info */}
                                    <Box sx={{ mb: 3 }}>
                                        {contactInfo.map((contact, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 1,
                                                    cursor: contact.href ? 'pointer' : 'default',
                                                }}
                                                onClick={() => contact.href && handleLinkClick(contact.href)}
                                            >
                                                <Box sx={{ color: 'primary.main' }}>
                                                    {contact.icon}
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: '0.875rem',
                                                        '&:hover': contact.href ? {
                                                            color: 'primary.main',
                                                        } : {},
                                                    }}
                                                >
                                                    {contact.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Social Links */}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {socialLinks.map((social) => (
                                            <IconButton
                                                key={social.label}
                                                component={motion.button}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleLinkClick(social.href)}
                                                sx={{
                                                    color: 'text.secondary',
                                                    bgcolor: 'action.hover',
                                                    '&:hover': {
                                                        color: 'primary.main',
                                                        bgcolor: 'primary.main',
                                                    },
                                                }}
                                                aria-label={social.label}
                                            >
                                                {social.icon}
                                            </IconButton>
                                        ))}
                                    </Box>
                                </motion.div>
                            </Grid>

                            {/* Footer Links */}
                            {footerSections.map((section) => (
                                <Grid size={{ xs: 6, sm: 3, md: 2 }} key={section.title}>
                                    <motion.div variants={itemVariants}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 2,
                                                color: 'text.primary',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {section.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {section.links.map((link) => (
                                                <Link
                                                    key={link.label}
                                                    component={motion.a}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => handleLinkClick(link.href)}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        textDecoration: 'none',
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer',
                                                        transition: 'color 0.2s ease',
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                        },
                                                    }}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                <Divider />

                {/* Bottom Section */}
                <Box
                    sx={{
                        py: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        © {new Date().getFullYear()} MatriQ. All rights reserved. 
                        Built with sustainability in mind.
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                            }}
                        >
                            ESRS Compliant • SusAF Integrated
                        </Typography>

                        {/* Back to Top Button */}
                        <IconButton
                            component={motion.button}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                            aria-label="Back to top"
                        >
                            <ArrowUpIcon size={20} />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
