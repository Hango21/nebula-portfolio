export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end?: string;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start: string;
  end?: string;
  description?: string;
}

export interface Stat {
  id: string;
  number: string;
  label: string;
}

// Availability status: available (open to work / ready to freelance) or unavailable
export type Availability = "available" | "unavailable";

export type SkillCategory = "language" | "framework" | "library" | "database" | "tool";

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 - 100
  category?: SkillCategory;
  logo?: string; // URL
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  bioHome?: string;
  bioAbout?: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  cvUrl?: string;
  experience?: Experience[];
  education?: Education[];
  stats?: Stat[];
  skills?: Skill[];
  availability?: Availability;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "With over 5 years of experience in web development, I specialize in creating elegant, efficient, and scalable solutions. My passion lies in transforming complex problems into simple, beautiful, and intuitive designs.",
  bioHome: "With over 5 years of experience in web development, I specialize in creating elegant, efficient, and scalable solutions.",
  bioAbout: "With over 5 years of experience in web development, I specialize in creating elegant, efficient, and scalable solutions. My passion lies in transforming complex problems into simple, beautiful, and intuitive designs.",
  profileImage: "https://i.pinimg.com/736x/0d/7a/c0/0d7ac03da06b6b967b4008d5b7682fd3.jpg",
  email: "contact@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  experience: [],
  education: [],
  stats: [
    { id: "stat-projects", number: "50+", label: "Projects Completed" },
    { id: "stat-years", number: "5+", label: "Years Experience" },
    { id: "stat-satisfaction", number: "100%", label: "Client Satisfaction" },
  ],
  skills: [
    {
      id: "skill-react",
      name: "React",
      level: 95,
      category: "framework",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      id: "skill-typescript",
      name: "TypeScript",
      level: 90,
      category: "language",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      id: "skill-node",
      name: "Node.js",
      level: 88,
      category: "framework",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      id: "skill-python",
      name: "Python",
      level: 85,
      category: "language",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      id: "skill-aws",
      name: "AWS",
      level: 82,
      category: "tool",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    },
    {
      id: "skill-docker",
      name: "Docker",
      level: 80,
      category: "tool",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
  ],
  availability: "available",
};
