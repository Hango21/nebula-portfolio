export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  cvUrl?: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "With over 5 years of experience in web development, I specialize in creating elegant, efficient, and scalable solutions. My passion lies in transforming complex problems into simple, beautiful, and intuitive designs.",
  profileImage: "https://i.pinimg.com/736x/0d/7a/c0/0d7ac03da06b6b967b4008d5b7682fd3.jpg",
  email: "contact@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
};
