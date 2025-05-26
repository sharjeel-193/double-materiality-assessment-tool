'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    MdPlayArrow as PlayIcon,
    MdArrowForward as ArrowForwardIcon,
    MdKeyboardArrowLeft as ArrowLeftIcon,
    MdKeyboardArrowRight as ArrowRightIcon,
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '@/providers';
import { heroSlideItems as slides } from '@/data';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const slideInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

const floatVariants = {
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const pulseVariants = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const theme = useTheme();
    const { mode } = useThemeContext();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 6000);

        return () => clearInterval(interval);
    }, [currentSlide, isAnimating]);

    const nextSlide = () => {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToSlide = (index: number) => {
        if (index !== currentSlide && !isAnimating) {
            setIsAnimating(true);
            setCurrentSlide(index);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const handleSecondaryAction = () => {
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const currentSlideData = slides[currentSlide];

    return (
        <Box
            component="section"
            id="hero-section"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light} 0%, ${mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light} 100%)`,
                color: 'white',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 1,
                },
            }}
        >

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, paddingY: 4 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: 4, md: 8 },
                        alignItems: 'center',
                        minHeight: '80vh',
                    }}
                >
                    {/* Content Side */}
                    <Box sx={{ order: { xs: 2, md: 1 } }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {/* Highlight Badge */}
                                <motion.div variants={slideInLeftVariants}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            px: 3,
                                            py: 1,
                                            borderRadius: 3,
                                            mb: 3,
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                            }}
                                        >
                                            ✨ {currentSlideData.highlight}
                                        </Typography>
                                    </Box>
                                </motion.div>

                                {/* Main Title */}
                                <motion.div variants={itemVariants}>
                                    <Typography
                                        variant="h1"
                                        component="h1"
                                        sx={{
                                            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                            fontWeight: 700,
                                            lineHeight: 1.1,
                                            mb: 3,
                                            background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {currentSlideData.title}
                                    </Typography>
                                </motion.div>

                                {/* Subtitle */}
                                <motion.div variants={itemVariants}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                                            fontWeight: 400,
                                            lineHeight: 1.6,
                                            mb: 4,
                                            opacity: 0.9,
                                        }}
                                    >
                                        {currentSlideData.subtitle}
                                    </Typography>
                                </motion.div>

                                {/* Feature List */}
                                <motion.div variants={itemVariants}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 2,
                                            mb: 4,
                                        }}
                                    >
                                        {currentSlideData.features.map((feature, index) => (
                                            <motion.div
                                                key={`${feature}-${index}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                        px: 2,
                                                        py: 0.5,
                                                        borderRadius: 2,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    ✓ {feature}
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Box>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div variants={itemVariants}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 2,
                                        }}
                                    >
                                        <Button
                                            component={motion.button}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                bgcolor: 'white',
                                                color: theme.palette.primary.main,
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 3,
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                textTransform: 'none',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {currentSlideData.primaryAction}
                                        </Button>

                                        <Button
                                            component={motion.button}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            variant="outlined"
                                            size="large"
                                            startIcon={<PlayIcon />}
                                            onClick={handleSecondaryAction}
                                            sx={{
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 3,
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                textTransform: 'none',
                                                backdropFilter: 'blur(10px)',
                                            }}
                                        >
                                            {currentSlideData.secondaryAction}
                                        </Button>
                                    </Box>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </Box>

                    {/* Visual Side */}
                    <Box
                        sx={{
                            order: { xs: 1, md: 2 },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <motion.div
                            variants={floatVariants}
                            animate="animate"
                        >
                            <Box
                                sx={{
                                    width: { xs: 280, md: 400 },
                                    height: { xs: 280, md: 400 },
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '80%',
                                        height: '80%',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }}
                                    variants={pulseVariants}
                                    animate="animate"
                                />
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: { xs: '3rem', md: '4rem' },
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        zIndex: 1,
                                    }}
                                >
                                    {currentSlideData.id}
                                </Typography>
                            </Box>
                        </motion.div>
                    </Box>
                </Box>

                {/* Slide Controls - Vertical on Right */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: { xs: 15, md: 30 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        zIndex: 3,
                    }}
                >
                    {/* Previous Button */}
                    <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevSlide}
                        disabled={isAnimating}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            width: { xs: 36, md: 44 },
                            height: { xs: 36, md: 44 },
                            '&:disabled': {
                                opacity: 0.5,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                transform: 'rotate(-90deg)',
                            }}
                        >
                            <ArrowLeftIcon />
                        </Box>
                    </IconButton>

                    {/* Slide Indicators */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 1.5,
                            py: 1,
                        }}
                    >
                        {slides.map((_, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Box
                                    onClick={() => goToSlide(index)}
                                    sx={{
                                        width: 12,
                                        height: currentSlide === index ? 32 : 12,
                                        borderRadius: 6,
                                        bgcolor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        '&::after': {
                                            content: currentSlide === index ? `"${index + 1}"` : '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: theme.palette.primary.main,
                                            display: currentSlide === index ? 'block' : 'none',
                                        },
                                    }}
                                />
                            </motion.div>
                        ))}
                    </Box>

                    {/* Next Button */}
                    <IconButton
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSlide}
                        disabled={isAnimating}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            width: { xs: 36, md: 44 },
                            height: { xs: 36, md: 44 },
                            '&:disabled': {
                                opacity: 0.5,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                transform: 'rotate(90deg)',
                            }}
                        >
                            <ArrowRightIcon />
                        </Box>
                    </IconButton>
                </Box>
            </Container>

            {/* Scroll Indicator */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 40,
                    display: 'block',
                    zIndex: 3,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <motion.div
                    style={{
                        width: 2,
                        height: 40,
                        background: 'rgba(255, 255, 255, 0.4)',
                        position: 'relative',
                    }}
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 1,
                        transform: 'rotate(90deg)',
                        transformOrigin: 'center',
                        whiteSpace: 'nowrap',
                        opacity: 0.7,
                    }}
                >
                    Scroll Down
                </Typography>
            </motion.div>
        </Box>
    );
}
