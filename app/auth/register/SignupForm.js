"use client";

import { toast } from "@/components/ui/toast";
import { Button, Form, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Turnstile from "react-turnstile";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

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
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      formData.captchaToken = captchaToken;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data || "Something went wrong. Please try again.");
      } else {
        e.target.reset();
        router.push("/auth/login");
        toast.success(
          "Registration successful. Check your email for verification.",
        );
      }
    } catch (e) {
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
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm">
            Already have an account? <Link href="/auth/login">login</Link>
          </p>
        </div>
        <Form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            name="name"
            radius="sm"
            variant="bordered"
            label="Full Name"
            labelPlacement="outside"
            placeholder="Enter your name"
            type="text"
            isRequired
          />
          <Input
            name="email"
            radius="sm"
            variant="bordered"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            type="email"
            isRequired
          />
          <Input
            name="password"
            radius="sm"
            variant="bordered"
            label="Password"
            labelPlacement="outside"
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
                  <RiEyeOffLine className="text-default-400 pointer-events-none" />
                ) : (
                  <RiEyeLine className="text-default-400 pointer-events-none" />
                )}
              </button>
            }
            isRequired
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
            Create account
          </Button>
        </Form>
      </div>
    </main>
  );
}
