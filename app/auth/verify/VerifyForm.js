// app/auth/verify/VerifyForm.js

"use client";

import { Button, Form, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Turnstile from "react-turnstile";
import { toast } from "@/components/ui/toast";

export default function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

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
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">Verify yourself</h2>
          <p className="text-sm">
            Verify your account by entering the token sent to your email.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isClearable
            name="token"
            size="lg"
            radius="sm"
            variant="bordered"
            label="Token"
            placeholder="Enter your token"
            type="text"
            defaultValue={token}
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
            Verify
          </Button>
        </Form>
        <div className="mb-4 text-center text-sm">
          Are your account verified? Try to{" "}
          <Link href="/auth/login">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
