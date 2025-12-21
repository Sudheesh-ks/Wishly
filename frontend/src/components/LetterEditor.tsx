'use client';
import { useState } from 'react';
import { Paper, TextField, Box, Button, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';

const LetterEditor = () => {
    const [isSealed, setIsSealed] = useState(false);
    const [text, setText] = useState('');

    const handleSeal = () => {
        setIsSealed(true);
        // Reset after animation for demo purposes
        setTimeout(() => {
            setIsSealed(false);
            setText('');
        }, 4000);
    };

    return (
        <Box sx={{ position: 'relative', height: 500, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                minHeight: 400,
                                position: 'relative',
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 2, fontFamily: 'var(--font-mountains)', color: '#D42426', textAlign: 'center' }}>
                                Dear Santa...
                            </Typography>
                            <TextField
                                multiline
                                rows={10}
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
                                    color="error" // Red
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
                                    Seal with Wax
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
                        {/* Visual representation of an envelope */}
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
        </Box>
    );
};

export default LetterEditor;
