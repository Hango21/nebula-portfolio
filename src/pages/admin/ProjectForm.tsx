import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminNav } from "@/components/admin/AdminNav";
import { addProject, updateProject, getProjects } from "@/utils/storage";
import { uploadToCloudinary } from "@/config/cloudinary";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: [] as string[],
    githubLink: "",
    demoLink: "",
  });
  const [techInput, setTechInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const projects = getProjects();
      const project = projects.find((p) => p.id === id);
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          image: project.image,
          techStack: project.techStack,
          githubLink: project.githubLink || "",
          demoLink: project.demoLink || "",
        });
      }
    }
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        updateProject(id, formData);
        toast.success("Project updated successfully");
      } else {
        addProject(formData);
        toast.success("Project created successfully");
      }
      navigate("/admin/projects");
    } catch (error) {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <Button
          variant="ghost"
          onClick={() => navigate("/admin/projects")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-orbitron text-3xl font-bold mb-8">
            {isEdit ? "Edit Project" : "Add New Project"}
          </h1>

          <form onSubmit={handleSubmit} className="card-gradient p-8 rounded-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                  placeholder="Add technology"
                />
                <Button type="button" onClick={handleAddTech} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="pr-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub Link</label>
              <Input
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/..."
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Demo Link</label>
              <Input
                value={formData.demoLink}
                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                placeholder="https://demo.example.com"
                type="url"
              />
            </div>

            <Button type="submit" disabled={saving || uploading} className="w-full btn-glow-cyan">
              {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
