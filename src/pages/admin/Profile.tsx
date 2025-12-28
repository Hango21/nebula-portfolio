import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminNav } from "@/components/admin/AdminNav";
import { getProfile, saveProfile } from "@/utils/profile";
import { uploadToCloudinary } from "@/config/cloudinary";
import { toast } from "sonner";
import { ProfileData, Experience, Education, SkillCategory, Availability } from "@/types/profile";
import { CATEGORIES, catalogByCategory, SKILL_CATALOG } from "@/data/skillLogos";

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prevExperience, setPrevExperience] = useState<Experience[] | null>(null);
  const [prevEducation, setPrevEducation] = useState<Education[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const p = await getProfile();
      setProfile(p);
    };
    load();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProfile({ ...profile, profileImage: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // ----- Drag & Drop for Skills (kept separate to avoid changing existing types) -----
  const onDragStartSkill = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", String(index));
    e.dataTransfer.setData("section", "skills");
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropSkill = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("index"));
    const dragSection = e.dataTransfer.getData("section");
    if (dragSection !== "skills" || Number.isNaN(dragIndex)) return;

    const list = [...(profile.skills || [])];
    const [moved] = list.splice(dragIndex, 1);
    list.splice(dropIndex, 0, moved);
    setProfile({ ...profile, skills: list });
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // For PDF/CV files, we'll use the same Cloudinary upload
      // Note: Cloudinary supports PDFs with raw upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "portfolio_preset");
      formData.append("resource_type", "raw");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddym2iudt/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload CV");

      const data = await response.json();
      setProfile({ ...profile, cvUrl: data.secure_url });
      toast.success("CV uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simple validation rules
    const monthYear = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/;
    const yearOnly = /^\d{4}$/;
    const isValidDate = (v?: string) => !v || v === "Present" || monthYear.test(v) || yearOnly.test(v);

    // Experience validation
    for (const exp of profile.experience || []) {
      if (!exp.role?.trim() || !exp.company?.trim() || !exp.start?.trim()) {
        toast.error("Experience entries require Role, Company, and Start date.");
        setSaving(false);
        return;
      }
      if (!isValidDate(exp.start) || !isValidDate(exp.end)) {
        toast.error("Use YYYY or Mon YYYY for dates (e.g., 2021 or Jan 2021). End can be 'Present'.");
        setSaving(false);
        return;
      }
    }

    // Education validation
    for (const edu of profile.education || []) {
      if (!edu.degree?.trim() || !edu.institution?.trim() || !edu.start?.trim()) {
        toast.error("Education entries require Degree, Institution, and Start date.");
        setSaving(false);
        return;
      }
      if (!isValidDate(edu.start) || !isValidDate(edu.end)) {
        toast.error("Use YYYY or Mon YYYY for dates (e.g., 2017 or Sep 2019). End can be 'Present'.");
        setSaving(false);
        return;
      }
    }

    // No additional validation for availability selector

    if (!profile) {
      toast.error("Profile not loaded yet");
      setSaving(false);
      return;
    }

    try {
      await saveProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ----- Drag & Drop Reordering -----
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, section: "experience" | "education") => {
    e.dataTransfer.setData("index", String(index));
    e.dataTransfer.setData("section", section);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number, section: "experience" | "education") => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("index"));
    const dragSection = e.dataTransfer.getData("section");
    if (dragSection !== section || Number.isNaN(dragIndex)) return;

    if (section === "experience") {
      const list = [...(profile.experience || [])];
      const [moved] = list.splice(dragIndex, 1);
      list.splice(dropIndex, 0, moved);
      setProfile({ ...profile, experience: list });
    } else {
      const list = [...(profile.education || [])];
      const [moved] = list.splice(dragIndex, 1);
      list.splice(dropIndex, 0, moved);
      setProfile({ ...profile, education: list });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-orbitron text-3xl font-bold mb-8">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image */}
            <div className="card-gradient p-6 rounded-lg">
              <h2 className="font-orbitron text-xl font-bold mb-4">Profile Image</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-48 h-48 rounded-lg overflow-hidden border-gradient flex-shrink-0">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

            

            
                <div className="flex-1">
                  {profile.profileImage ? (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProfile({ ...profile, profileImage: "" })}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : null}
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                      disabled={uploading}
                    />
                    <label htmlFor="profile-image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        asChild
                      >
                        <span className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Upload New Image"}
                        </span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-xl font-bold">Quick Stats</h2>
                <div className="flex items-center gap-2">
                  {(profile.stats || []).length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Remove all stats?")) {
                          setProfile({ ...profile, stats: [] });
                        }
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        stats: [
                          ...(profile.stats || []),
                          { id: Date.now().toString(), number: "", label: "" },
                        ],
                      })
                    }
                  >
                    Add Stat
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {(profile.stats || []).map((st, idx) => (
                  <div key={st.id} className="p-4 rounded-lg bg-card/40 border border-border/50">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Number</label>
                        <Input
                          value={st.number}
                          onChange={(e) => {
                            const next = [...(profile.stats || [])];
                            next[idx] = { ...next[idx], number: e.target.value };
                            setProfile({ ...profile, stats: next });
                          }}
                          placeholder="e.g., 50+"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Label</label>
                        <Input
                          value={st.label}
                          onChange={(e) => {
                            const next = [...(profile.stats || [])];
                            next[idx] = { ...next[idx], label: e.target.value };
                            setProfile({ ...profile, stats: next });
                          }}
                          placeholder="e.g., Projects Completed"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = (profile.stats || []).filter((x) => x.id !== st.id);
                          setProfile({ ...profile, stats: next });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <h2 className="font-orbitron text-xl font-bold mb-4">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Title</label>
                <Input
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Home Intro (shows on Home)</label>
                <Textarea
                  value={profile.bioHome ?? ""}
                  onChange={(e) => setProfile({ ...profile, bioHome: e.target.value })}
                  placeholder="Short intro shown on the home hero"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">About Bio (shows on About page)</label>
                <Textarea
                  value={profile.bioAbout ?? profile.bio}
                  onChange={(e) => setProfile({ ...profile, bioAbout: e.target.value })}
                  placeholder="Detailed bio for the About page"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio / About (legacy)</label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="General bio kept for backwards compatibility"
                  rows={5}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <h2 className="font-orbitron text-xl font-bold mb-4">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <h2 className="font-orbitron text-xl font-bold mb-4">Social Links</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <Input
                  type="url"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <Input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <Input
                  type="url"
                  value={profile.twitter}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-xl font-bold">Experience</h2>
                <div className="flex items-center gap-2">
                  {(profile.experience || []).length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Remove all experience entries?")) {
                          setPrevExperience([...(profile.experience || [])]);
                          setProfile({ ...profile, experience: [] });
                          toast.message("Cleared experience", { description: "Click Undo to restore." });
                        }
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                  {prevExperience && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProfile({ ...profile, experience: prevExperience });
                        setPrevExperience(null);
                        toast.success("Experience restored");
                      }}
                    >
                      Undo Clear
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        experience: [
                          ...(profile.experience || []),
                          {
                            id: Date.now().toString(),
                            role: "",
                            company: "",
                            start: "",
                            end: "",
                            description: "",
                          },
                        ],
                      })
                    }
                  >
                    Add Experience
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {(profile.experience || []).map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg bg-card/40 border border-border/50 space-y-3"
                    draggable
                    onDragStart={(e) => onDragStart(e, idx, "experience")}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, idx, "experience")}
                  >
                    <div className="flex items-center gap-2 text-foreground/60">
                      <GripVertical className="h-4 w-4" />
                      <span className="text-xs">Drag to reorder</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <Input
                          value={exp.role}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[idx] = { ...next[idx], role: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Senior Full Stack Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[idx] = { ...next[idx], company: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Tech Corp"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start</label>
                        <Input
                          value={exp.start}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[idx] = { ...next[idx], start: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Jan 2021"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End</label>
                        <Input
                          value={exp.end || ""}
                          onChange={(e) => {
                            const next = [...(profile.experience || [])];
                            next[idx] = { ...next[idx], end: e.target.value };
                            setProfile({ ...profile, experience: next });
                          }}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={exp.description || ""}
                        onChange={(e) => {
                          const next = [...(profile.experience || [])];
                          next[idx] = { ...next[idx], description: e.target.value };
                          setProfile({ ...profile, experience: next });
                        }}
                        placeholder="Key responsibilities, tech used, achievements..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = (profile.experience || []).filter((x) => x.id !== exp.id);
                          setProfile({ ...profile, experience: next });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <h2 className="font-orbitron text-xl font-bold mb-2">Availability</h2>
              <p className="text-sm text-muted-foreground">Set your current availability status.</p>
              <div className="max-w-sm">
                <Select
                  value={profile.availability || "available"}
                  onValueChange={(val) => setProfile({ ...profile, availability: val as Availability })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available (Open to work / Ready to freelance)</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Education */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-xl font-bold">Education</h2>
                <div className="flex items-center gap-2">
                  {(profile.education || []).length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Remove all education entries?")) {
                          setPrevEducation([...(profile.education || [])]);
                          setProfile({ ...profile, education: [] });
                          toast.message("Cleared education", { description: "Click Undo to restore." });
                        }
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                  {prevEducation && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProfile({ ...profile, education: prevEducation });
                        setPrevEducation(null);
                        toast.success("Education restored");
                      }}
                    >
                      Undo Clear
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        education: [
                          ...(profile.education || []),
                          {
                            id: Date.now().toString(),
                            degree: "",
                            institution: "",
                            start: "",
                            end: "",
                            description: "",
                          },
                        ],
                      })
                    }
                  >
                    Add Education
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {(profile.education || []).map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg bg-card/40 border border-border/50 space-y-3"
                    draggable
                    onDragStart={(e) => onDragStart(e, idx, "education")}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, idx, "education")}
                  >
                    <div className="flex items-center gap-2 text-foreground/60">
                      <GripVertical className="h-4 w-4" />
                      <span className="text-xs">Drag to reorder</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const next = [...(profile.education || [])];
                            next[idx] = { ...next[idx], degree: e.target.value };
                            setProfile({ ...profile, education: next });
                          }}
                          placeholder="B.Sc. Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const next = [...(profile.education || [])];
                            next[idx] = { ...next[idx], institution: e.target.value };
                            setProfile({ ...profile, education: next });
                          }}
                          placeholder="University Name"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start</label>
                        <Input
                          value={edu.start}
                          onChange={(e) => {
                            const next = [...(profile.education || [])];
                            next[idx] = { ...next[idx], start: e.target.value };
                            setProfile({ ...profile, education: next });
                          }}
                          placeholder="2017"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End</label>
                        <Input
                          value={edu.end || ""}
                          onChange={(e) => {
                            const next = [...(profile.education || [])];
                            next[idx] = { ...next[idx], end: e.target.value };
                            setProfile({ ...profile, education: next });
                          }}
                          placeholder="2021"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={edu.description || ""}
                        onChange={(e) => {
                          const next = [...(profile.education || [])];
                          next[idx] = { ...next[idx], description: e.target.value };
                          setProfile({ ...profile, education: next });
                        }}
                        placeholder="Honors, activities, notable courses..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = (profile.education || []).filter((x) => x.id !== edu.id);
                          setProfile({ ...profile, education: next });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="card-gradient p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-xl font-bold">Technical Skills</h2>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        skills: [
                          ...(profile.skills || []),
                          { id: Date.now().toString(), name: "", level: 0 },
                        ],
                      })
                    }
                  >
                    Add Skill
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {(profile.skills || []).map((sk, idx) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-lg bg-card/40 border border-border/50 space-y-3"
                    draggable
                    onDragStart={(e) => onDragStartSkill(e, idx)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDropSkill(e, idx)}
                  >
                    <div className="flex items-center gap-2 text-foreground/60">
                      <GripVertical className="h-4 w-4" />
                      <span className="text-xs">Drag to reorder</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input
                          value={sk.name}
                          onChange={(e) => {
                            const next = [...(profile.skills || [])];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setProfile({ ...profile, skills: next });
                          }}
                          placeholder="e.g., React"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Level (0-100)</label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={Number.isFinite((sk as any).level) ? sk.level : 0}
                          onChange={(e) => {
                            const v = Math.max(0, Math.min(100, Number(e.target.value)));
                            const next = [...(profile.skills || [])];
                            next[idx] = { ...next[idx], level: v };
                            setProfile({ ...profile, skills: next });
                          }}
                          placeholder="90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select
                          value={(sk.category as SkillCategory) || ""}
                          onValueChange={(val) => {
                            const next = [...(profile.skills || [])];
                            // Reset logo if category changes to avoid mismatch
                            next[idx] = { ...next[idx], category: val as SkillCategory, logo: undefined };
                            setProfile({ ...profile, skills: next });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 items-end">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium mb-2">Logo</label>
                        <Select
                          value={sk.logo || ""}
                          onValueChange={(val) => {
                            const next = [...(profile.skills || [])];
                            next[idx] = { ...next[idx], logo: val };
                            // Optionally set name if empty to the catalog name
                            const found = SKILL_CATALOG.find((s) => s.logo === val);
                            if (found && !next[idx].name) next[idx].name = found.name;
                            setProfile({ ...profile, skills: next });
                          }}
                          disabled={!sk.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={sk.category ? "Select logo" : "Select category first"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-72 overflow-auto">
                            {catalogByCategory(sk.category as SkillCategory).map((opt) => (
                              <SelectItem key={opt.key} value={opt.logo}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        {sk.logo ? (
                          <img src={sk.logo} alt={sk.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted/40 border border-border/50" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          id={`skill-logo-${sk.id}`}
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            try {
                              const url = await uploadToCloudinary(file);
                              const next = [...(profile.skills || [])];
                              next[idx] = { ...next[idx], logo: url };
                              setProfile({ ...profile, skills: next });
                              toast.success("Icon uploaded");
                            } catch (error) {
                              toast.error("Failed to upload icon");
                            } finally {
                              setUploading(false);
                              // reset input so same file can be chosen again
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        <label htmlFor={`skill-logo-${sk.id}`}>
                          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                            <span className="cursor-pointer">{uploading ? "Uploading..." : "Upload Custom Icon"}</span>
                          </Button>
                        </label>
                      </div>
                      {sk.logo && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const next = [...(profile.skills || [])];
                            next[idx] = { ...next[idx], logo: undefined };
                            setProfile({ ...profile, skills: next });
                          }}
                        >
                          Clear Icon
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const next = (profile.skills || []).filter((x) => x.id !== sk.id);
                          setProfile({ ...profile, skills: next });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Upload */}
            <div className="card-gradient p-6 rounded-lg">
              <h2 className="font-orbitron text-xl font-bold mb-4">Resume / CV</h2>
              {profile.cvUrl && (
                <div className="mb-4 p-3 bg-muted/30 rounded flex items-center justify-between">
                  <span className="text-sm">CV uploaded</span>
                  <div className="flex gap-2">
                    <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                      <Button type="button" variant="outline" size="sm">
                        View
                      </Button>
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setProfile({ ...profile, cvUrl: undefined })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
                id="cv-upload"
                disabled={uploading}
              />
              <label htmlFor="cv-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload CV (PDF)"}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Upload your resume/CV (PDF format recommended)
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving || uploading}
              className="w-full btn-glow-cyan"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
