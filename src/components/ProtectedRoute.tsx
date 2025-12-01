import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { IdleLogout } from "./IdleLogout";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <IdleLogout timeoutMs={5 * 60 * 1000} />
      {children}
    </>
  );
};
