'use client';

import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';

import { motion } from 'framer-motion';
import { frameworkPhases as phases } from '@/data';


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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const phaseCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export function AboutSection() {
    const theme = useTheme();

    return (
        <Box
            component="section"
            id="about-section"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {/* Header Section */}
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 700,
                                    mb: 3,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                About MatriQ
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    lineHeight: 1.8,
                                    color: 'text.secondary',
                                    maxWidth: '900px',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                MatriQ is a comprehensive double materiality assessment tool designed specifically for software-based companies. 
                                It streamlines the sustainability reporting process by integrating the latest ESRS standards and the Sustainable Awareness Framework (SusAF). 
                                MatriQ guides organizations through a structured, multi-phase assessment method, enabling them to identify, evaluate, and report on material sustainability topics with precision and clarity. 
                                With its intuitive interface and robust analytics, MatriQ empowers companies to make informed decisions that align with regulatory requirements and stakeholder expectations.
                            </Typography>
                        </motion.div>
                    </Box>

                    {/* Assessment Phases Section */}
                    <Box sx={{ mb: 6 }}>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h3"
                                component="h3"
                                sx={{
                                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    mb: 6,
                                    color: 'text.primary',
                                }}
                            >
                                Our 4-Phase Assessment Method
                            </Typography>
                        </motion.div>

                        <Box>
                            <Grid 
                                container 
                                spacing={3} 
                                sx={{
                                    display: 'flex', 
                                    alignItems: 'stretch', 
                                    justifyContent: 'center'
                                }}
                            >
                                {phases.map((phase) => {
                                    const cardColor = phase.id%2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main
                                    return(
                                        <Grid 
                                            size={{ xs: 12, sm: 6, lg: 3 }} 
                                            key={phase.id}
                                            sx={{ display: 'flex' }} // KEY FIX: Add display flex to Grid item
                                        >
                                            <motion.div
                                                variants={phaseCardVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                transition={{ delay: phase.delay }}
                                                whileHover={{ scale: 1.02 }}
                                                style={{ 
                                                    height: '100%', 
                                                    width: '100%', 
                                                    display: 'flex' 
                                                }} 
                                            >
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        width: '100%', 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        border: '2px solid',
                                                        borderColor: 'divider',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            borderColor: cardColor,
                                                            boxShadow: `0 8px 32px ${cardColor}20`,
                                                        },
                                                    }}
                                                >
                                                    <CardContent 
                                                        sx={{ 
                                                            p: 3,
                                                            display: 'flex', 
                                                            flexDirection: 'column', 
                                                            height: '100%', 
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1 }}>
                                                            {/* Phase Number & Icon */}
                                                            <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 50,
                                                                        height: 50,
                                                                        borderRadius: '50%',
                                                                        bgcolor: cardColor,
                                                                        color: 'white',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        mb: 1,
                                                                        fontSize: '1.25rem',
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    {phase.id}
                                                                </Box>
                                                                <Box sx={{ color: cardColor }}>
                                                                    <phase.icon size={phase.iconSize || 32} />
                                                                </Box>
                                                            </Box>

                                                            {/* Content */}
                                                            <Box 
                                                                sx={{ 
                                                                    flex: 1,
                                                                    display: 'flex', // KEY FIX: Add display flex
                                                                    flexDirection: 'column', // KEY FIX: Add flex direction
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        mb: 1,
                                                                        fontSize: '1rem',
                                                                        color: 'text.primary',
                                                                    }}
                                                                >
                                                                    {phase.title}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'text.secondary',
                                                                        lineHeight: 1.5,
                                                                        flexGrow: 1, // KEY FIX: This makes description fill remaining space
                                                                    }}
                                                                >
                                                                    {phase.description}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
