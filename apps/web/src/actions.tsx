"use server";

import { signIn } from "@/auth";

export async function signInAction(
  email: string,
  password: string,
): Promise<ReturnType<typeof signIn>> {
  return await signIn("credentials", { email, password, redirect: false });
}
