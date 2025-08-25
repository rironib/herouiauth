"use client";

import { Spinner } from "@heroui/react";

const Loading = () => {
  return (
    <div className="bg-default-50 fixed top-0 right-0 bottom-0 left-0 z-20 flex h-[100dvh] items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
