// src/app/auth/login/LoginForm.js

"use client";

import { toast } from "@/components/ui/toast";
import { Button, Checkbox, Divider, Form, Input, Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiFacebookFill,
  RiGithubLine,
  RiGoogleLine,
} from "react-icons/ri";
import Turnstile from "react-turnstile";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Turnstile
  const [captchaToken, setCaptchaToken] = useState("");
  const [key, setKey] = useState(0);
  const resetCaptcha = () => {
    setCaptchaToken("");
    setKey((k) => k + 1);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    switch (authError) {
      case "CredentialsSignin":
        toast.error("Invalid email or password.");
        break;
      case "OAuthAccountNotLinked":
        toast.error(
          "This email is already registered using another method. Please login using email and password.",
        );
        break;
      case "OAuthSignin":
        toast.error("Google sign-in failed. Please try again.");
        break;
      case "OAuthCallback":
        toast.error("OAuth callback failed. Try again.");
        break;
      case "OAuthCreateAccount":
        toast.error("Could not create account. Please try again.");
        break;
      case "EmailSignin":
        toast.error("Sign-in link could not be sent. Please try again.");
        break;
      case "Verification":
        toast.error("Invalid or expired verification link.");
        break;
      case "AccessDenied":
        toast.error("Access denied. Contact support");
        break;
      case "Configuration":
        toast.error("Server misconfiguration. Contact admin");
        break;
      case "Default":
      default:
        if (authError)
          toast.error("An unexpected error occurred. Please try again.");
        break;
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await signIn("credentials", {
        redirect: false,
        ...data,
        captchaToken,
      });
      if (!res.ok) {
        switch (res.error) {
          case "CredentialsSignin":
            toast.error("Invalid email or password.");
            break;
          case "EmailNotVerified":
            toast.error("Please verify your email before logging in.");
            break;
          case "UserNotFound":
            toast.error("No account found with this email");
            break;
          case "ServerError":
            toast.error("Internal server error. Please try again later.");
            break;
          default:
            toast.error(res.error || "Something went wrong. Please try again.");
            break;
        }
      }
      router.push("/dashboard");
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full min-h-[80dvh] items-center justify-center">
      <div className="bg-default-50 w-full max-w-md rounded-md px-3 py-6">
        <div className="pb-6 text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-sm">
            Do not have an account? <Link href="/auth/register">Sign up</Link>
          </p>
        </div>
        <Form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            isRequired
            name="email"
            variant="bordered"
            radius="sm"
            label="Email or Username"
            labelPlacement="outside"
            placeholder="Enter your username or email"
          />
          <Input
            isRequired
            name="password"
            variant="bordered"
            radius="sm"
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
          <div className="flex w-full items-center justify-between">
            <Checkbox name="remember" defaultSelected>
              Remember me
            </Checkbox>
            <Link className="text-primary-500" href="/auth/forgot">
              Forgot password?
            </Link>
          </div>
          <Button
            isLoading={loading}
            radius="sm"
            color="primary"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </Form>
        <div className="my-4 grid grid-cols-5 items-center">
          <Divider className="col-span-2" />
          <div className="text-center">OR</div>
          <Divider className="col-span-2" />
        </div>
        <div className="flex justify-center gap-4">
          <Button
            isIconOnly
            color="primary"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <RiGoogleLine size="20" />
          </Button>
          <Button
            isDisabled
            isIconOnly
            color="success"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <RiFacebookFill size="20" />
          </Button>
          <Button
            isDisabled
            isIconOnly
            color="default"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <RiGithubLine size="20" />
          </Button>
        </div>
      </div>
    </main>
  );
}
