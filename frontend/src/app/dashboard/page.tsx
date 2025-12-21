'use client';

import { Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import Snowfall from '@/components/Snowfall';
import GiftCard from '@/components/GiftCard';
import LetterEditor from '@/components/LetterEditor';
import { useSoundManager } from '@/components/SoundManager';
import { useGift } from '@/context/GiftContext';

export default function DashboardPage() {
    const { isPlaying, toggleMusic } = useSoundManager();
    const { gifts } = useGift();

    const handleAddToLetter = (giftName: string) => {
        alert(`Added ${giftName} to your letter!`);
    };

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
            <Snowfall />

            {/* Dashboard Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2 }}>
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                        My Workshop
                    </Typography>

                    <IconButton onClick={toggleMusic} sx={{ color: '#F8B229', mr: 2, border: '1px solid #F8B229' }}>
                        {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
                    </IconButton>

                    <IconButton component={Link} href="/" sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, color: 'white', fontFamily: 'var(--font-mountains)' }}>
                    Welcome, Guest!
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', mb: 8, color: 'rgba(255,255,255,0.7)' }}>
                    Start adding gifts to your letter or write a custom wish.
                </Typography>

                {/* Gift Gallery */}
                <Typography variant="h4" sx={{ mb: 4, color: '#F8B229' }}>
                    Gift Ideas
                </Typography>
                <Grid container spacing={4} justifyContent="center" sx={{ mb: 12 }}>
                    {gifts.map((gift) => (
                        <Grid key={gift.id} size={{ xs: 12, md: 4 }}>
                            <GiftCard
                                title={gift.title}
                                image={gift.image}
                                onAdd={() => handleAddToLetter(gift.title)}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Letter Editor Section */}
                <Box id="letter-editor" sx={{ mb: 8 }}>
                    <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
                        Your Letter
                    </Typography>
                    <LetterEditor />
                </Box>
            </Container>
        </Box>
    );
}
