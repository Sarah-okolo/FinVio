import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/AuthProvider";
import { registerSchema } from "@/validations";
import type { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary placeholder:text-muted-foreground/70";

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof registerSchema>) => {
      const { confirmPassword, ...payload } = data;
      return axiosInstance.post("/register", payload);
    },
    onSuccess: async (response) => {
      const authData = response?.data?.data;
      if (authData?.access_token) {
        await login(authData);
        toast.success(response?.data?.message || "Welcome to Finvio!");
        navigate("/");
        return;
      }

      toast.success(
        response?.data?.message || "Account created. Please log in."
      );
      navigate("/login");
    },
    onError: (error: AxiosError) => {
      const message = error?.message || "Unable to register. Please try again.";
      toast.error(message);
    },
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    mutate(data);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
          Start fresh
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          Create your Finvio account
        </h1>
        <p className="text-muted-foreground text-sm">
          Set up your profile and start sending invoices in minutes.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className={inputClass}
              placeholder="Jane"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName?.message && (
              <p className="text-destructive text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className={inputClass}
              placeholder="Cooper"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName?.message && (
              <p className="text-destructive text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Work email
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

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
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

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword?.message && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary hover:underline underline-offset-4 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
