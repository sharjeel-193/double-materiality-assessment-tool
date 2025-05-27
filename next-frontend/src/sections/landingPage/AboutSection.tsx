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
import Image from 'next/image';

import { motion } from 'framer-motion';
import { frameworkPhases as phases } from '@/data';
import { containerVariants, itemVariants, cardVariants as phaseCardVariants } from '@/lib/animations';

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
                                className='gradient-color-heading'
                                variant="h2"
                                component="h2"
                                sx={{ mb: 3 }} // Fixed: Use sx instead of direct prop
                            >
                                About MatriQ
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'text.secondary',
                                    mx: 'auto',
                                    maxWidth: 900,
                                    lineHeight: 1.6,
                                    mb: 2,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' }, // Added responsive sizing
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
                                    textAlign: 'center',
                                    mb: 6,
                                    fontSize: { xs: '1.75rem', md: '2.25rem' }, // Added responsive sizing
                                    fontWeight: 600,
                                }}
                            >
                                Our {phases.length}-Phase Assessment Method
                            </Typography>
                        </motion.div>

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
                                const cardColor = phase.id % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main;
                                return (
                                    <Grid 
                                        size={{ xs: 12, sm: 6, lg: 3 }} 
                                        key={phase.id}
                                        sx={{ display: 'flex' }}
                                    >
                                        <motion.div
                                            variants={phaseCardVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            transition={{ delay: (phase.id - 1) * 0.1 }}
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
                                                    borderRadius: 2, // Added consistent border radius
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        borderColor: cardColor,
                                                        boxShadow: `0 8px 32px ${cardColor}20`,
                                                    },
                                                }}
                                            >
                                                <CardContent 
                                                    sx={{ 
                                                        p: { xs: 2.5, md: 3 }, // Fixed: Responsive padding
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        height: '100%',
                                                        '&:last-child': { pb: { xs: 2.5, md: 3 } }, // Fixed: Override MUI default
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'flex-start', 
                                                        gap: 2, 
                                                        flexGrow: 1 
                                                    }}>
                                                        {/* Phase Number & Icon */}
                                                        <Box sx={{ 
                                                            textAlign: 'center', 
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: 1, // Fixed: Consistent gap
                                                        }}>
                                                            <Box
                                                                sx={{
                                                                    width: { xs: 45, md: 50 }, // Fixed: Responsive sizing
                                                                    height: { xs: 45, md: 50 },
                                                                    borderRadius: '50%',
                                                                    bgcolor: cardColor,
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: { xs: '1.1rem', md: '1.25rem' }, // Fixed: Responsive font
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {phase.id}
                                                            </Box>
                                                            <Box sx={{ 
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}>
                                                                <Image
                                                                    src={phase.icon}
                                                                    alt={phase.title}
                                                                    width={32}
                                                                    height={32}
                                                                    style={{ objectFit: 'contain' }}
                                                                />
                                                            </Box>
                                                        </Box>

                                                        {/* Content */}
                                                        <Box 
                                                            sx={{ 
                                                                flex: 1,
                                                                display: 'flex', 
                                                                flexDirection: 'column',
                                                                minHeight: 0, // Fixed: Prevent flex overflow
                                                            }}
                                                        >
                                                            <Typography 
                                                                variant="h6" 
                                                                component="h4" 
                                                                mb={1}
                                                            >
                                                                {phase.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color='text.secondary'
                                                            >
                                                                {phase.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
