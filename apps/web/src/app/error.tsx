"use client";

import { Button } from "@workspace/ui/components/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-2">
      {process.env.NODE_ENV === "development" ? (
        <>
          <span>{error.message}</span>
          <span className="text-muted-foreground text-sm">{error.stack}</span>
        </>
      ) : (
        <h2>Something went wrong!</h2>
      )}
      <Button className="w-fit" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
