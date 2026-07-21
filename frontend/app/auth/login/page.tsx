"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true); setErrorMessage("");
    try {
      const emailLower = formData.email.toLowerCase().trim();
      const userPayload = JSON.stringify({ email: emailLower, role: emailLower === "admin@crm.com" ? "admin" : "customer" });
      try { if (typeof window !== "undefined") localStorage.setItem("user", userPayload); } catch {}
      if (emailLower === "admin@crm.com" && formData.password === "admin123") router.push("/admin/dashboard");
      else router.push("/customer/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 sm:py-12 hero-gradient">
      <div className="w-full max-w-md rounded-2xl bg-white border border-orange-200 shadow-xl p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-md p-2">
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
          <h2 className="font-heading font-extrabold text-2xl text-[#1a0f00] tracking-tight mt-2">Welcome to CRM</h2>
          <p className="text-sm text-[#78350f] font-medium font-sans">Enter your credentials to access your control panel.</p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-400 text-sm font-semibold text-red-700">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <Input id="email" name="email" type="email" label="EMAIL ADDRESS" placeholder="name@company.com" value={formData.email} onChange={handleChange} error={errors.email} className="pl-10" />
            <Mail size={16} className="absolute left-3.5 top-[39px] text-orange-400" />
          </div>
          <div className="relative">
            <Input id="password" name="password" type={showPassword ? "text" : "password"} label="PASSWORD" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} className="pl-10 pr-10" />
            <Lock size={16} className="absolute left-3.5 top-[39px] text-orange-400" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-[38px] text-gray-400 hover:text-[#1a0f00]">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex justify-end text-xs font-sans">
            <Link href="/auth/forgot-password" className="text-orange-600 hover:text-[#1a0f00] transition-colors font-semibold">Forgot Password?</Link>
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full mt-2 py-4 gap-2">
            {isSubmitting ? "Signing in..." : <><span>Sign In</span> <ArrowRight size={15} /></>}
          </Button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#1a0f00] leading-normal font-mono">
          <div className="text-[#1a0f00] font-bold uppercase mb-2">DEMO CREDENTIALS:</div>
          <div>• Admin: <span className="text-orange-700 font-semibold">admin@crm.com</span> / <span className="text-orange-700 font-semibold">admin123</span></div>
          <div className="mt-1">• Customer: <span className="text-orange-700 font-semibold">customer@crm.com</span> / <span className="text-orange-700 font-semibold">customer123</span></div>
        </div>

        <div className="text-center mt-5 text-sm text-[#78350f] font-medium font-sans border-t border-orange-100 pt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-orange-600 font-bold hover:text-[#1a0f00] transition-colors">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
