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
  const [captchaToken, setCaptchaToken] = useState("");

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
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">Reset Password</h2>
          <p className="text-sm">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, one number, and one special
            character.
          </p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            isRequired
            name="password"
            variant="bordered"
            size="lg"
            radius="sm"
            label="Password"
            placeholder="Enter your new password"
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
            size="lg"
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
        <div className="mb-4 text-center text-sm">
          Remember your password? <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </main>
  );
}
