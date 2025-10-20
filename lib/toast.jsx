"use client";

import { addToast } from "@heroui/react";

export const toast = {
  success: (message, options = {}) =>
    addToast({
      title: "Success",
      description: message,
      variant: "flat",
      color: "success",
      ...options,
    }),
  error: (message, options = {}) =>
    addToast({
      title: "Error",
      description: message,
      variant: "flat",
      color: "danger",
      ...options,
    }),
  warning: (message, options = {}) =>
    addToast({
      title: "Warning",
      description: message,
      variant: "flat",
      color: "warning",
      ...options,
    }),
  info: (message, options = {}) =>
    addToast({
      title: "Info",
      description: message,
      variant: "flat",
      color: "secondary",
      ...options,
    }),
};
