import { Project, BlogPost, ContactMessage, Service } from "@/types";

const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects",
  BLOGS: "portfolio_blogs",
  MESSAGES: "portfolio_messages",
  SERVICES: "portfolio_services",
};

// Projects
export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const addProject = (project: Omit<Project, "id" | "createdAt">): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>) => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    saveProjects(projects);
  }
};

export const deleteProject = (id: string) => {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
};

// Blog Posts
export const getBlogPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BLOGS);
  return stored ? JSON.parse(stored) : [];
};

export const saveBlogPosts = (posts: BlogPost[]) => {
  localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(posts));
};

export const addBlogPost = (post: Omit<BlogPost, "id" | "date">): BlogPost => {
  const posts = getBlogPosts();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  posts.unshift(newPost);
  saveBlogPosts(posts);
  return newPost;
};

export const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    saveBlogPosts(posts);
  }
};

export const deleteBlogPost = (id: string) => {
  const posts = getBlogPosts().filter((p) => p.id !== id);
  saveBlogPosts(posts);
};

// Contact Messages
export const getMessages = (): ContactMessage[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return stored ? JSON.parse(stored) : [];
};

export const saveMessages = (messages: ContactMessage[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const addMessage = (message: Omit<ContactMessage, "id" | "date" | "read">): ContactMessage => {
  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMessage);
  saveMessages(messages);
  return newMessage;
};

export const markMessageAsRead = (id: string, read: boolean) => {
  const messages = getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    messages[index].read = read;
    saveMessages(messages);
  }
};

export const deleteMessage = (id: string) => {
  const messages = getMessages().filter((m) => m.id !== id);
  saveMessages(messages);
};

// Services
export const getServices = (): Service[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return stored ? JSON.parse(stored) : [];
};

export const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const addService = (service: Omit<Service, "id" | "createdAt">): Service => {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  services.unshift(newService);
  saveServices(services);
  return newService;
};

export const updateService = (id: string, updates: Partial<Service>) => {
  const services = getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    saveServices(services);
  }
};

export const deleteService = (id: string) => {
  const services = getServices().filter((s) => s.id !== id);
  saveServices(services);
};
