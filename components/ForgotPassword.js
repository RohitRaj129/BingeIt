"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const router = useRouter();

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

    if (!email) {
      showToast("Email is required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        showToast(error.message);
        return;
      }

      showToast("Password reset link sent to your email", "success");
      // Clear the email field
      setEmail("");
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.push("/");
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
                  src="/Bingeit_logo.png"
                  alt="BingeIt Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-title mb-1 mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 mt-6">
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
                placeholder="Enter your email address"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-9 sm:h-10 mt-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
              onClick={handleBackToSignIn}
            >
              Back to Sign In
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
