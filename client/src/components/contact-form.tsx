import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const timestampRef = useRef<number>(Date.now());

  const handleFirstInteraction = () => {
    timestampRef.current = Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _timestamp: timestampRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium text-slate-900">Message sent.</p>
        <p className="text-slate-500 mt-1">We will get back to you within one business day.</p>
        <button
          className="mt-4 text-sm text-violet-600 underline"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFirstInteraction}
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          data-testid="input-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          data-testid="input-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={5}
          required
        />
      </div>

      {status === "error" && (
        <p
          data-testid="contact-error"
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        data-testid="button-submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
