import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate(); 
  const schema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email").nonempty("Email is required"),
      password: z
        .string()
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
          "Password must be at least 8 characters and include a letter and a number"
        ),
      rePassword: z.string(),
      dateOfBirth: z.string().refine(
        (val) => {
          const age = new Date().getFullYear() - new Date(val).getFullYear();
          return age >= 13;
        },
        { message: "You must be at least 13 years old" }
      ),
      gender: z
        .enum(["male", "female"])
        .refine((val) => !!val, { message: "Gender is required" }),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });
  async function onSubmit(values) {
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      if (data.message.includes("success")) {
        navigate("/login");
        return;
      }
      if (data?.error || data?.message) {
        setError("root", { message: data.error || data.message });
      }
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message,
      });
    }
  }

  return (
    <div className="w-[90%] md:w-[50%] m-15 mx-auto p-5  shadow-lg dark:shadow-sm rounded-xl bg-white dark:bg-gray-800 transition-colors">
      <h1 className="text-sky-800 dark:text-sky-400 text-3xl font-semibold">Register New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="my-4">
        {errors.name && <p className="text-red-600 dark:text-red-400">{errors.name.message}</p>}
        <input
          {...register("name")}
          className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Enter your name"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.email && <p className="text-red-600 dark:text-red-400">{errors.email.message}</p>}
        <input
          {...register("email")}
          type="email"
          className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
        <input
          {...register("password")}
          type="password"
          className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Enter your password"
          autoComplete="new-password"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.rePassword && (
          <p className="text-red-600 dark:text-red-400">{errors.rePassword.message}</p>
        )}
        <input
          {...register("rePassword")}
          type="password"
          className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Confirm your password"
          autoComplete="new-password"
          aria-invalid={errors.rePassword ? "true" : "false"}
        />
        {errors.dateOfBirth && (
          <p className="text-red-600 dark:text-red-400">{errors.dateOfBirth.message}</p>
        )}
        <input
          {...register("dateOfBirth")}
          type="date"
          className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          aria-invalid={errors.dateOfBirth ? "true" : "false"}
        />
        {errors.gender && (
          <p className="text-red-600 dark:text-red-400">{errors.gender.message}</p>
        )}
        <div className="w-full mb-4">
          <input
            {...register("gender")}
            type="radio"
            id="m"
            value="male"
            className="radio radio-primary"
          />
          <label htmlFor="m" className="mx-2 text-gray-900 dark:text-gray-100">
            Male
          </label>

          <input
            {...register("gender")}
            type="radio"
            id="f"
            value="female"
            className="radio radio-primary"
          />
          <label htmlFor="f" className="mx-2 text-gray-900 dark:text-gray-100">
            Female
          </label>
        </div>
        {errors.root && <p className="text-red-600 dark:text-red-400">{errors.root.message}</p>}
        <button
          type="submit"
          className="text-slate-200 bg-sky-700 hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700 px-6 py-3 rounded-md transition-colors"
        >
          {isSubmitting ? "Loading..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
