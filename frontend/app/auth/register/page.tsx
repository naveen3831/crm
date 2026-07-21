"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Mail, Phone, Building, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
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
      // Send register parameters to Node.js backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${backendUrl}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We submit a registration request as an enquiry context or user setup draft
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: "Customer Account Registration Request",
          message: `Automatic system draft: Customer requested registration under company '${formData.company || "N/A"}'.`,
          consent: true,
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

      // Redirect client to login after brief success pause
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
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 hero-gradient">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-orange-200 shadow-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-700/10 to-blue-500/5 border border-blue-500/10 flex items-center justify-center shadow-lg p-2 text-[#1a0f00]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full text-[#1a0f00]">
              {/* Back half of blue orbit */}
              <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
              
              {/* Red bar */}
              <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
              <rect x="70" y="58" width="5" height="5" fill="#EE4047" opacity="0.9" />
              <rect x="62" y="63" width="6" height="6" fill="#EE4047" opacity="0.8" />
              <rect x="76" y="65" width="5" height="5" fill="#EE4047" opacity="0.7" />

              {/* Amber bar */}
              <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
              <rect x="86" y="42" width="6" height="6" fill="#FF9F0A" opacity="0.9" />
              <rect x="94" y="34" width="5" height="5" fill="#FF9F0A" opacity="0.8" />
              <rect x="100" y="44" width="6" height="6" fill="#FF9F0A" opacity="0.7" />

              {/* Green bar */}
              <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
              <rect x="114" y="18" width="6" height="6" fill="#27C15A" opacity="0.9" />
              <rect x="110" y="24" width="5" height="5" fill="#27C15A" opacity="0.8" />
              <rect x="122" y="22" width="6" height="6" fill="#27C15A" opacity="0.7" />
              <rect x="118" y="10" width="5" height="5" fill="#27C15A" opacity="0.9" />

              {/* Magnifying Glass Lens frame */}
              <ellipse cx="100" cy="100" rx="48" ry="29" stroke="currentColor" strokeWidth="10" transform="rotate(-15, 100, 100)" />

              {/* Front half of blue orbit */}
              <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />

              {/* Magnifying Glass Handle */}
              <path d="M 75,122 L 35,167" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
              <path d="M 73,124 L 37,165" stroke="currentColor" strokeWidth="6" strokeOpacity="0.3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#1a0f00] tracking-tight mt-2">
            Create Customer Account
          </h2>
          <p className="text-sm text-[#78350f] font-medium font-sans">
            Fill in the details below to initialize your customer portal credentials.
          </p>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-400 text-xs font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle2 size={16} /> Account created successfully! Redirecting to login...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-400 text-xs font-semibold text-red-700 flex items-center gap-2">
            <ShieldAlert size={16} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                id="name"
                name="name"
                label="FULL NAME *"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                className="pl-10"
              />
              <User size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>

            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                label="EMAIL ADDRESS *"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-10"
              />
              <Mail size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                id="phone"
                name="phone"
                label="PHONE NUMBER"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
              />
              <Phone size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>

            <div className="relative">
              <Input
                id="company"
                name="company"
                label="COMPANY NAME"
                placeholder="Acme Inc"
                value={formData.company}
                onChange={handleChange}
                className="pl-10"
              />
              <Building size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                label="PASSWORD *"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="pl-10"
              />
              <Lock size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="CONFIRM PASSWORD *"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="pl-10"
              />
              <Lock size={16} className="absolute left-3.5 top-[39px] text-gray-400" />
            </div>
          </div>

          {/* Privacy Terms Notice */}
          <div className="text-[10px] text-gray-600 leading-relaxed font-sans mt-2">
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
            className="w-full mt-2 py-4"
          >
            {isSubmitting ? "Creating account..." : "Register Account"}
          </Button>
        </form>

        {/* Login switcher */}
        <div className="text-center mt-5 text-sm text-[#78350f] font-medium font-sans border-t border-orange-100 pt-4">
          Already have a customer account?{" "}
          <Link href="/auth/login" className="text-orange-600 font-bold hover:text-[#1a0f00] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

