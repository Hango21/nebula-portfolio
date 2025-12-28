import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, FolderOpen, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProjects, getBlogPosts, getMessages } from "@/utils/storage";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const projects = await getProjects();
      const posts = await getBlogPosts();
      const messages = await getMessages();

      setStats({
        projects: projects.length,
        posts: posts.length,
        messages: messages.length,
        unreadMessages: messages.filter((m) => !m.read).length,
      });

      setRecentMessages(messages.slice(0, 3));
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      color: "primary",
      link: "/admin/projects",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: FileText,
      color: "secondary",
      link: "/admin/blog",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      color: "accent",
      link: "/admin/messages",
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-orbitron text-4xl font-bold text-glow-cyan mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
          </motion.div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(stat.link)}
              className="card-gradient p-6 rounded-lg hover-lift cursor-pointer group relative"
            >
              {stat.badge && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                  {stat.badge}
                </div>
              )}
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`text-${stat.color}`} size={24} />
              </div>
              <div className="text-4xl font-orbitron font-bold mb-1">{stat.value}</div>
              <div className="text-muted-foreground">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gradient p-6 rounded-lg"
          >
            <h2 className="font-orbitron text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/admin/blog/new")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Create New Blog Post
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/admin/projects/new")}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Add New Project
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/admin/messages")}
              >
                <Mail className="w-4 h-4 mr-2" />
                View Messages
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gradient p-6 rounded-lg"
          >
            <h2 className="font-orbitron text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{message.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{message.message}</div>
                  </div>
                </div>
              ))}
              {recentMessages.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No messages yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
