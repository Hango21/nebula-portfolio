import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { getBlogPosts } from "@/utils/storage";
import { BlogPost } from "@/types";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            Blog
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on web development, technology, and innovation
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              No blog posts yet. Check back soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.id}`}>
                  <div className="card-gradient rounded-lg overflow-hidden hover-lift group h-full flex flex-col">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          5 min read
                        </div>
                      </div>
                      <h3 className="font-orbitron text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 text-primary font-semibold group-hover:translate-x-2 transition-transform inline-block">
                        Read More →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
