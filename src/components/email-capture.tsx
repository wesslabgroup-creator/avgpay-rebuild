"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface EmailCaptureProps {
  type: "salary-alerts" | "negotiation-tips";
  buttonText: string;
  placeholder?: string;
  source?: string;
}

export function EmailCapture({ type, buttonText, placeholder = "Enter your email", source = "unknown" }: EmailCaptureProps) {
  const posthog = usePostHog();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();

      if (response.ok) {
        posthog?.capture("email_capture_submitted", {
          capture_type: type,
          source,
        });
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-3">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full"
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        >
          {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === "success" && <CheckCircle2 className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 text-sm ${status === "success" ? "text-emerald-600" : "text-red-600"
          }`}>
          {status === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
