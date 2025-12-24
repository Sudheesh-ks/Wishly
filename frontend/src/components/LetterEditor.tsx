'use client';
import { useState } from 'react';
import { Paper, TextField, Box, Button, Typography, Alert, Snackbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import { createLetter } from '@/services/letterService';
import { useLetter } from '@/context/LetterContext';

const LetterEditor = () => {
    const { draftText: text, setDraftText: setText, selectedGift, setSelectedGift } = useLetter();
    const [isSealed, setIsSealed] = useState(false);
    const [childName, setChildName] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSeal = async () => {
        if (!childName || !location || !text) {
            setError('Please fill in your name, location and your wish!');
            return;
        }

        try {
            await createLetter({
                childName,
                location,
                wishList: text,
                content: text,
                giftId: selectedGift?._id || undefined
            });

            setIsSealed(true);
            setSuccess(true);

            // Reset after animation
            setTimeout(() => {
                setIsSealed(false);
                setText('');
                setChildName('');
                setLocation('');
                setSelectedGift(null);
                setSuccess(false);
            }, 6000);
        } catch (err) {
            console.error(err);
            setError('Santa is busy! Please try sending your letter again later.');
        }
    };

    return (
        <Box sx={{ position: 'relative', minHeight: 600, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <AnimatePresence>
                {!isSealed ? (
                    <Box
                        component={motion.div}
                        key="letter"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                        transition={{ duration: 0.5 }}
                        sx={{ width: '100%', maxWidth: 600, zIndex: 2 }}
                    >
                        <Paper
                            elevation={10}
                            sx={{
                                p: 4,
                                background: 'linear-gradient(to bottom right, #f9f1e0, #e8d7b3)',
                                color: '#4e342e',
                                fontFamily: 'var(--font-inter)',
                                minHeight: 450,
                                position: 'relative',
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 2, fontFamily: 'var(--font-mountains)', color: '#D42426', textAlign: 'center' }}>
                                Dear Santa...
                            </Typography>

                            {/* Gift Preview Attachment */}
                            {selectedGift && (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 3,
                                    p: 1,
                                    bgcolor: 'rgba(212, 36, 38, 0.05)',
                                    borderRadius: 2,
                                    border: '1px dashed #D42426',
                                    width: 'fit-content',
                                    mx: 'auto'
                                }}>
                                    <Box
                                        component="img"
                                        src={selectedGift.image}
                                        sx={{ width: 80, height: 80, borderRadius: 1.5, objectFit: 'cover', boxShadow: 3 }}
                                    />
                                </Box>
                            )}

                            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                <TextField
                                    label="My Name"
                                    variant="standard"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    placeholder="Your Name"
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        sx: {
                                            color: '#000',
                                        },
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: '#5d4037',
                                        },
                                    }}
                                />
                                <TextField
                                    label="Where I live"
                                    variant="standard"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Your Location"
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        sx: {
                                            color: '#000',
                                        },
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: '#5d4037',
                                        },
                                    }}
                                />
                            </Box>

                            <TextField
                                multiline
                                rows={8}
                                fullWidth
                                variant="standard"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="I have been very good this year..."
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        fontFamily: 'cursive',
                                        fontSize: '1.2rem',
                                        lineHeight: 1.6,
                                        color: '#5d4037',
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleSeal}
                                    endIcon={<SendIcon />}
                                    sx={{
                                        borderRadius: 50,
                                        boxShadow: '0 4px 15px rgba(212, 36, 38, 0.4)',
                                        fontFamily: 'var(--font-mountains)',
                                        fontSize: '1.2rem',
                                        px: 4,
                                    }}
                                >
                                    Seal & Send to North Pole
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                ) : (
                    <Box
                        component={motion.div}
                        key="envelope"
                        initial={{ opacity: 0, scale: 0.5, y: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1, 1, 0.2],
                            y: [0, 0, -500, -800],
                            x: [0, 0, 100, 300]
                        }}
                        transition={{ duration: 2.5, times: [0, 0.2, 0.6, 1] }}
                        sx={{ position: 'absolute', zIndex: 5 }}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                width: 300,
                                height: 180,
                                background: '#eceff1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                border: '2px solid #cfd8dc'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: '#D42426',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                    border: '2px solid #b71c1c'
                                }}
                            />
                        </Paper>
                    </Box>
                )}
            </AnimatePresence>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={success && !isSealed} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Your letter has been sent to Santa! 🎅
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LetterEditor;
