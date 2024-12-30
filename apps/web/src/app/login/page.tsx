"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { Input, InputWrapper } from "@repo/ui/components/input";

import { signInAction } from "@/actions";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginType = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (data: LoginType) => {
      const { error } = await signInAction(data.email, data.password);

      if (error) throw error;
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: () => {
      setError("root", { message: "Invalid email or password" });
    },
  });

  const onSubmit = async (data: LoginType): Promise<undefined> => {
    signIn(data);
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
            Sign In
          </Button>
          <Link className="btn" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
