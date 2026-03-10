// lib/types/navigation.ts
export interface NavItem {
    name: string;
    href: string;
    current?: boolean;
  }
  
  export interface SocialLink {
    platform: 'github' | 'linkedin' | 'twitter' | 'facebook' | 'other';
    url: string;
    label: string;
  }