import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../context/tokenContext.jsx";
    
export default function Login() {

    const navigate = useNavigate();
    const { token, setToken } = useContext(tokenContext);
    const schema = z.object({
        email: z.string().email("Invalid email").nonempty("Email is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
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
                "https://linked-posts.routemisr.com/users/signin",
                values
            );
            if (data.message.includes("success")) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                navigate("/");
                return;
            }
            setError("root", { message: data.error || data.message || "Login failed" });
        } catch (err) {
            setError("root", {
                message: err.response?.data?.error || err.response?.data?.message || err.message,
            });
        }
    }
    return (
        <div className="w-[90%] md:w-[50%] m-15 mx-auto    p-5   shadow-lg dark:shadow-sm rounded-xl bg-white dark:bg-gray-800 transition-colors">
            <h1 className="text-sky-800 dark:text-sky-400 text-3xl font-semibold">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="my-4">
                {errors.email && <p className="text-red-600 dark:text-red-400">{errors.email.message}</p>}
                <input
                    {...register("email")}
                    type="email"
                    className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                />

                {errors.password && <p className="text-red-600 dark:text-red-400">{errors.password.message}</p>}
                <input
                    {...register("password")}
                    type="password"
                    className="input w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? "true" : "false"}
                />

                {errors.root && <p className="text-red-600 dark:text-red-400">{errors.root.message}</p>}
                <button
                    type="submit"
                    className="text-slate-200 bg-sky-700 hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700 px-6 py-3 rounded-md transition-colors"
                >
                    {isSubmitting ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
