export interface BannerSetting {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  aiHint: string;
  enabled: boolean;
}

export interface SocialLink {
  id: 'facebook' | 'twitter' | 'instagram' | 'whatsapp';
  label: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  id: 'main';
  banners: BannerSetting[];
  aboutUsPage: string;
  termsPage: string;
  privacyPage: string;
  tutorialVideoUrl: string;
  supportPhone: string;
  supportWhatsapp: string;
  socialLinks: SocialLink[];
}
