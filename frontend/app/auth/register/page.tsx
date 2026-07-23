"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Building, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.toLowerCase().trim().endsWith("@crm.com")) {
      newErrors.email = "Email address must follow the @crm.com format (e.g. naveen@crm.com).";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);

    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 sm:py-12 hero-gradient">
      <div className="w-full max-w-sm sm:max-w-xl bg-white border border-orange-200/90 shadow-2xl rounded-2xl p-6 sm:p-8 transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100/60 border border-orange-200/80 flex items-center justify-center shadow-md p-2.5 text-[#1a0f00]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full text-[#1a0f00]">
              <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
              <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
              <rect x="70" y="58" width="5" height="5" fill="#EE4047" opacity="0.9" />
              <rect x="62" y="63" width="6" height="6" fill="#EE4047" opacity="0.8" />
              <rect x="76" y="65" width="5" height="5" fill="#EE4047" opacity="0.7" />
              <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
              <rect x="86" y="42" width="6" height="6" fill="#FF9F0A" opacity="0.9" />
              <rect x="94" y="34" width="5" height="5" fill="#FF9F0A" opacity="0.8" />
              <rect x="100" y="44" width="6" height="6" fill="#FF9F0A" opacity="0.7" />
              <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
              <rect x="114" y="18" width="6" height="6" fill="#27C15A" opacity="0.9" />
              <rect x="110" y="24" width="5" height="5" fill="#27C15A" opacity="0.8" />
              <rect x="122" y="22" width="6" height="6" fill="#27C15A" opacity="0.7" />
              <rect x="118" y="10" width="5" height="5" fill="#27C15A" opacity="0.9" />
              <ellipse cx="100" cy="100" rx="48" ry="29" stroke="currentColor" strokeWidth="10" transform="rotate(-15, 100, 100)" />
              <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
              <path d="M 75,122 L 35,167" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
              <path d="M 73,124 L 37,165" stroke="currentColor" strokeWidth="6" strokeOpacity="0.3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1a0f00] tracking-tight">
              Create Customer Account
            </h2>
            <p className="text-xs sm:text-sm text-[#78350f] font-medium font-sans mt-1">
              Fill in the details below to initialize your customer portal credentials.
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-400 text-xs font-semibold text-green-700 flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} className="shrink-0 text-green-600" /> Account created successfully! Redirecting to login...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-xs font-semibold text-red-700 flex items-center gap-2 shadow-sm">
            <ShieldAlert size={16} className="shrink-0 text-red-600" /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                FULL NAME *
              </label>
              <div className="relative flex items-center">
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    errors.name ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                  }`}
                />
                <User size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
              {errors.name && <span className="text-xs font-bold text-red-600 mt-0.5">{errors.name}</span>}
            </div>

            {/* Email Address */}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                PHONE NUMBER
              </label>
              <div className="relative flex items-center">
                <input
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <Phone size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                COMPANY NAME
              </label>
              <div className="relative flex items-center">
                <input
                  id="company"
                  name="company"
                  placeholder="Acme Inc"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <Building size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                PASSWORD *
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    errors.password ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                  }`}
                />
                <Lock size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
              {errors.password && <span className="text-xs font-bold text-red-600 mt-0.5">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-orange-700 font-sans tracking-wide uppercase">
                CONFIRM PASSWORD *
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#1a0f00] text-sm font-medium transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    errors.confirmPassword ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                  }`}
                />
                <Lock size={18} className="absolute left-3 text-orange-400 pointer-events-none" />
              </div>
              {errors.confirmPassword && <span className="text-xs font-bold text-red-600 mt-0.5">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Privacy Terms Notice */}
          <div className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-sans pt-1">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-orange-600 font-semibold hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-orange-600 font-semibold hover:underline">
              Privacy Policy
            </Link>.
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-1 py-3.5 sm:py-4 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? "Creating account..." : "Register Account"}
          </Button>
        </form>

        {/* Login switcher */}
        <div className="text-center mt-6 text-xs sm:text-sm text-[#78350f] font-medium font-sans border-t border-orange-100 pt-5">
          Already have a customer account?{" "}
          <Link href="/auth/login" className="text-orange-600 font-bold hover:text-[#1a0f00] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
