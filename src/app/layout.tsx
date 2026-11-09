import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CarProvider } from '@/context/CarContext';
import { GarageProvider } from '@/context/GarageContext';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/context/LanguageContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OmniMotors 3D | Global 3D Automotive Platform & Interactive Showroom',
  description:
    'Discover and customize your dream vehicle. Global next-generation 3D car showroom with real-time custom paint formulation, technical aerodynamic telemetry, curated marketplace, and VIP test drive booking.',
  keywords: [
    'Car Dealership',
    'OmniMotors',
    'OmniMotors 3D',
    'Hypercar',
    'Luxury Cars',
    '3D Car Customizer',
    'Electric GT',
    'Supercar Showroom',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-white relative">
        {/* ================= GLOBAL FIXED RACING CIRCUIT BACKGROUND WITH GLASSMORPHISM ================= */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          {/* High-res Night Racing Circuit Asphalt with Glowing Curbs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/racing-road.jpg"
            alt="Cinematic Racing Track"
            className="w-full h-full object-cover object-center scale-102 transform transition-transform duration-1000"
          />

          {/* Cinematic Dark Vignette & Frost Glassmorphism Blur Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />

          {/* Radial Light Glow spotlighting the car stage in center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,210,255,0.08)_0%,transparent_70%)]" />

          {/* Subtle Speed Atmosphere Ambient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(217,119,6,0.04)_0%,transparent_50%)]" />
        </div>

        <LanguageProvider>
          <CarProvider>
            <GarageProvider>
              <ToastProvider>
                <div className="relative z-10 flex-1 flex flex-col">
                  {children}
                </div>
              </ToastProvider>
            </GarageProvider>
          </CarProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
