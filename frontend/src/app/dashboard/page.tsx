'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Snowfall from '@/components/Snowfall';
import GiftCard from '@/components/GiftCard';
import LetterEditor from '@/components/LetterEditor';
import { useSoundManager } from '@/components/SoundManager';
import { useGift } from '@/context/GiftContext';
import { useLetter } from '@/context/LetterContext';
import { useAuth } from '@/context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DashboardPage() {
  const { isPlaying, toggleMusic } = useSoundManager();
  const { gifts } = useGift();
  const { appendGift } = useLetter();
  const { user, loading, logoutUser } = useAuth();
  const router = useRouter();

  const [successToast, setSuccessToast] = useState(false);
  const [warningToast, setWarningToast] = useState(false);
  const [formErrorToast, setFormErrorToast] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null); // New generic error state
  const [sending, setSending] = useState(false);

  const handleError = (message: string) => {
    setGeneralError(message);
  };



  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleAddToLetter = (gift: any) => {
    appendGift(gift);
    // setSuccessToast(true);
    // Scroll to editor
    const editor = document.getElementById('letter-editor');
    if (editor) editor.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
      <Snowfall />

      {/* Dashboard Navbar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2 }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
            Wishly
          </Typography>

          <IconButton onClick={toggleMusic} sx={{ color: '#F8B229', mr: 2, border: '1px solid #F8B229' }}>
            {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
          </IconButton>

          <IconButton onClick={logoutUser} sx={{ color: 'white' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, color: 'white', fontFamily: 'var(--font-mountains)' }}>
          Welcome, {user?.name || user?.email?.split('@')[0] || 'Guest'}!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 8, color: 'rgba(255,255,255,0.7)' }}>
          Start adding gifts to your letter or write a custom wish.
        </Typography>

        {/* Gift Gallery */}
        <Typography variant="h4" sx={{ mb: 4, color: '#F8B229' }}>
          Santa's Gift Gallery
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 12 }}>
          {gifts.slice(0, 6).map((gift) => (
            <Grid key={gift._id || gift.title} size={{ xs: 12, md: 4 }}>
              <GiftCard
                title={gift.title}
                image={gift.image}
                stock={gift.stock}
                onAdd={() => handleAddToLetter(gift)}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link href="/gifts" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#F8B229',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderBottom: '2px solid transparent',
                '&:hover': { borderBottom: '2px solid #F8B229' }
              }}
            >
              🎁 Explore more Santa’s gifts →
            </Button>
          </Link>
        </Box>


        {/* Letter Editor Section */}
        <Box id="letter-editor" sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
            Your Letter
          </Typography>
          <LetterEditor
            setSending={setSending}
            onSendSuccess={() => {
              setSending(false);
              setSuccessToast(true);
            }}
            onSendEmpty={() => {
              setSending(false);
              setWarningToast(true);
            }}
            onFormError={() => {
              setSending(false);
              setFormErrorToast(true);
            }}
            onError={handleError}
          />
        </Box>
      </Container>


      {/* Success Toast */}
      <Snackbar
        open={successToast}
        autoHideDuration={3000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessToast(false)}
          severity="success"
          sx={{
            bgcolor: '#165B33',
            color: '#F8F3E6',
            border: '1px solid #F8B229',
            boxShadow: '0 0 20px rgba(248,178,41,0.5)',
            fontWeight: 'bold',
            fontFamily: 'var(--font-inter)',
          }}
          icon={false}
        >
          🎅 Letter sent to Santa successfully!
        </Alert>
      </Snackbar>

      {/* Warning Toast */}
      <Snackbar
        open={warningToast}
        autoHideDuration={3000}
        onClose={() => setWarningToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setWarningToast(false)}
          severity="warning"
          sx={{
            bgcolor: '#D42426',
            color: '#fff',
            border: '1px solid #F8B229',
            boxShadow: '0 0 20px rgba(212,36,38,0.6)',
            fontWeight: 'bold',
            fontFamily: 'var(--font-inter)',
          }}
          icon={false}
        >
          🎁 Please add at least one gift before sending your letter!
        </Alert>
      </Snackbar>


      {/* Form Error Toast */}
      <Snackbar
        open={formErrorToast}
        autoHideDuration={3000}
        onClose={() => setFormErrorToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setFormErrorToast(false)}
          severity="error"
          sx={{
            bgcolor: '#B71C1C',
            color: '#fff',
            border: '1px solid #F8B229',
            boxShadow: '0 0 20px rgba(183,28,28,0.6)',
            fontWeight: 'bold',
            fontFamily: 'var(--font-inter)',
          }}
          icon={false}
        >
          ✍️ Please fill your name, location and wish!
        </Alert>
      </Snackbar>

      {/* General Error Toast */}
      <Snackbar
        open={!!generalError}
        autoHideDuration={4000}
        onClose={() => setGeneralError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setGeneralError(null)}
          severity="error"
          sx={{
            bgcolor: '#B71C1C',
            color: '#fff',
            border: '1px solid #F8B229',
            boxShadow: '0 0 20px rgba(183,28,28,0.6)',
            fontWeight: 'bold',
            fontFamily: 'var(--font-inter)',
          }}
          icon={false}
        >
          {generalError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
