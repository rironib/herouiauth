"use client";

import { Button, Form, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Turnstile from "react-turnstile";
import { toast } from "@/components/ui/toast";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    formData.captchaToken = captchaToken;
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data?.error ||
            "An error occurred while registration. Please try again.",
        );
      } else {
        router.push("/auth/login");
        toast.success(
          "Registration successful. Check your email for verification",
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">Welcome back</h2>
          <p className="text-sm">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, one number, and one special
            character.
          </p>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isClearable
            name="name"
            size="lg"
            radius="sm"
            variant="bordered"
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            required
          />
          <Input
            isClearable
            name="username"
            size="lg"
            radius="sm"
            variant="bordered"
            label="Username"
            placeholder="Enter your username"
            type="text"
            required
          />
          <Input
            isClearable
            name="email"
            size="lg"
            radius="sm"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
          />
          <Input
            name="password"
            size="lg"
            radius="sm"
            variant="bordered"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <RiEyeOffLine className="text-default-400 pointer-events-none text-2xl" />
                ) : (
                  <RiEyeLine className="text-default-400 pointer-events-none text-2xl" />
                )}
              </button>
            }
            required
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
            Create account
          </Button>
        </Form>
        <div className="mb-4 text-center text-sm">
          Already have an account? <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </main>
  );
}
