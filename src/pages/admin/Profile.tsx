import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminNav } from "@/components/admin/AdminNav";
import { getProfile, saveProfile } from "@/utils/profile";
import { uploadToCloudinary } from "@/config/cloudinary";
import { toast } from "sonner";
import { ProfileData } from "@/types/profile";

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData>(getProfile());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
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

    try {
      saveProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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
                <label className="block text-sm font-medium mb-2">Bio / About</label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell visitors about yourself..."
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
