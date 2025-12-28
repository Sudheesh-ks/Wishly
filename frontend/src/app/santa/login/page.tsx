'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Button, Paper, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import KeyIcon from '@mui/icons-material/Key';
import Snowfall from '@/components/Snowfall';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

export default function SantaLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { santa, loading, refreshSanta } = useAuth();

    useEffect(() => {
        if (!loading && santa) {
            router.replace('/santa/dashboard');
        }
    }, [santa, loading, router]);

    const handleLogin = async () => {
        try {
            setError('');
            const response = await axios.post(`${API_BASE_URL}/auth/santa/login`, { password }, { withCredentials: true });

            if (response.data.token) {
                localStorage.setItem('wishly_santa_token', response.data.token);
                await refreshSanta();
                router.push('/santa/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid Password, Are you really Santa!');
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
            </Box>
        );
    }

    if (santa) {
        return null; 
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Snowfall />
            <Container maxWidth="sm">
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            p: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backdropFilter: 'blur(20px)',
                            background: 'rgba(212, 36, 38, 0.1)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 8,
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        }}
                    >
                        <Typography variant="h2" sx={{ mb: 4, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                            Santa Access
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 6, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                            Ho Ho Ho! Please verify your identity.
                        </Typography>

                        <TextField
                            type="password"
                            placeholder="Secret Password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                }
                            }}
                        />

                        {error && (
                            <Typography variant="caption" sx={{ color: '#D42426', mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<KeyIcon />}
                            onClick={handleLogin}
                            sx={{
                                py: 1.5,
                                bgcolor: '#D42426',
                                '&:hover': { bgcolor: '#b71c1c' },
                                fontFamily: 'var(--font-mountains)',
                                fontSize: '1.2rem'
                            }}
                        >
                            Enter Workshop
                        </Button>

                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
