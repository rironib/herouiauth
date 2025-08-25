"use client";

import { Button, Input, Link } from "@heroui/react";
import Turnstile from "react-turnstile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export default function ForgotForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

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
          data?.error ||
            "An error occurred while resetting your password. Please try again.",
        );
      } else {
        router.push("/auth/login");
        toast.success("Check your email for reset link");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">Forgot Password</h2>
          <p className="text-sm">
            You will receive an email with a link to reset your password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            isClearable
            name="email"
            variant="bordered"
            size="lg"
            radius="sm"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
            size="flexible"
            theme="auto"
            appearance="always"
            className="w-full"
          />
          <Button
            isLoading={loading}
            radius="sm"
            color="primary"
            variant="flat"
            size="lg"
            type="submit"
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
        <div className="mb-4 text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
