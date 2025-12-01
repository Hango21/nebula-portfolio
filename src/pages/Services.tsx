import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { getServices } from "@/utils/storage";
import type { Service } from "@/types";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const renderIcon = (iconName: string) => {
    const IconCmp = (Icons as any)[iconName] as React.ComponentType<any> | undefined;
    if (IconCmp) return <IconCmp className="w-6 h-6 text-primary" />;
    return <Icons.Sparkles className="w-6 h-6 text-secondary" />;
  };
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-glow-cyan mb-4">
            Services
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            I build elegant, efficient, and scalable solutions—from MVPs to production-grade platforms.
          </p>
        </motion.div>

        {services.length === 0 ? (
          <div className="text-center text-muted-foreground">No services yet. Add some in the admin panel.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-gradient p-6 rounded-lg hover-lift border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center mb-3">
                  {renderIcon(s.icon)}
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-2 text-primary">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
