export interface Settings {
  general: {
    company_name?: string;
    site_title?: string;
    site_tagline?: string;
    contact_email?: string;
  };
  company: {
    about_excerpt?: string;
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    address?: string;
    phone?: string;
  };
}

export const defaultSettings: Settings = {
  general: {
    company_name: 'A+ Digital',
    site_title: 'A+ Digital',
    site_tagline: 'We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.',
    contact_email: 'hello@nexoradigital.com',
  },
  company: {
    address: 'Ngamprah Kidul No. 17\nBandung Barat, 40552',
    phone: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  },
};

export async function getPublicSettings(): Promise<Settings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public/settings`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return defaultSettings;
    const data = await res.json();
    return data.data || defaultSettings;
  } catch {
    return defaultSettings;
  }
}
