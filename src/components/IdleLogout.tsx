import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface IdleLogoutProps {
  timeoutMs?: number;
}

export const IdleLogout = ({ timeoutMs = 5 * 60 * 1000 }: IdleLogoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(async () => {
        try {
          await logout();
          toast.info("You were logged out due to inactivity.");
          navigate("/admin/login", { replace: true });
        } catch (e) {
          // no-op
        }
      }, timeoutMs);
    };

    const windowEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Listen to visibility changes on document to pause/resume timer when tab hidden/visible
    const onVisibility = () => resetTimer();

    windowEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility, { passive: true } as any);
    resetTimer();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      windowEvents.forEach((evt) => window.removeEventListener(evt, resetTimer as any));
      document.removeEventListener("visibilitychange", onVisibility as any);
    };
  }, [logout, navigate, timeoutMs]);

  return null;
};
