import type { Metadata } from 'next';
import { Inter, Mountains_of_Christmas } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { SoundProvider } from '@/components/SoundManager';
import { GiftProvider } from '@/context/GiftContext';
import { LetterProvider } from '@/context/LetterContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mountainsOfChristmas = Mountains_of_Christmas({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mountains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wishly - A Winter Wonderland',
  description: 'Experience the magic of Christmas with Wishly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mountainsOfChristmas.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GiftProvider>
              <LetterProvider>
                <SoundProvider>
                  {children}
                </SoundProvider>
              </LetterProvider>
            </GiftProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
