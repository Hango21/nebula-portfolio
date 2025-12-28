import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "@/utils/profile";
import { ProfileData } from "@/types/profile";
import { Logo } from "./Logo";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      setProfile(p);
    };
    load();
  }, []);

  return (
    <footer className="bg-card/50 border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />

          {profile && (
            <div className="flex items-center gap-6">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          )}

          <div className="text-muted-foreground text-sm">
            © {currentYear} All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
