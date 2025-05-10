"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasNumber: false,
    hasSymbol: false,
    message: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a reset password flow
    const checkResetSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken) {
        // Not a valid reset password session, redirect to sign in
        showToast(
          "Invalid password reset link. Please request a new one.",
          "error"
        );
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    checkResetSession();
  }, [router]);

  // Password validation
  useEffect(() => {
    if (!password || password.length === 0) {
      setPasswordStrength({
        isValid: false,
        hasMinLength: false,
        hasNumber: false,
        hasSymbol: false,
        message: "",
      });
      return;
    }

    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const isValid = hasMinLength && hasNumber && hasSymbol;

    let message = "";
    if (!isValid) {
      const missing = [];
      if (!hasMinLength) missing.push("6+ characters");
      if (!hasNumber) missing.push("a number");
      if (!hasSymbol) missing.push("a symbol");
      message = `Password needs ${missing.join(", ")}`;
    }

    setPasswordStrength({
      isValid,
      hasMinLength,
      hasNumber,
      hasSymbol,
      message,
    });
  }, [password]);

  // Show toast message
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 5000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords don't match");
      return;
    }

    if (!passwordStrength.isValid) {
      showToast(
        "Please create a stronger password that meets all requirements"
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        showToast(error.message);
        return;
      }

      showToast("Password has been reset successfully!", "success");

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-8 md:py-16 lg:py-24 dark:bg-gray-900">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-[90vw] px-4 py-2 rounded-md shadow-lg md:max-w-md ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white flex items-center justify-between`}
        >
          <div className="flex items-center">
            {toast.type === "error" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span className="text-sm sm:text-base">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-3 text-white hover:text-gray-200 flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <form
        onSubmit={handleResetPassword}
        className="bg-card w-full max-w-[320px] sm:max-w-sm md:max-w-md rounded-lg border p-0.5 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-300 animate-fadeIn"
      >
        <div className="p-5 sm:p-6 md:p-8 pb-4 sm:pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <div className="relative w-40 h-10">
                <Image
                  src="/logo.png"
                  alt="BingeIt Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-title mb-1 mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
              Set New Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Enter your new password below
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 mt-6">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="block text-xs sm:text-sm">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 sm:h-10 text-sm pr-10 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.007 10.065 7.178a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium">
                        Password strength
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.hasMinLength
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.hasNumber
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.hasSymbol
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                    </div>
                    {passwordStrength.message && (
                      <span className="text-xs text-red-500 dark:text-red-400">
                        {passwordStrength.message}
                      </span>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                      <p
                        className={
                          passwordStrength.hasMinLength
                            ? "text-green-500 dark:text-green-400"
                            : ""
                        }
                      >
                        • At least 6 characters
                      </p>
                      <p
                        className={
                          passwordStrength.hasNumber
                            ? "text-green-500 dark:text-green-400"
                            : ""
                        }
                      >
                        • At least 1 number
                      </p>
                      <p
                        className={
                          passwordStrength.hasSymbol
                            ? "text-green-500 dark:text-green-400"
                            : ""
                        }
                      >
                        • At least 1 special character
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-8 sm:h-10 text-sm pr-10 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.007 10.065 7.178a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <div className="mt-1">
                  {password === confirmPassword ? (
                    <span className="text-xs text-green-500 dark:text-green-400 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 dark:text-red-400 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-9 sm:h-10 mt-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={
                loading ||
                !passwordStrength.isValid ||
                password !== confirmPassword
              }
            >
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-b-lg border-t p-3 dark:bg-gray-700 dark:border-gray-600">
          <p className="text-accent-foreground text-center text-xs sm:text-sm">
            Remember your password?
            <Button
              type="button"
              variant="link"
              className="h-auto px-1 sm:px-2 text-blue-600 dark:text-blue-400 text-xs sm:text-sm"
              onClick={() => router.push("/")}
            >
              Back to Sign In
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
