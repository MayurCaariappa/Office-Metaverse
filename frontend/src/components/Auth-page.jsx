"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "./ui/Button.jsx";
import { Input } from "./ui/Input.jsx";
import { Label } from "./ui/Label.jsx";
import { z } from "zod";

const authSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const AuthPage = ({ onSignupSuccess, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    try {
      authSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? "signin" : "signup";
      const response = await axios.post(
        `http://localhost:3000/api/v1/${endpoint}`,
        formData
      );
      if (response.status === 200) {
        if (isLogin) {
          localStorage.setItem("gameToken", response.data.token);
          onLoginSuccess(formData.username, response.data.token);
        } else {
          localStorage.setItem("gameToken", response.data.token);
          onSignupSuccess(formData.username, response.data.token);
        }
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.msg || "Network error. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 space-y-6"
      >
        <div className="p-[50px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome!" : "Hello! 👋"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? "Log in to your account" : "Create a new account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your username"
                aria-invalid={!!errors.username}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p
                  className="error-message mt-1 text-sm !text-red-500"
                  style={{ color: "#ef4444" }}
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                aria-invalid={!!errors.password}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p
                  className="error-message mt-1 text-sm !text-red-500"
                  style={{ color: "#ef4444" }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="p-2 bg-red-500/10 border border-red-500 rounded text-sm">
                <p
                  className="error-message !text-red-500"
                  style={{ color: "#ef4444" }}
                >
                  {errors.submit}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-lg font-medium"
            >
              {loading
                ? isLogin
                  ? "Logging In..."
                  : "Signing Up..."
                : isLogin
                ? "Log In"
                : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                {isLogin ? "Create account" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

AuthPage.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};

export default AuthPage;
