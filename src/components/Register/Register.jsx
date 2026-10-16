import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { signup } from "@/Api";
import { tokenContext } from "@/context/tokenContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),
    email: z.string().email("Invalid email"),
    dateOfBirth: z.string().refine(
      (value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return !!value && age >= 13;
      },
      { message: "You must be at least 13 years old" }
    ),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        "At least 8 characters, including a letter and a number"
      ),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const { setToken } = useContext(tokenContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male" },
  });

  async function onSubmit(values) {
    try {
      const res = await signup(values);
      const token = res?.data?.token;
      if (!res?.success || !token) {
        setError("root", { message: res?.message || "Could not create account" });
        return;
      }
      localStorage.setItem("token", token);
      setToken(token);
      toast.success("Account created. Welcome!");
      navigate("/");
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Could not create account") });
    }
  }

  const gender = watch("gender");

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="p-6 sm:p-7">
        <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Join nouxer and start sharing with the community.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          {errors.root ? (
            <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm">
              {errors.root.message}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Ahmed Bahnasy" {...register("name")} />
              {errors.name ? (
                <p className="text-destructive text-xs">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="ahmed_dev" {...register("username")} />
              {errors.username ? (
                <p className="text-destructive text-xs">{errors.username.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email ? (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth ? (
                <p className="text-destructive text-xs">{errors.dateOfBirth.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <div className="flex gap-2">
                {["male", "female"].map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex h-9 flex-1 cursor-pointer items-center justify-center rounded-md border text-sm capitalize transition-colors",
                      gender === option
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent"
                    )}
                  >
                    <input type="radio" value={option} className="sr-only" {...register("gender")} />
                    {option}
                  </label>
                ))}
              </div>
              {errors.gender ? (
                <p className="text-destructive text-xs">{errors.gender.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rePassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="rePassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("rePassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.rePassword ? (
                <p className="text-destructive text-xs">{errors.rePassword.message}</p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </div>

      <div className="bg-muted/40 border-t px-6 py-4 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
