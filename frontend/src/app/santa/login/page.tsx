'use client';

import { Container, Box, Typography, Button, Paper, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import KeyIcon from '@mui/icons-material/Key';
import Link from 'next/link';
import Snowfall from '@/components/Snowfall';

export default function SantaLoginPage() {
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
                            background: 'rgba(212, 36, 38, 0.1)', // Red tint for Santa
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
                            sx={{
                                mb: 4,
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<KeyIcon />}
                            component={Link}
                            href="/santa/dashboard"
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
