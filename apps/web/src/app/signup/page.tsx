"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Alert, AlertTitle } from "@workspace/ui/components/alert";
import { Input, InputWrapper } from "@workspace/ui/components/input";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import useAPI from "@/hooks/useAPI";
import SpotifyIcon from "@/components/icon/icon-spotify";

const SignupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignupType = z.infer<typeof SignupSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { POST } = useAPI();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignupType) => {
      const { error } = await POST("/auth/register", {
        body: data,
      });

      if (error) throw error;

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInResult?.error) throw signInResult.error;
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const onSubmit = (data: SignupType): void => {
    signup(data);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Card className="flex w-fit min-w-96 flex-col items-center justify-center gap-4 p-6">
        <Button
          onClick={() => signIn("spotify", { redirectTo: "/" })}
          className="w-full max-w-md"
        >
          <SpotifyIcon />
          {t("auth.signInWithSpotify")}
        </Button>
        <div className="my-4 w-full max-w-md text-center">{t("common.or")}</div>
        <form
          className="flex w-full max-w-md flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!!errors.root && (
            <Alert variant="destructive">
              <AlertTitle>{errors.root.message}</AlertTitle>
            </Alert>
          )}
          <InputWrapper
            className="w-full"
            label={t("auth.name")}
            error={errors.name?.message}
          >
            <Input {...register("name")} />
          </InputWrapper>
          <InputWrapper
            className="w-full"
            label={t("auth.email")}
            error={errors.email?.message}
          >
            <Input type="email" {...register("email")} />
          </InputWrapper>
          <InputWrapper
            className="w-full"
            label={t("auth.password")}
            error={errors.password?.message}
          >
            <Input type="password" {...register("password")} />
          </InputWrapper>
          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" asChild>
              <Link href="/">{t("common.cancel")}</Link>
            </Button>
            <Button type="submit" isLoading={isPending}>
              {t("common.signup")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;
