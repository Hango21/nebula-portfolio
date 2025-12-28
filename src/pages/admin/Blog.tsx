import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/AdminNav";
import { getBlogPosts, deleteBlogPost } from "@/utils/storage";
import { BlogPost } from "@/types";
import { toast } from "sonner";

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteBlogPost(id);
      await loadPosts();
      toast.success("Post deleted successfully");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-orbitron text-3xl font-bold">Manage Blog Posts</h1>
          <Link to="/admin/blog/new">
            <Button className="btn-glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 card-gradient rounded-lg">
            <p className="text-muted-foreground mb-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 card-gradient rounded-lg">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <Link to="/admin/blog/new">
              <Button>Create your first post</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient p-6 rounded-lg flex gap-6 hover-lift"
              >
                <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-orbitron text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-muted-foreground mb-4">
                    {formatDate(post.date)} • By {post.author}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/blog/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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
