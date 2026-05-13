"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const type = searchParams.get("type") || "signup"; // Default to signup if type is not provided
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    // Log for debugging
    console.log("Token received:", token);
    console.log("Type received:", type);

    if (token) {
      verifyEmail();
    } else {
      setStatus("Invalid or missing token.");
      setLoading(false);
      showToast("Invalid or missing verification token.", "error");
    }
  }, [token, type]);

  // Show toast message
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    console.log(`Toast: ${type} - ${message}`); // Log for debugging
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 5000);
  };

  async function verifyEmail() {
    try {
      setLoading(true);
      console.log("Attempting to verify email with token:", token);

      // Attempt verification with token_hash
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type === "signup" ? "signup" : "email",
      });

      console.log("Verification response:", { data, error });

      if (error) {
        console.error("Verification error:", error);

        // Try alternative verification if first method fails
        try {
          console.log("Trying alternative verification method");
          const { error: altError } = await supabase.auth.verifyOtp({
            token: token,
            type: type === "signup" ? "signup" : "email",
          });

          if (altError) {
            throw altError;
          } else {
            setStatus("✅ Email verified successfully!");
            showToast("Email verified successfully! Redirecting...", "success");
            setSuccess(true);
            setTimeout(() => router.push("/"), 3000);
            return;
          }
        } catch (altErr) {
          console.error("Alternative verification failed:", altErr);
          throw error; // Throw original error if alternative also fails
        }
      } else {
        setStatus("✅ Email verified successfully!");
        showToast("Email verified successfully! Redirecting...", "success");
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000);
      }
    } catch (error) {
      console.error("Verification catch block:", error);
      setStatus(
        `Email verification failed: ${error.message || "Unknown error"}`
      );
      showToast(
        `Email verification failed: ${error.message || "Unknown error"}`,
        "error"
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-8 md:py-16 lg:py-24 dark:bg-gray-900">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-[90vw] px-4 py-2 rounded-md shadow-lg md:max-w-md ${
            toast.type === "error"
              ? "bg-red-600"
              : toast.type === "success"
              ? "bg-green-600"
              : "bg-blue-600"
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
            ) : toast.type === "success" ? (
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

      <div className="bg-card w-full max-w-[320px] sm:max-w-sm md:max-w-md rounded-lg border p-0.5 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-300 animate-fadeIn">
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
              Email Verification
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              We're confirming your email address
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-center text-sm sm:text-base">
                  Verifying your email...
                </p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600 dark:text-green-400"
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
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  Email Verified!
                </h2>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Your email has been successfully verified. Redirecting to sign
                  in...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-600 dark:text-red-400"
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
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  Verification Failed
                </h2>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {status}
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full h-9 sm:h-10 mt-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
