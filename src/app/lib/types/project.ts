// lib/types/project.ts
export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    imageUrl: string;
    technologies: Technology[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    date: Date;
  }
  
  export interface Technology {
    name: string;
    icon?: string;
    color?: string;
  }
  
  export interface ProjectCardProps {
    project: Project;
    priority?: boolean;
  }