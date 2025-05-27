'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    TextField,
    Button,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    MdSend as SendIcon,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, cardVariants } from '@/lib/animations';

export function ContactSection() {
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset form
            setFormData({ name: '', email: '', company: '', message: '' });
            setShowSuccess(true);
        } catch (error) {
            console.log(error)
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.message;

    return (
        <Box
            component="section"
            id="contact-section"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.paper',
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
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h2"
                                component="h2"
                                mb={3}
                                className='gradient-color-heading'
                            >
                                Get In Touch
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h6"
                                color='text.secondary'
                                mx={'auto'}
                                maxWidth={900}
                                lineHeight={1.6}
                                mb={2}
                            >
                                Ready to transform your sustainability reporting? 
                                Contact us to learn how MatriQ can streamline your double materiality assessment process.
                            </Typography>
                        </motion.div>
                    </Box>

                    <Grid container spacing={6} sx={{justifyContent: 'center'}}>
                        {/* Contact Form */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <motion.div variants={cardVariants}>
                                <Card
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        mb={3}
                                    >
                                        Send us a Message
                                    </Typography>

                                    <Box component="form" onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    value={formData.name}
                                                    onChange={handleInputChange('name')}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange('email')}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Company Name"
                                                    value={formData.company}
                                                    onChange={handleInputChange('company')}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Message"
                                                    multiline
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={handleInputChange('message')}
                                                    required
                                                    placeholder="Tell us about your sustainability reporting needs..."
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }}>
                                                <Button
                                                    component={motion.button}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    disabled={!isFormValid || isSubmitting}
                                                    endIcon={<SendIcon />}
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            {/* Success/Error Snackbars */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Message sent successfully! We will get back to you soon.
                </Alert>
            </Snackbar>

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowError(false)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    Failed to send message. Please try again.
                </Alert>
            </Snackbar>
        </Box>
    );
}
