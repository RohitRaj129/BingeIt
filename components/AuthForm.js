"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          router.push("/profiles");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
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

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Email and password are required");
      return;
    }

    if (isSignUp && (!firstName || !lastName)) {
      showToast("First name and last name are required");
      return;
    }

    // Password strength validation for signup
    if (isSignUp && !passwordStrength.isValid) {
      showToast(
        "Please create a stronger password that meets all requirements"
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: isSignUp ? `${firstName} ${lastName}` : "",
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          showToast(
            "This email is already registered. Please sign in instead."
          );
        } else {
          showToast(error.message);
        }
        return;
      }

      if (data) {
        showToast(
          "Sign up successful! Check your email for verification.",
          "success"
        );
        // Add delay before redirecting
        setTimeout(() => {
          router.push("/profiles");
        }, 3000); // 3 second delay
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast(error.message);
        return;
      }

      if (data) {
        router.push("/profiles");
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profiles`,
        },
      });

      if (error) {
        showToast(error.message);
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/profiles`,
        },
      });

      if (error) {
        showToast(error.message);
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
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
                  className="ml-0 object-contain"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-title mb-1 mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
              {isSignUp ? "Create a BingeIt Account" : "Sign In to BingeIt"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {isSignUp
                ? "Welcome! Create an account to get started"
                : "Welcome back! Sign in to continue"}
            </p>
          </div>

          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="text-xs sm:text-sm h-9 sm:h-10 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleMicrosoftSignIn}
              className="text-xs sm:text-sm h-9 sm:h-10 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
              >
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path
                  fill="#00adef"
                  d="M121.663 256.002H0V134.336h121.663z"
                ></path>
                <path
                  fill="#fbbc09"
                  d="M256 256.002H134.335V134.336H256z"
                ></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed dark:border-gray-600" />

          <div className="space-y-4 sm:space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="firstname"
                    className="block text-xs sm:text-sm"
                  >
                    First name
                  </Label>
                  <Input
                    type="text"
                    required
                    name="firstname"
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-8 sm:h-10 text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="lastname"
                    className="block text-xs sm:text-sm"
                  >
                    Last name
                  </Label>
                  <Input
                    type="text"
                    required
                    name="lastname"
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-8 sm:h-10 text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="block text-xs sm:text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 sm:h-10 text-sm dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-title text-xs sm:text-sm"
                >
                  Password
                </Label>
                {!isSignUp && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 sm:h-10 text-sm pr-10 dark:bg-gray-700 dark:border-gray-600"
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
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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

              {/* Password strength indicators - only show during signup */}
              {isSignUp && password.length > 0 && (
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

            <Button
              type="submit"
              className="w-full h-9 sm:h-10 mt-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={
                loading ||
                (isSignUp && !passwordStrength.isValid && password.length > 0)
              }
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-b-lg border-t p-3 dark:bg-gray-700 dark:border-gray-600">
          <p className="text-accent-foreground text-center text-xs sm:text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Button
              type="button"
              variant="link"
              className="h-auto px-1 sm:px-2 text-blue-600 dark:text-blue-400 text-xs sm:text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
