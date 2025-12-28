import { Project, BlogPost, ContactMessage, Service } from "@/types";
import { supabase } from "@/lib/supabaseClient";

// Projects - now backed by Supabase
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, image, tech_stack, github_link, demo_link, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects from Supabase:", error);
      return [];
    }

    return (data ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      techStack: p.tech_stack ?? [],
      githubLink: p.github_link ?? undefined,
      demoLink: p.demo_link ?? undefined,
      createdAt: p.created_at,
    }));
  } catch (err) {
    console.error("Unexpected error fetching projects:", err);
    return [];
  }
};

export const addProject = async (
  project: Omit<Project, "id" | "createdAt">
): Promise<Project | null> => {
  try {
    const payload = {
      title: project.title,
      description: project.description,
      image: project.image,
      tech_stack: project.techStack,
      github_link: project.githubLink ?? null,
      demo_link: project.demoLink ?? null,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id, title, description, image, tech_stack, github_link, demo_link, created_at")
      .single();

    if (error) {
      console.error("Error adding project to Supabase:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      techStack: data.tech_stack ?? [],
      githubLink: data.github_link ?? undefined,
      demoLink: data.demo_link ?? undefined,
      createdAt: data.created_at,
    } as Project;
  } catch (err) {
    console.error("Unexpected error adding project:", err);
    return null;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  try {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.techStack !== undefined) payload.tech_stack = updates.techStack;
    if (updates.githubLink !== undefined) payload.github_link = updates.githubLink ?? null;
    if (updates.demoLink !== undefined) payload.demo_link = updates.demoLink ?? null;

    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) {
      console.error("Error updating project in Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error updating project:", err);
  }
};

export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting project from Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error deleting project:", err);
  }
};

// Blog Posts - now backed by Supabase
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt, content, cover_image, author, date")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts from Supabase:", error);
      return [];
    }

    return (data ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.cover_image,
      author: p.author,
      date: p.date,
    }));
  } catch (err) {
    console.error("Unexpected error fetching blog posts:", err);
    return [];
  }
};

export const addBlogPost = async (
  post: Omit<BlogPost, "id" | "date">
): Promise<BlogPost | null> => {
  try {
    const now = new Date().toISOString();
    const payload = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      author: post.author,
      date: now,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select("id, title, excerpt, content, cover_image, author, date")
      .single();

    if (error) {
      console.error("Error adding blog post to Supabase:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.cover_image,
      author: data.author,
      date: data.date,
    } as BlogPost;
  } catch (err) {
    console.error("Unexpected error adding blog post:", err);
    return null;
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  try {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
    if (updates.content !== undefined) payload.content = updates.content;
    if (updates.coverImage !== undefined) payload.cover_image = updates.coverImage;
    if (updates.author !== undefined) payload.author = updates.author;

    const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
    if (error) {
      console.error("Error updating blog post in Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error updating blog post:", err);
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting blog post from Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error deleting blog post:", err);
  }
};

// Contact Messages - now backed by Supabase
export const getMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, name, email, message, date, read")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching messages from Supabase:", error);
      return [];
    }

    return (data ?? []).map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message,
      date: m.date,
      read: m.read ?? false,
    }));
  } catch (err) {
    console.error("Unexpected error fetching messages:", err);
    return [];
  }
};

export const addMessage = async (
  message: Omit<ContactMessage, "id" | "date" | "read">
): Promise<ContactMessage | null> => {
  try {
    const now = new Date().toISOString();
    const payload = {
      name: message.name,
      email: message.email,
      message: message.message,
      date: now,
      read: false,
    };

    const { data, error } = await supabase
      .from("messages")
      .insert(payload)
      .select("id, name, email, message, date, read")
      .single();

    if (error) {
      console.error("Error adding message to Supabase:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      message: data.message,
      date: data.date,
      read: data.read ?? false,
    } as ContactMessage;
  } catch (err) {
    console.error("Unexpected error adding message:", err);
    return null;
  }
};

export const markMessageAsRead = async (id: string, read: boolean) => {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read })
      .eq("id", id);
    if (error) {
      console.error("Error updating message read status in Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error updating message read status:", err);
  }
};

export const deleteMessage = async (id: string) => {
  try {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message from Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error deleting message:", err);
  }
};

// Services - now backed by Supabase
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("id, title, description, icon, featured, created_at, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching services from Supabase:", error);
      return [];
    }

    return (data ?? []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
      createdAt: s.created_at,
      featured: s.featured ?? false,
    }));
  } catch (err) {
    console.error("Unexpected error fetching services:", err);
    return [];
  }
};

export const addService = async (
  service: Omit<Service, "id" | "createdAt">
): Promise<Service | null> => {
  try {
    const payload = {
      title: service.title,
      description: service.description,
      icon: service.icon,
      featured: service.featured ?? false,
    };

    const { data, error } = await supabase
      .from("services")
      .insert(payload)
      .select("id, title, description, icon, featured, created_at, sort_order")
      .single();

    if (error) {
      console.error("Error adding service to Supabase:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      createdAt: data.created_at,
      featured: data.featured ?? false,
    } as Service;
  } catch (err) {
    console.error("Unexpected error adding service:", err);
    return null;
  }
};

export const updateService = async (id: string, updates: Partial<Service>) => {
  try {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.icon !== undefined) payload.icon = updates.icon;
    if (updates.featured !== undefined) payload.featured = updates.featured;

    const { error } = await supabase.from("services").update(payload).eq("id", id);
    if (error) {
      console.error("Error updating service in Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error updating service:", err);
  }
};

export const deleteService = async (id: string) => {
  try {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Error deleting service from Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error deleting service:", err);
  }
};

export const reorderServices = async (ordered: Service[]) => {
  try {
    const updates = ordered.map((s, index) => ({ id: s.id, sort_order: index }));
    const { error } = await supabase.from("services").upsert(updates, { onConflict: "id" });
    if (error) {
      console.error("Error reordering services in Supabase:", error);
    }
  } catch (err) {
    console.error("Unexpected error reordering services:", err);
  }
};

export const seedServicesIfEmpty = async () => {
  try {
    const { count, error } = await supabase
      .from("services")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Error checking services count in Supabase:", error);
      return;
    }

    if (count && count > 0) return;

    const now = new Date().toISOString();
    const defaults = [
      { title: "Web App Development", description: "Modern, responsive web apps with React and TypeScript.", icon: "Code2", featured: true },
      { title: "Cloud & DevOps", description: "CI/CD, deployments, and cloud architecture on Vercel/AWS.", icon: "Cloud", featured: true },
      { title: "Performance Optimization", description: "Core Web Vitals, Lighthouse, and runtime performance.", icon: "Gauge", featured: true },
      { title: "Security & Auth", description: "Auth flows and secure data handling with best practices.", icon: "Shield", featured: false },
      { title: "Maintenance & Support", description: "Bug fixes, upgrades, and long‑term care for your app.", icon: "Wrench", featured: false },
      { title: "UI/UX Polish", description: "Shadcn UI + Tailwind with smooth animations and a11y.", icon: "Sparkles", featured: false },
    ].map((s, index) => ({
      ...s,
      created_at: now,
      sort_order: index,
    }));

    const { error: insertError } = await supabase.from("services").insert(defaults);
    if (insertError) {
      console.error("Error seeding default services in Supabase:", insertError);
    }
  } catch (err) {
    console.error("Unexpected error seeding services:", err);
  }
};
