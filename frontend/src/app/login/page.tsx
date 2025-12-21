'use client';

import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import Snowfall from '@/components/Snowfall';

export default function LoginPage() {
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
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 8,
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        }}
                    >
                        <Typography variant="h2" sx={{ mb: 4, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                            Sign In
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 6, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                            To send your letter to Santa, please identify yourself.
                        </Typography>

                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            component={Link}
                            href="/dashboard"
                            sx={{ mb: 2, py: 1.5, borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                        >
                            Continue with Google
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<PersonIcon />}
                            component={Link}
                            href="/dashboard"
                            sx={{
                                py: 1.5,
                                bgcolor: '#165B33',
                                '&:hover': { bgcolor: '#124a2a' }
                            }}
                        >
                            Continue as Guest
                        </Button>

                        <Box sx={{ mt: 4 }}>
                            <Link href="/santa/login" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.8rem' }}>
                                Are you Santa?
                            </Link>
                        </Box>

                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
