'use client';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface GiftCardProps {
    title: string;
    image: string;
    onAdd: () => void;
}

const MotionCard = motion(Card);

const GiftCard = ({ title, image, onAdd }: GiftCardProps) => {
    return (
        <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
                width: 280,
                height: 350,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={image}
                alt={title}
                sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
            />

            {/* Sparkles on Hover */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                sx={{ position: 'absolute', top: -10, right: -10, zIndex: 10 }}
            >
                <AutoAwesomeIcon sx={{ color: '#F8B229', fontSize: 40 }} />
            </Box>

            <CardContent sx={{ flexGrow: 1, textAlign: 'center', color: 'text.primary' }}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    A magical gift for someone special.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<StarIcon />}
                    onClick={onAdd}
                    sx={{
                        background: 'linear-gradient(45deg, #D42426 30%, #FF8E53 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    }}
                >
                    Add to Letter
                </Button>
            </CardContent>
        </MotionCard>
    );
};

export default GiftCard;
