"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Link, Spinner } from "@heroui/react";
import { toast } from "@/components/ui/toast";

export default function VerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInvalidToken(true);
          toast.error(data.error);
        } else {
          toast.success("Email verification successful.");
          router.push("/auth/login");
        }
      })
      .catch(() => {
        setInvalidToken(true);
        toast.error("Verification failed. Try again later.");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold">User Verification</h2>
          <p className="text-sm">
            Please wait while we verify your account. This may take a few
            seconds. Try to login <Link href="/auth/login">Login</Link>
          </p>
        </div>
        <div className="flex min-h-48 items-center justify-center">
          {loading ? (
            <div className="text-center">
              <Spinner size="lg" />
            </div>
          ) : notFound ? (
            <div className="mx-auto my-3 w-full max-w-xl">
              <Alert
                variant="faded"
                color="warning"
                description="Token not found. Please check your verification link or request a new one."
              />
            </div>
          ) : invalidToken ? (
            <div className="mx-auto my-3 w-full max-w-xl">
              <Alert
                variant="faded"
                color="danger"
                description="Invalid or expired token. Please request a new verification email."
              />
            </div>
          ) : (
            <div className="mx-auto my-3 w-full max-w-xl">
              <Alert
                variant="faded"
                color="success"
                description="Vefication successful. You can now login with your account."
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
