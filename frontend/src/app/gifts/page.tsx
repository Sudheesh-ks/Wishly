"use client";

import { useState } from "react";
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import GiftCard from "@/components/GiftCard";
import Snowfall from "@/components/Snowfall";
import { useGift } from "@/context/GiftContext";
import { useLetter } from "@/context/LetterContext";
import { useRouter } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function GiftGalleryPage() {
  const { gifts } = useGift();
  const { appendGift } = useLetter();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const start = (page - 1) * pageSize;
  const paginatedGifts = gifts.slice(start, start + pageSize);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Snowfall />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ position: "sticky", top: 20, zIndex: 10, mb: 3 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => router.push("/dashboard")}
            sx={{
              color: "#F8B229",
              border: "1px solid rgba(248,178,41,0.5)",
              borderRadius: "999px",
              px: 3,
              py: 1,
              fontWeight: 600,
              backdropFilter: "blur(6px)",
              background: "rgba(0,0,0,0.35)",
              transition: "0.3s",
              "&:hover": {
                background: "rgba(248,178,41,0.15)",
                boxShadow: "0 0 12px rgba(248,178,41,0.4)",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Typography
          variant="h3"
          sx={{
            mb: 6,
            textAlign: "center",
            color: "#F8B229",
            fontFamily: "var(--font-mountains)",
          }}
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
                  router.push("/dashboard/#letter-editor");
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6, gap: 2 }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            sx={{ color: "#F8B229" }}
          >
            ← Previous
          </Button>

          <Typography sx={{ color: "white", lineHeight: "36px" }}>
            Page {page}
          </Typography>

          <Button
            disabled={start + pageSize >= gifts.length}
            onClick={() => setPage((p) => p + 1)}
            sx={{ color: "#F8B229" }}
          >
            Next →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
