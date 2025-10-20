// src/app/auth/login/LoginForm.js

"use client";

import { Button, Divider, Input, Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Turnstile from "react-turnstile";
import { toast } from "@/components/ui/toast";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
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
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
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
          <p className="text-sm">Login with your Apple or Google account</p>
        </div>
        <div>
          <Button
            size="lg"
            radius="sm"
            className="mt-4 w-full"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
        <div className="grid grid-cols-5 items-center">
          <Divider className="col-span-2" />
          <div className="text-center">OR</div>
          <Divider className="col-span-2" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            isClearable
            name="email"
            variant="bordered"
            size="lg"
            radius="sm"
            label="Username or Email"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            isRequired
            name="password"
            variant="bordered"
            size="lg"
            radius="sm"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <RiEyeOffLine className="text-default-400 pointer-events-none text-xl" />
                ) : (
                  <RiEyeLine className="text-default-400 pointer-events-none text-xl" />
                )}
              </button>
            }
          />
          <Link href="/auth/forgot">Forgot password?</Link>
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
            Login
          </Button>
        </form>
        <div className="mb-4 text-center text-sm">
          Do not have an account? <Link href="/auth/register">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
