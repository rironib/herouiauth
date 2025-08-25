"use client";
import { signOut, useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();
  return { session, status, signOut };
};
