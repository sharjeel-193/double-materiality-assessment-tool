'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useAuthContext } from '@/providers';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await login(email, password);
            
            if (success) {
                router.push('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {/* Heading */}
        <Typography 
            variant="h4" 
            component="h1" 
            textAlign="center" 
            sx={{ mb: 3, fontWeight: 500 }}
        >
            Sign In
        </Typography>

        {/* Error Alert */}
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}

        {/* Email Field */}
        <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            sx={{ mb: 2 }}
        />

        {/* Password Field */}
        <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            sx={{ mb: 3 }}
        />

        {/* Login Button */}
        <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || !email || !password}
            sx={{ mb: 2, py: 1.5 }}
        >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>

        {/* Forgot Password */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Forgot Password?
            </Link>
        </Box>

        {/* Don't have account */}
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
                Do not have an account?{' '}
                <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    Contact Administrator
                </Link>
            </Typography>
        </Box>
        </Box>
    );
}
