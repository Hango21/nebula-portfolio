import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/AdminNav";
import { getMessages, markMessageAsRead, deleteMessage } from "@/utils/storage";
import { ContactMessage } from "@/types";
import { toast } from "sonner";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    await markMessageAsRead(id, !currentStatus);
    await loadMessages();
    toast.success(currentStatus ? "Marked as unread" : "Marked as read");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(id);
      await loadMessages();
      toast.success("Message deleted");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <AdminNav />

        <h1 className="font-orbitron text-3xl font-bold mb-8">Messages</h1>

        {loading ? (
          <div className="text-center py-20 card-gradient rounded-lg">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 card-gradient rounded-lg">
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card-gradient p-6 rounded-lg ${
                  !message.read ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {message.read ? (
                        <MailOpen className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary" />
                      )}
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      {!message.read && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{message.email}</p>
                    <p className="text-foreground/90 mb-3">{message.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(message.date)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRead(message.id, message.read)}
                    >
                      {message.read ? "Mark Unread" : "Mark Read"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                      className="text-destructive hover:text-destructive"
                    >
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
