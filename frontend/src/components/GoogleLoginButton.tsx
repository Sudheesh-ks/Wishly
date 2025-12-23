'use client';

import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLoginButton = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <Button
      variant="outlined"
      size="large"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      sx={{ mb: 2, py: 1.5, borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
    >
      Continue with Google
    </Button>
  );
}


export default GoogleLoginButton;