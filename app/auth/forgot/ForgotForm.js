"use client";

import { toast } from "@/components/ui/toast";
import { Button, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Turnstile from "react-turnstile";

export default function ForgotForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Turnstile
  const [captchaToken, setCaptchaToken] = useState("");
  const [key, setKey] = useState(0);
  const resetCaptcha = () => {
    setCaptchaToken("");
    setKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data ||
            "An error occurred while resetting your password. Please try again.",
        );
      } else {
        router.push("/auth/login");
        toast.success("Check your email for reset link");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full min-h-[80dvh] items-center justify-center">
      <div className="w-full max-w-md rounded-md px-3 py-6">
        <div className="pb-6 text-center">
          <h2 className="text-3xl font-bold">Forgot Password</h2>
          Remember your password? <Link href="/auth/login">login</Link>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            isRequired
            isClearable
            name="email"
            variant="bordered"
            radius="sm"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="w-full">
            <div className="pb-2 text-sm">Let us know you're human</div>
            <Turnstile
              key={key}
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setCaptchaToken}
              onExpire={resetCaptcha}
              onError={resetCaptcha}
              size="flexible"
              theme="auto"
              appearance="always"
              className="w-full"
            />
          </div>
          <Button
            isLoading={loading}
            radius="sm"
            color="primary"
            type="submit"
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </main>
  );
}
