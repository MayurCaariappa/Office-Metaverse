"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { motion } from "framer-motion";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { z } from "zod";

const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        // .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        //     message: "Password must include letters, numbers, and special characters",
        // }),
});

export const Signup = ({ onSignupSuccess }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        try {
            signupSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMap = error.flatten().fieldErrors;
                setErrors(
                    Object.fromEntries(
                        Object.entries(errorMap).map(([key, value]) => [key, value[0]])
                    )
                );
            }
            return false;
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/signup", formData);
            // console.log("response: " + response);

            if (response.status === 200) {
                onSignupSuccess(formData.username);
                // console.log("Signup: Inside the if block. Status code: " + response.status);
            } else {
                // console.log("Signup: Inside the else block. Status code: " + response.status);
                setErrors((prev) => ({
                    ...prev,
                    submit: response.data?.message || "Signup failed",
                }));
            }
        } catch (error) {
            // console.log("Signup: Inside the error block. Status code: " + error.status);
            setErrors((prev) => ({
                ...prev,
                submit: "Network error. Please try again.",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 dark:from-zinc-900 dark:to-gray-800 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-8 space-y-6"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                        Hi!👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Create your account
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <input
                            id="username"
                            name="username"
                            style={{ margin: 10, padding: 10 }}
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition duration-300 ${errors.username
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-blue-500"
                                } dark:bg-zinc-900 dark:text-white`}
                            placeholder="Username"
                            aria-invalid={!!errors.username}
                        />
                        {errors.username && (
                            <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <input
                            id="password"
                            name="password"
                            style={{ margin: 10, padding: 10 }}
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition duration-300 ${errors.password
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-blue-500"
                                } dark:bg-zinc-900 dark:text-white`}
                            placeholder="Password"
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="text-red-600 text-sm text-center">{errors.submit}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? "Signing Up..." : "Create Account"}
                    </button>
                </form>

                <div className="text-center">
                    <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 dark:border-zinc-700 w-full"></div>
                        <span className="px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800">or</span>
                        <div className="border-t border-gray-300 dark:border-zinc-700 w-full"></div>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            className="flex items-center px-6 py-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300"
                        >
                            <IconBrandGoogle className="mr-2" />
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center px-6 py-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300"
                        >
                            <IconBrandGithub className="mr-2" />
                            GitHub
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

Signup.propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
};

export default Signup;