"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify email.");
      }

      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || "Email verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${backendUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccessMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 sm:py-12 hero-gradient">
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-orange-200/90 shadow-2xl rounded-2xl p-6 sm:p-8 transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100/60 border border-orange-200/80 flex items-center justify-center shadow-md p-2.5">
            <KeyRound size={28} className="text-orange-600" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1a0f00] tracking-tight">
              {step === 1 ? "Forgot Password?" : "Reset Your Password"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78350f] font-medium font-sans mt-1">
              {step === 1
                ? "Enter your account email to verify and reset your credentials."
                : `Set a new password for ${email}`}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs font-semibold text-red-700 leading-relaxed flex items-center gap-2 shadow-sm">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-300 text-xs font-semibold text-green-700 leading-relaxed flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} className="shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: VERIFY EMAIL FORM */
          <form onSubmit={handleVerifyEmail} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="forgot-email" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                REGISTERED EMAIL ADDRESS *
              </label>
              <div className="relative flex items-center">
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <Mail size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4 gap-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? "Verifying..." : <><span>Verify Email</span> <ArrowRight size={16} /></>}
            </Button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-[#1a0f00] transition-colors">
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        ) : (
          /* STEP 2: RESET PASSWORD FORM */
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                NEW PASSWORD *
              </label>
              <div className="relative flex items-center">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setErrorMessage(""); }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <Lock size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-[#1a0f00] p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-new-password" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                CONFIRM NEW PASSWORD *
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirm-new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(""); }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <Lock size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 sm:py-4 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? "Updating..." : "Update Password & Sign In"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMessage(""); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#1a0f00] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Change Email</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
