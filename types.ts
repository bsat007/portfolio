export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Project {
  title: string;
  client: string;
  description: string;
  tech: string[];
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  period: string;
}

export interface Social {
  platform: string;
  url: string;
  label: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  socials: Social[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: {
    category: string;
    items: string[];
  }[];
}