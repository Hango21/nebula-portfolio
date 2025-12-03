import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminNav } from "@/components/admin/AdminNav";
import { addService, getServices, updateService } from "@/utils/storage";
import type { Service } from "@/types";
import { toast } from "sonner";

const ICON_OPTIONS = [
  "Code2",
  "Cloud",
  "Gauge",
  "Shield",
  "Wrench",
  "Sparkles",
  "Layers",
  "Cpu",
  "Server",
];

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const services = useMemo(() => getServices(), []);

  const editing = Boolean(id);
  const existing = editing ? services.find((s) => s.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [icon, setIcon] = useState(existing?.icon || ICON_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState<boolean>(existing?.featured ?? false);

  useEffect(() => {
    if (editing && !existing) {
      toast.error("Service not found");
      navigate("/admin/services", { replace: true });
    }
  }, [editing, existing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill title and description");
      return;
    }
    setSaving(true);
    try {
      if (editing && id) {
        updateService(id, { title, description, icon, featured });
        toast.success("Service updated");
      } else {
        const payload: Omit<Service, "id" | "createdAt"> = { title, description, icon, featured } as any;
        addService(payload);
        toast.success("Service created");
      }
      navigate("/admin/services");
    } catch (e) {
      toast.error("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
          <h1 className="font-orbitron text-3xl font-bold mb-8">
            {editing ? "Edit Service" : "New Service"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 card-gradient p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Web App Development" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What does this service include?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map((opt) => {
                  const IconCmp = (Icons as any)[opt] as React.ComponentType<any>;
                  const active = icon === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setIcon(opt)}
                      className={`flex items-center justify-center rounded-md border px-2 py-2 transition-colors ${
                        active ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                      title={opt}
                    >
                      {IconCmp ? <IconCmp className={active ? "text-primary" : "text-foreground/60"} /> : opt}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click to pick an icon. Current: {icon}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Preview:</span>
                {(() => {
                  const Preview = (Icons as any)[icon] as React.ComponentType<any>;
                  return Preview ? <Preview className="w-6 h-6 text-primary" /> : null;
                })()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <label htmlFor="featured" className="text-sm">Featured (show on Home)</label>
            </div>

            <Button type="submit" disabled={saving} className="w-full btn-glow-cyan" size="lg">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Service"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
