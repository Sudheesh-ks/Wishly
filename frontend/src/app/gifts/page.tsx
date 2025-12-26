'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import GiftCard from '@/components/GiftCard';
import Snowfall from '@/components/Snowfall';
import { useGift } from '@/context/GiftContext';
import { useLetter } from '@/context/LetterContext';
import { useRouter } from 'next/navigation';


export default function GiftGalleryPage() {
  const { gifts } = useGift();
  const { appendGift } = useLetter();
  const router = useRouter();


  const [page, setPage] = useState(1);
  const pageSize = 3;

  const start = (page - 1) * pageSize;
  const paginatedGifts = gifts.slice(start, start + pageSize);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Snowfall />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{ mb: 6, textAlign: 'center', color: '#F8B229', fontFamily: 'var(--font-mountains)' }}
        >
          🎄 Santa’s Full Gift Gallery
        </Typography>

        <Grid container spacing={4}>
          {paginatedGifts.map((gift) => (
            <Grid key={gift._id || gift.title} size={{ xs: 12, md: 4 }}>
              <GiftCard
                title={gift.title}
                image={gift.image}
                stock={gift.stock}
                onAdd={() => { 
                    appendGift(gift);
                    router.push('/dashboard/#letter-editor');
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 2 }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            sx={{ color: '#F8B229' }}
          >
            ← Previous
          </Button>

          <Typography sx={{ color: 'white', lineHeight: '36px' }}>
            Page {page}
          </Typography>

          <Button
            disabled={start + pageSize >= gifts.length}
            onClick={() => setPage((p) => p + 1)}
            sx={{ color: '#F8B229' }}
          >
            Next →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
