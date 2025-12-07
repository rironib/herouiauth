"use client";

import { useState } from "react";
import Turnstile from "react-turnstile";
import { axiosPublic } from "@/lib/useAxiosPublic";
import { Alert, Button, Form, Input, Textarea } from "@heroui/react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [token, setToken] = useState("");
  const [key, setKey] = useState(0);

  const resetCaptcha = () => {
    setToken("");
    setKey((k) => k + 1);
  };

  const handleReset = () => {
    setAlert(null);
    resetCaptcha();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await axiosPublic.post("/api/contact", { ...data, token });
      if (!res.data.success) {
        setAlert({
          success: false,
          message: res.data.message || "Failed to send message",
        });
        return;
      }
      e.target.reset();
      setAlert({
        success: true,
        message: res.data.message || "Message sent successfully!",
      });
    } catch (e) {
      setAlert({
        success: false,
        message: e.message || "Something went wrong",
      });
    } finally {
      resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center text-2xl font-bold md:text-3xl xl:text-4xl">
        Contact us
      </div>
      <Form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
        {alert && (
          <Alert
            color={alert.success ? "success" : "danger"}
            title={alert.message}
          />
        )}
        <Input name="name" label="Name" radius="sm" isRequired />
        <Input name="email" label="Email" type="email" radius="sm" isRequired />
        <Textarea name="message" label="Message" radius="sm" isRequired />
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
            isLoading={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button
            type="reset"
            variant="bordered"
            disabled={loading}
            onPress={handleReset}
          >
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
