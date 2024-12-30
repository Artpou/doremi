import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";

import { auth } from "@/auth";
import { GET } from "@/app/api/client";
import { CardItem } from "@/components/CardItem";

export default async function Profile() {
  const session = await auth();
  const t = await getTranslations("common");
  const { data } = await GET("/user/top");

  if (!session?.user) return null;

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Top Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {data?.items?.map(({ album, name, id }) => (
                <CardItem
                  key={id}
                  id={id}
                  name={name}
                  image={album.images[0]?.url}
                  artists={album.artists}
                  release_date={album.release_date}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
