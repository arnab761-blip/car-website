/**
 * =========================================================================
 * OMNIMOTORS 3D - WHITE-LABEL & SITE BRANDING CONFIGURATION
 * =========================================================================
 * 
 * When selling this platform to a dealership or automotive company,
 * update this single configuration file to instantly rebrand the website.
 * 
 * All components (Navbar, Footer, Hero, Meta tags, Contact) automatically
 * adapt to this configuration.
 */

export interface SiteConfig {
  brandName: string;
  brandTagline: string;
  shortName: string;
  subdomain: string;
  canonicalUrl: string;
  logo: {
    type: 'icon' | 'image';
    icon: 'shield' | 'zap' | 'flame' | 'crown' | 'sparkles';
    imageUrl?: string;
  };
  contact: {
    email: string;
    conciergePhone: string;
    hqAddress: string;
  };
  socials: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'OmniMotors 3D',
  shortName: 'OmniMotors',
  brandTagline: 'Global 3D Automotive Platform & Interactive Showroom',
  subdomain: 'omnimotors-3d.pages.dev',
  canonicalUrl: 'https://omnimotors-3d.pages.dev',
  logo: {
    type: 'icon',
    icon: 'shield',
    imageUrl: '',
  },
  contact: {
    email: 'contact@omnimotors3d.com',
    conciergePhone: '+1 (800) 555-OMNI',
    hqAddress: 'DIFC Gate Village 04, Global Virtual Hub',
  },
  socials: {
    github: 'https://github.com/arnab761-blip/car-website',
  },
  meta: {
    title: 'OmniMotors 3D | Global 3D Automotive Platform & Interactive Showroom',
    description:
      'Experience hyper-realistic 3D car customizer, physics simulation, real engine audio, and virtual showroom.',
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
  },
};
