export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name key
  createdAt: string;
}
