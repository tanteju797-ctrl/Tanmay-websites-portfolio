export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  year: string;
  role: string;
  type: 'Concept' | 'Selected Work' | 'Experimental Project';
  accentColor: string;
  heroImage: string;
  liveUrl?: string;
  videoType?: 'chai' | 'piyhealth' | 'codaburry' | 'chocolate' | 'nexora' | 'obsidian' | 'arc' | 'monument' | 'forma' | 'custom';
  videoUrl?: string;
  videoBadge?: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  metrics?: { label: string; value: string }[];
  palette: string[];
  overview: string;
  challenge: string;
  solution: string;
}

export interface Service {
  number: string;
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
  deliverables: string[];
  theme: 'dark' | 'ivory';
  visualType: 'design' | 'development' | 'motion' | 'uiux' | 'redesign' | 'seo';
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'Design' | 'Motion' | 'Code' | 'Strategy';
  level: string;
  x: number;
  y: number;
  description: string;
  related: string[];
}

export type CompanionCharacter = 'anime-duo' | 'tom-jerry' | 'celestial-dragon' | 'cyber-pilot';

