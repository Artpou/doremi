import { useContext } from "react";

import { APIContext } from "@/providers/provider-api";

export function useAPI() {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }
  return context;
}

export default useAPI;
