import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProfile } from "@/utils/profile";
import { ProfileData } from "@/types/profile";

const skills = [
  { name: "React", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 88 },
  { name: "Python", level: 85 },
  { name: "AWS", level: 82 },
  { name: "Docker", level: 80 },
];

const experience = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Company Inc.",
    period: "2021 - Present",
    description: "Leading development of cloud-native applications using React and AWS"
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    period: "2019 - 2021",
    description: "Built scalable web applications with modern JavaScript frameworks"
  },
];

const education = [
  {
    degree: "Master of Computer Science",
    school: "University of Technology",
    period: "2017 - 2019"
  },
  {
    degree: "Bachelor of Software Engineering",
    school: "Institute of Technology",
    period: "2013 - 2017"
  },
];

export default function About() {
  const [profile, setProfile] = useState<ProfileData>(getProfile());

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-glow-cyan mb-4">
            About Me
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto"></div>
        </motion.div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="aspect-square rounded-lg overflow-hidden border-gradient">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-orbitron text-3xl font-bold mb-4">
              Hi, I'm {profile.name}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {profile.bio}
            </p>
            {profile.cvUrl && (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                <Button className="btn-glow-cyan w-fit">
                  <Download className="mr-2 w-4 h-4" />
                  Download CV
                </Button>
              </a>
            )}
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-orbitron text-3xl font-bold text-center mb-12">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient p-6 rounded-lg"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-orbitron text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Briefcase className="text-primary" />
            Experience
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card-gradient p-6 rounded-lg border-l-4 border-primary"
              >
                <h3 className="font-orbitron text-xl font-bold mb-1">{exp.title}</h3>
                <div className="text-primary mb-2">{exp.company}</div>
                <div className="text-sm text-muted-foreground mb-3">{exp.period}</div>
                <p className="text-muted-foreground">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-orbitron text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <GraduationCap className="text-secondary" />
            Education
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card-gradient p-6 rounded-lg hover-lift"
              >
                <h3 className="font-orbitron text-xl font-bold mb-2">{edu.degree}</h3>
                <div className="text-secondary mb-1">{edu.school}</div>
                <div className="text-sm text-muted-foreground">{edu.period}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
