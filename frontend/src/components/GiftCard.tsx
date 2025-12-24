'use client';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface GiftCardProps {
    title: string;
    image: string;
    stock?: number;
    onAdd: () => void;
}

const MotionCard = motion(Card);

const GiftCard = ({ title, image, stock = 0, onAdd }: GiftCardProps) => {
    const isOutOfStock = stock <= 0;

    return (
        <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={isOutOfStock ? {} : { scale: 1.05, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
                width: 280,
                height: 380, // Slightly taller to fit stock info
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                filter: isOutOfStock ? 'grayscale(0.8)' : 'none',
                opacity: isOutOfStock ? 0.8 : 1
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={image}
                alt={title}
                sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
            />

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 180,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    borderRadius: '16px 16px 0 0'
                }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold', border: '5px solid white', p: 1, rotate: '-15deg', fontSize: '1.5rem' }}>
                        OUT OF STOCK
                    </Typography>
                </Box>
            )}

            {/* Sparkles on Hover */}
            {!isOutOfStock && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    sx={{ position: 'absolute', top: -10, right: -10, zIndex: 10 }}
                >
                    <AutoAwesomeIcon sx={{ color: '#F8B229', fontSize: 40 }} />
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1, textAlign: 'center', color: 'text.primary', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        A magical gift for someone special.
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mb: 1.5,
                            color: isOutOfStock ? '#D42426' : '#165B33',
                            fontWeight: 'bold',
                            bgcolor: isOutOfStock ? 'rgba(212, 36, 38, 0.1)' : 'rgba(22, 91, 51, 0.1)',
                            py: 0.5,
                            borderRadius: 1
                        }}
                    >
                        {isOutOfStock ? 'Unavailable at the Workshop' : `Only ${stock} left in stock!`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={isOutOfStock ? null : <StarIcon />}
                        onClick={onAdd}
                        disabled={isOutOfStock}
                        fullWidth
                        sx={{
                            background: isOutOfStock
                                ? '#ccc'
                                : 'linear-gradient(45deg, #D42426 30%, #FF8E53 90%)',
                            boxShadow: isOutOfStock ? 'none' : '0 3px 5px 2px rgba(255, 105, 135, .3)',
                            fontWeight: 'bold'
                        }}
                    >
                        {isOutOfStock ? 'Unavailable' : 'Add to Letter'}
                    </Button>
                </Box>
            </CardContent>
        </MotionCard>
    );
};

export default GiftCard;
