// app/auth/verify/VerifyForm.js

"use client";

import { toast } from "@/components/ui/toast";
import { Button, Form, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Turnstile from "react-turnstile";

export default function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

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
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    formData.captchaToken = captchaToken;
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(
          data?.error ||
            "An error occurred while verification. Please try again.",
        );
      } else {
        router.push("/auth/login");
        toast.success(
          "Email verification successful. Try to sign in with your credentials.",
        );
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full min-h-[80dvh] items-center justify-center">
      <div className="bg-default-50 w-full max-w-md rounded-md px-3 py-6">
        <div className="pb-6 text-center">
          <h2 className="text-3xl font-bold">Verify yourself</h2>
          <p className="text-sm">
            Are your account verified? Try to{" "}
            <Link href="/auth/login">login</Link>
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            name="token"
            radius="sm"
            variant="bordered"
            label="Token"
            labelPlacement="outside"
            placeholder="Enter your token"
            type="text"
            defaultValue={token}
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
            Verify
          </Button>
        </Form>
      </div>
    </main>
  );
}
