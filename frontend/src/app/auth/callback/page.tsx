"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, Typography, CircularProgress } from "@mui/material";
import Snowfall from "@/components/Snowfall";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      console.log("Auth Callback: Token found in URL:", !!token);

      if (token) {
        localStorage.setItem("wishly_user_token", token);
        console.log(
          "Auth Callback: Token saved to localStorage. Refreshing user..."
        );
        try {
          await refreshUser();
          console.log(
            "Auth Callback: User refreshed. Redirecting to dashboard..."
          );
          router.replace("/dashboard");
        } catch (e) {
          console.error("Auth Callback: Error during refresh/redirect:", e);
          router.replace("/dashboard");
        }
      } else {
        console.warn("Auth Callback: No token found. Redirecting to login.");
        router.replace("/login");
      }
    };

    handleCallback();
  }, [router, searchParams, refreshUser]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Snowfall />

      <Box
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(248, 178, 41, 0.3)",
          boxShadow: "0 0 40px rgba(248, 178, 41, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          maxWidth: 400,
          width: "90%",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#F8B229" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 1,
              fontFamily: "var(--font-mountains)",
            }}
          >
            Verifying with the North Pole...
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
            Please wait while we check the Nice List.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#0f172a",
          }}
        >
          <CircularProgress sx={{ color: "#F8B229" }} />
        </Box>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
