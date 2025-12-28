"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import Snowfall from "@/components/Snowfall";
import { useSoundManager } from "@/components/SoundManager";
import Link from "next/link";

export default function Home() {
  const { isPlaying, toggleMusic } = useSoundManager();

  return (
    <Box sx={{ position: "relative", overflowX: "hidden", minHeight: "100vh" }}>
      <Snowfall />

      {/* Navbar */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ pt: 2 }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              color: "#D42426",
              fontFamily: "var(--font-mountains)",
            }}
          >
            Wishly
          </Typography>

          <IconButton
            onClick={toggleMusic}
            sx={{ color: "#F8B229", mr: 2, border: "1px solid #F8B229" }}
          >
            {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
          </IconButton>

          <Button
            component={Link}
            href="/login"
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(5px)",
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Hero Section */}
        <Box
          component={motion.div}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 1.5 }}
          sx={{ textAlign: "center" }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "white",
              mb: 2,
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
              fontSize: { xs: "4rem", md: "6rem" },
            }}
          >
            Welcome to the North Pole
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#F8B229", mb: 6, fontFamily: "var(--font-inter)" }}
          >
            Where magic happens and wishes take flight.
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            color="secondary"
            sx={{
              borderRadius: 50,
              px: 8,
              py: 2,
              fontSize: "1.5rem",
              boxShadow: "0 0 20px rgba(22, 91, 51, 0.5)",
              textTransform: "none",
              fontFamily: "var(--font-mountains)",
            }}
          >
            Begin Your Letter
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
