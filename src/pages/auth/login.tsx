import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/AuthProvider";
import { loginSchema } from "@/validations";
import type { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary placeholder:text-muted-foreground/70";

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) =>
      axiosInstance.post("/login", data),
    onSuccess: async (response) => {
      const authData = response?.data?.data;
      if (authData) {
        await login(authData);
        toast.success(response?.data?.message || "Login successful");
        navigate("/");
        return;
      }
      toast.error("Login failed: missing user data from server.");
    },
    onError: (error: AxiosError) => {
      const message = error?.message || "Unable to login. Please try again.";
      toast.error(message);
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    mutate(data);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
          Welcome back
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          Sign in to continue
        </h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-primary hover:underline underline-offset-4 font-semibold"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
