import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminNav } from "@/components/admin/AdminNav";
import { addBlogPost, updateBlogPost, getBlogPosts } from "@/utils/storage";
import { uploadToCloudinary } from "@/config/cloudinary";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "Admin",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;

    const load = async () => {
      setLoading(true);
      const posts = await getBlogPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) {
        toast.error("Post not found");
        navigate("/admin/blog", { replace: true });
        return;
      }
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
      });
      setLoading(false);
    };

    load();
  }, [id, isEdit, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, coverImage: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content || !formData.coverImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateBlogPost(id, formData);
        toast.success("Post updated successfully");
      } else {
        const created = await addBlogPost(formData as any);
        if (!created) {
          toast.error("Failed to create post");
          setSaving(false);
          return;
        }
        toast.success("Post created successfully");
      }
      navigate("/admin/blog");
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <Button
          variant="ghost"
          onClick={() => navigate("/admin/blog")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Posts
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-orbitron text-3xl font-bold mb-8">
            {isEdit ? "Edit Blog Post" : "Create New Post"}
          </h1>

          <form onSubmit={handleSubmit} className="card-gradient p-8 rounded-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description (shown in post list)"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              {formData.coverImage ? (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, coverImage: "" })}
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
                      {uploading ? "Uploading..." : "Click to upload cover image"}
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <div className="bg-background rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={modules}
                  className="h-96"
                />
              </div>
            </div>

            <div className="pt-16">
              <label className="block text-sm font-medium mb-2">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
            </div>

            <Button type="submit" disabled={saving || uploading} className="w-full btn-glow-cyan">
              {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
