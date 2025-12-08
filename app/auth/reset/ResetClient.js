"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Turnstile from "react-turnstile";
import { toast } from "@/components/ui/toast";

export default function ResetClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Turnstile
  const [captchaToken, setCaptchaToken] = useState("");
  const [key, setKey] = useState(0);
  const resetCaptcha = () => {
    setCaptchaToken("");
    setKey((k) => k + 1);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data?.error ||
            "An error occurred while resetting your password. Please try again.",
        );
      } else {
        router.push("/auth/login");
        toast.success("Your password has been reset successfully.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full min-h-[80dvh] items-center justify-center">
      <div className="w-full max-w-md space-y-3">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">Reset Password</h2>
          <p className="text-sm">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, one number, and one special
            character.
          </p>
        </div>
        <form onSubmit={handleReset} className="space-y-2">
          <Input
            isRequired
            name="password"
            variant="bordered"
            radius="sm"
            label="New Password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                aria-label="Toggle password visibility"
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
              >
                {isVisible ? (
                  <RiEyeOffLine className="text-default-400 pointer-events-none text-2xl" />
                ) : (
                  <RiEyeLine className="text-default-400 pointer-events-none text-2xl" />
                )}
              </button>
            }
          />
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
          <Button
            isLoading={loading}
            radius="sm"
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
        <div className="text-center text-sm">
          Remember your password? <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </main>
  );
}
