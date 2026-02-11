export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  logo?: string;
  rating: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface HowItWorksStep {
  step: number;
  icon: string;
  title: string;
  description: string;
}

export interface BrandLogo {
  id: string;
  name: string;
  logo: string;
}
