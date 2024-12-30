"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { Input, InputWrapper } from "@repo/ui/components/input";

import { signInAction } from "@/actions";
import useAPI from "@/hooks/useAPI";

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
  const { GET, POST } = useAPI();

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

      const signInResult = await signInAction(data.email, data.password);
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
    <div className="container flex flex-col items-center gap-4">
      <form
        className="flex w-full max-w-md flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!!errors.root && (
          <div className="alert alert-error w-full p-3">
            {errors.root.message}
          </div>
        )}
        <InputWrapper
          className="w-full"
          label="Name"
          error={errors.name?.message}
        >
          <Input {...register("name")} />
        </InputWrapper>

        <InputWrapper
          className="w-full"
          label="Email"
          error={errors.email?.message}
        >
          <Input type="email" {...register("email")} />
        </InputWrapper>

        <InputWrapper
          className="w-full"
          label="Password"
          error={errors.password?.message}
        >
          <Input type="password" {...register("password")} />
        </InputWrapper>

        <div className="flex items-center justify-center gap-4">
          <Button className="btn-primary" type="submit" isLoading={isPending}>
            Sign Up
          </Button>
          <Link className="btn" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
