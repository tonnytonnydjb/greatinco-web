export type SiteLocale = "id" | "en";

export type CmsImage = {
  src: string;
  alt: string;
};

export type CmsLink = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: CmsLink;
  secondaryCta?: CmsLink;
};

export type MetricContent = {
  label: string;
  value: string;
};

export type ClientLogo = {
  name: string;
  image: CmsImage;
};

export type SolutionContent = {
  id: number;
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type HomepageSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type CertificationContent = {
  id: number;
  name: string;
  description: string;
  image: CmsImage;
  website?: string;
};

export type ActivityContent = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  activityDate: string;
  href: string;
  image: CmsImage;
  gallery: CmsImage[];
};

export type NavigationItem = {
  id: number;
  label: string;
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
  children: NavigationItem[];
};

export type SiteSettingsContent = {
  siteName: string;
  legalName: string;
  footerDescription: string;
  logoLight?: CmsImage;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  officeAddress?: string;
  officeMapsUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
};

export type SiteChromeContent = {
  headerNavigation: NavigationItem[];
  footerNavigation: NavigationItem[];
  settings: SiteSettingsContent;
};

export type HomepageContent = {
  hero: HeroContent;

  clients: ClientLogo[];

  capabilities: HomepageSectionContent;

  solutionsSection: HomepageSectionContent;
  solutions: SolutionContent[];

  governance: HomepageSectionContent;
  certifications: CertificationContent[];

  activitiesSection: HomepageSectionContent;
  activities: ActivityContent[];

  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };

  metrics: MetricContent[];
};
