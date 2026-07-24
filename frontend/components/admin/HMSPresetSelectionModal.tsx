"use client";

import React from "react";
import { X, Globe, Smartphone, Zap, Sparkles, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface HMSPresetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onSelectPreset: (presetKey: "website" | "website_app" | "app") => void;
}

export default function HMSPresetSelectionModal({
  isOpen,
  onClose,
  project,
  onSelectPreset
}: HMSPresetSelectionModalProps) {
  if (!isOpen || !project) return null;

  const projName = project?.name || project?.title || "Project Workspace";

  const options = [
    {
      key: "website" as const,
      icon: <Globe className="w-8 h-8 text-sky-500" />,
      title: "Website Only Proposal",
      badge: "8 Sections &bull; Web Application",
      tagColor: "bg-sky-50 text-sky-700 border-sky-200",
      buttonColor: "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white",
      description: "High-performance Web Portal, Doctor EMR Workstation, OPD/IPD Billing, Lab Diagnostics & Pharmacy Inventory.",
      features: [
        "Patient Self-Service Web Portal",
        "Doctor EMR & Digital Prescriptions",
        "OPD/IPD GST Counter Billing",
        "Lab Diagnostic PDF Upload Vault"
      ]
    },
    {
      key: "website_app" as const,
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: "Website + App (Hybrid Ecosystem)",
      badge: "8 Sections &bull; Web & Mobile Suite",
      tagColor: "bg-orange-50 text-orange-700 border-orange-200",
      buttonColor: "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20",
      description: "Complete omni-channel suite: Web Management Portal + Native iOS & Android Apps for Patients & Medical Staff.",
      recommended: true,
      features: [
        "Web Admin & Doctor Workstation",
        "iOS & Android Patient Mobile Apps",
        "Push Notifications (FCM & APNs)",
        "Ward Rounds Doctor Mobile App"
      ]
    },
    {
      key: "app" as const,
      icon: <Smartphone className="w-8 h-8 text-purple-500" />,
      title: "App Only Proposal",
      badge: "8 Sections &bull; Mobile Application",
      tagColor: "bg-purple-50 text-purple-700 border-purple-200",
      buttonColor: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white",
      description: "Native iOS & Android Mobile Applications for digital-first clinics, QR registration & Bluetooth vitals sync.",
      features: [
        "Native Patient App (iOS & Android)",
        "Doctor Mobile Agenda & Signatures",
        "QR Code Counter Check-In",
        "Camera Document Edge Scanner"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white flex items-center justify-between border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 rounded-2xl border border-orange-500/30 text-orange-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Select Proposal Quotation Variant
              </h2>
              <p className="text-xs text-gray-300">
                Target Project: <strong className="text-orange-300 font-mono">{projName}</strong> ({project.id || "OPRJ"})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 3 Option Cards */}
        <div className="p-6 bg-slate-50/50 space-y-4">
          <p className="text-xs font-semibold text-gray-600">
            Choose a target proposal variant to instantly generate and populate <strong>All 8 Proposal Sections</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((opt) => (
              <div
                key={opt.key}
                onClick={() => onSelectPreset(opt.key)}
                className={`group relative bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  opt.recommended
                    ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                {opt.recommended && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-sm">
                    RECOMMENDED
                  </span>
                )}

                <div>
                  <div className="mb-3 flex justify-between items-start">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${opt.tagColor}`}>
                      {opt.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] mb-1 group-hover:text-orange-600 transition-colors">
                    {opt.title}
                  </h3>

                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                    {opt.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-gray-100">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider block mb-1">
                      Included Scope:
                    </span>
                    {opt.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[10px] text-gray-700 font-medium">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPreset(opt.key);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${opt.buttonColor}`}
                  >
                    <span>Create 8 Sections Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Speshway CRM Proposal Builder &bull; Generates All 8 Sections Continuously</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 font-bold"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
