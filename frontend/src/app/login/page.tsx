'use client';

import { Container, Box, Typography, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import Link from 'next/link';
import Snowfall from '@/components/Snowfall';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useSoundManager } from '@/components/SoundManager';

export default function LoginPage() {

    const { isPlaying, toggleMusic } = useSoundManager();

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
            <Snowfall />

            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2 }}>
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                        Wishly
                    </Typography>

                    <IconButton onClick={toggleMusic} sx={{ color: '#F8B229', mr: 2, border: '1px solid #F8B229' }}>
                        {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

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

                        <GoogleLoginButton />

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
