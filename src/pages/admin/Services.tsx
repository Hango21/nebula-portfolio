import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/AdminNav";
import { getServices, deleteService, saveServices } from "@/utils/storage";
import type { Service } from "@/types";
import { toast } from "sonner";

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => setServices(getServices());

  const handleDelete = (id: string) => {
    if (confirm("Delete this service?")) {
      deleteService(id);
      load();
      toast.success("Service deleted");
    }
  };

  // Drag & Drop
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("index"));
    if (Number.isNaN(dragIndex)) return;
    const next = [...services];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setServices(next);
    saveServices(next);
    toast.success("Order saved");
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-orbitron text-3xl font-bold">Manage Services</h1>
          <Link to="/admin/services/new">
            <Button className="btn-glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 card-gradient rounded-lg">
            <p className="text-muted-foreground mb-4">No services yet</p>
            <Link to="/admin/services/new">
              <Button>Create your first service</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className="card-gradient p-6 rounded-lg border border-border/50"
                  draggable
                  onDragStart={(e) => onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, i)}
                  onDragOver={(e) => onDragOver(e as unknown as React.DragEvent<HTMLDivElement>)}
                  onDrop={(e) => onDrop(e as unknown as React.DragEvent<HTMLDivElement>, i)}
                >
                  <div className="flex items-center gap-2 text-foreground/60 mb-2">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs">Drag to reorder</span>
                  </div>
                  <div className="text-primary font-orbitron text-xl mb-2">{s.title}</div>
                  <p className="text-muted-foreground line-clamp-3 mb-4">{s.description}</p>
                  <div className="flex gap-2">
                    <Link to={`/admin/services/edit/${s.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
