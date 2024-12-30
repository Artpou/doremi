import Link from "next/link";

import LogoutButton from "../components/ButtonLogout";

import { auth } from "@/auth";
import { GET } from "@/app/api/client";

export default async function Home() {
  const session = await auth();

  const { data } = await GET("/auth/me");
  // eslint-disable-next-line no-console
  console.log("🚀 ~ me :", data);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {session?.user ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl">Welcome {session.user.name}!</h1>
          <p>Email: {session.user.email}</p>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-4">
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
          <Link className="btn" href="/signup">
            Sign Up
          </Link>
        </div>
      )}
    </section>
  );
}
