"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name:"", email:"", phone:"", company:"", subject:"", message:"", consent:false });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle"|"success"|"error">("idle");
  const [backendError, setBackendError] = useState("");

  const validate = () => {
    const e: Record<string,string> = {};
    if (!formData.name.trim()) e.name = "Full name is required.";
    if (!formData.email.trim()) e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email.";
    if (!formData.subject.trim()) e.subject = "Subject is required.";
    if (!formData.message.trim()) e.message = "Message content is required.";
    if (!formData.consent) e.consent = "You must agree to the data policy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value, type } = ev.target;
    const val = type === "checkbox" ? (ev.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true); setSubmitStatus("idle"); setBackendError("");
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${url}/enquiries`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit.");
      setSubmitStatus("success");
      setFormData({ name:"", email:"", phone:"", company:"", subject:"", message:"", consent:false });
    } catch (err: any) {
      setSubmitStatus("error");
      setBackendError(err.message || "Something went wrong.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto flex flex-col gap-10 sm:gap-16">
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-3 sm:gap-4">
        <h1 className="display-lg text-gradient font-heading">Get in Touch</h1>
        <p className="text-base sm:text-lg text-[#78350f] font-sans leading-relaxed font-medium">
          Have questions about security roles, quotation conversions, or setting up Stripe? Send us a message and our support team will reply within 24 hours.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 bg-white border border-orange-200 shadow-md">
            <h3 className="font-heading font-bold text-xl text-[#1a0f00]">Contact Information</h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-orange-700 uppercase tracking-wide">Headquarters</div>
                <div className="text-sm sm:text-base text-[#1a0f00] font-semibold font-sans mt-0.5 leading-snug">104 Enterprise Boulevard, Suite 500, Tech District, NY 10001</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-orange-700 uppercase tracking-wide">Phone</div>
                <div className="text-sm sm:text-base text-[#1a0f00] font-semibold font-sans mt-0.5">+1 (800) 555-CRM-NOW</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-orange-700 uppercase tracking-wide">Email Support</div>
                <div className="text-sm sm:text-base text-[#1a0f00] font-semibold font-sans mt-0.5">support@crm.local</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-orange-700 uppercase tracking-wide">Working Hours</div>
                <div className="text-sm sm:text-base text-[#1a0f00] font-semibold font-sans mt-0.5">Monday – Friday: 9:00 AM – 6:00 PM EST</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl p-5 sm:p-8 bg-white border border-orange-200 shadow-md">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1a0f00] mb-5 sm:mb-6">Send an Enquiry</h3>

            {submitStatus === "success" && (
              <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                className="mb-5 p-4 rounded-xl bg-green-50 border border-green-400 text-green-800 flex items-start gap-3">
                <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Enquiry Submitted Successfully!</h4>
                  <p className="text-sm mt-1">Thank you. An admin has been notified.</p>
                </div>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                className="mb-5 p-4 rounded-xl bg-red-50 border border-red-400 text-red-800 flex items-start gap-3">
                <ShieldAlert className="shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Submission Failed</h4>
                  <p className="text-sm mt-1">{backendError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input id="name" name="name" label="FULL NAME *" placeholder="John Doe" value={formData.name} onChange={handleChange} error={errors.name} />
                <Input id="email" name="email" type="email" label="EMAIL ADDRESS *" placeholder="john@company.com" value={formData.email} onChange={handleChange} error={errors.email} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input id="phone" name="phone" label="PHONE NUMBER" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                <Input id="company" name="company" label="COMPANY NAME" placeholder="Acme Corporation" value={formData.company} onChange={handleChange} />
              </div>
              <Input id="subject" name="subject" label="SUBJECT *" placeholder="How can we help you?" value={formData.subject} onChange={handleChange} error={errors.subject} />
              <Input id="message" name="message" isTextArea label="MESSAGE *" placeholder="Provide detailed information regarding your request..." value={formData.message} onChange={handleChange} error={errors.message} />

              <div className="flex flex-col gap-1.5 mt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-orange-400 bg-white checked:bg-orange-600 checked:border-transparent text-orange-600 focus:ring-2 focus:ring-orange-300 cursor-pointer shrink-0" />
                  <span className="text-sm text-[#1a0f00] font-medium leading-relaxed font-sans">
                    I consent to having the CRM platform collect and store my information in order to answer my inquiry.
                  </span>
                </label>
                {errors.consent && <span className="text-sm font-bold text-red-600">{errors.consent}</span>}
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-3 gap-2 py-4 text-base font-bold">
                {isSubmitting ? "Submitting..." : <><span>Submit Enquiry</span> <Send size={16} /></>}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
