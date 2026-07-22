"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email.";
    if (!formData.password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Save authenticated user into localStorage with DB role
      const userPayload = JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role === "admin" ? "admin" : "customer",
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", userPayload);
        }
      } catch {}

      // Automatic Role-based Routing based on DB account role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-6 sm:py-10 hero-gradient">
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-orange-200/90 shadow-2xl rounded-2xl p-6 sm:p-8 my-auto transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100/60 border border-orange-200/80 flex items-center justify-center shadow-md p-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
              <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
              <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
              <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
              <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
              <ellipse cx="100" cy="100" rx="48" ry="29" stroke="#1a0f00" strokeWidth="10" transform="rotate(-15, 100, 100)" />
              <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
              <path d="M 75,122 L 35,167" stroke="#1a0f00" strokeWidth="15" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1a0f00] tracking-tight">
              Welcome to CRM
            </h2>
            <p className="text-xs sm:text-sm text-[#78350f] font-medium font-sans mt-1">
              Enter your credentials to access your control panel.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-300 text-xs font-semibold text-red-700 leading-relaxed flex items-center gap-2 shadow-sm">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
              EMAIL ADDRESS *
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="naveen@crm.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                  errors.email ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                }`}
              />
              <Mail size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
            </div>
            {errors.email && <span className="text-xs font-bold text-red-600 mt-0.5">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
              PASSWORD *
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white border text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                  errors.password ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                }`}
              />
              <Lock size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-[#1a0f00] p-1 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-xs font-bold text-red-600 mt-0.5">{errors.password}</span>}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end text-xs font-sans pt-0.5">
            <Link href="/auth/forgot-password" className="text-orange-600 hover:text-[#1a0f00] transition-colors font-semibold">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-1 py-3.5 sm:py-4 gap-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs sm:text-sm text-[#78350f] font-medium font-sans border-t border-orange-100 pt-5">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-orange-600 font-bold hover:text-[#1a0f00] transition-colors">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
