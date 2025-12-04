// Catalog of common skills with categories and logo URLs (Devicon CDN)
// Categories: language, framework, library, database, tool

export type SkillCategory = "language" | "framework" | "library" | "database" | "tool";

export interface CatalogSkill {
  key: string; // stable key
  name: string;
  category: SkillCategory;
  logo: string; // URL
}

export const SKILL_CATALOG: CatalogSkill[] = [
  // Languages
  { key: "javascript", name: "JavaScript", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { key: "typescript", name: "TypeScript", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { key: "python", name: "Python", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { key: "java", name: "Java", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { key: "c", name: "C", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { key: "cpp", name: "C++", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { key: "csharp", name: "C#", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { key: "go", name: "Go", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { key: "php", name: "PHP", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { key: "ruby", name: "Ruby", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
  { key: "kotlin", name: "Kotlin", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { key: "swift", name: "Swift", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { key: "dart", name: "Dart", category: "language", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },

  // Frameworks
  { key: "react", name: "React", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { key: "nextjs", name: "Next.js", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { key: "nodejs", name: "Node.js", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { key: "nestjs", name: "NestJS", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" },
  { key: "angular", name: "Angular", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { key: "vue", name: "Vue.js", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { key: "svelte", name: "Svelte", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
  { key: "express", name: "Express", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { key: "django", name: "Django", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { key: "flask", name: "Flask", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
  { key: "spring", name: "Spring", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { key: "laravel", name: "Laravel", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" },
  { key: "rails", name: "Rails", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg" },
  { key: "fastapi", name: "FastAPI", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { key: "flutter", name: "Flutter", category: "framework", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },

  // Libraries
  { key: "redux", name: "Redux", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  { key: "tailwind", name: "TailwindCSS", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { key: "graphql", name: "GraphQL", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { key: "threejs", name: "Three.js", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
  { key: "bootstrap", name: "Bootstrap", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { key: "sass", name: "Sass", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
  { key: "jquery", name: "jQuery", category: "library", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" },

  // Databases
  { key: "postgresql", name: "PostgreSQL", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { key: "mysql", name: "MySQL", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { key: "mongodb", name: "MongoDB", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { key: "sqlite", name: "SQLite", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
  { key: "redis", name: "Redis", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { key: "mariadb", name: "MariaDB", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg" },
  { key: "firebase", name: "Firebase", category: "database", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },

  // Tools
  { key: "docker", name: "Docker", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { key: "aws", name: "AWS", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
  { key: "git", name: "Git", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { key: "kubernetes", name: "Kubernetes", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { key: "terraform", name: "Terraform", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
  { key: "nginx", name: "Nginx", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
  { key: "linux", name: "Linux", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { key: "azure", name: "Azure", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { key: "gcp", name: "GCP", category: "tool", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
];

export const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "language", label: "Language" },
  { value: "framework", label: "Framework" },
  { value: "library", label: "Library" },
  { value: "database", label: "Database" },
  { value: "tool", label: "Tool" },
];

export const catalogByCategory = (category?: SkillCategory) =>
  category ? SKILL_CATALOG.filter((s) => s.category === category) : SKILL_CATALOG;
