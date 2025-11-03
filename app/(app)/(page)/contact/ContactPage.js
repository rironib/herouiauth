"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import Turnstile from "react-turnstile";
import { useForm } from "react-hook-form";
import { axiosPublic } from "@/lib/useAxiosPublic";
import { Button, Input, Textarea } from "@heroui/react";

export default function ContactForm() {
  const [token, setToken] = useState("");
  const [key, setKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const resetCaptcha = () => {
    setToken("");
    setKey((k) => k + 1);
  };

  const onSubmit = async (data) => {
    if (!token) return toast.error("Please verify you’re not a robot");

    try {
      const res = await axiosPublic.post("/api/contact", { ...data, token });
      if (!res.data.success) {
        toast.error(res.data.message || "Failed to send message");
        resetCaptcha();
        return;
      }
      toast.success(res.data.message || "Message sent successfully!");
      reset();
      resetCaptcha();
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
      resetCaptcha();
    }
  };

  return (
    <div>
      <div className="mb-6 text-center text-2xl font-bold md:text-3xl xl:text-4xl">
        Contact us
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
      >
        <Input
          isRequired
          label="Name"
          placeholder="Enter your name"
          disabled={isSubmitting}
          {...register("name", { required: "Please enter your name" })}
          errorMessage={errors.name?.message}
        />

        <Input
          isRequired
          label="Email"
          placeholder="Enter your email"
          type="email"
          disabled={isSubmitting}
          {...register("email", {
            required: "Please enter your email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
          errorMessage={errors.email?.message}
        />

        <Textarea
          isRequired
          label="Message"
          placeholder="Enter your message"
          disabled={isSubmitting}
          {...register("message", {
            required: "Please enter your message",
            minLength: {
              value: 5,
              message: "Message must be at least 5 characters long",
            },
          })}
          errorMessage={errors.message?.message}
        />

        {/* 🛡️ Turnstile Captcha */}
        <Turnstile
          key={key}
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          onExpire={resetCaptcha}
          onError={resetCaptcha}
          size="flexible"
          theme="auto"
          appearance="always"
          className="w-full"
        />

        <div className="flex w-full gap-4">
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={isSubmitting}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="bordered"
            disabled={isSubmitting}
            onPress={() => {
              reset();
              resetCaptcha();
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
