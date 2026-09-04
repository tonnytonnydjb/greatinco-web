export type CmsImage = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type CmsLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: CmsImage;
  primaryCta?: CmsLink;
  secondaryCta?: CmsLink;
};

export type MetricContent = {
  id: string;
  value: string;
  label: string;
};

export type SolutionContent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo: CmsImage;
  website?: string;
};

export type HomepageContent = {
  hero: HeroContent;
  metrics: MetricContent[];
  solutions: SolutionContent[];
  clients: ClientLogo[];
};
