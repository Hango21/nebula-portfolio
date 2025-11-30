import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileText, Mail, User } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/admin/profile", icon: User },
  { name: "Projects", path: "/admin/projects", icon: FolderOpen },
  { name: "Blog", path: "/admin/blog", icon: FileText },
  { name: "Messages", path: "/admin/messages", icon: Mail },
];

export const AdminNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-card/50 border-b border-border/50 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
