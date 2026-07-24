"use client";

import React, { useState } from "react";
import { X, FileText, Globe, Zap, Smartphone, Plus, Sparkles, CheckCircle } from "lucide-react";
import Button from "../ui/Button";

interface CreateProjectProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onCreateProposal: (proposalTitle: string, variantKey: "website" | "website_app" | "app") => void;
}

export default function CreateProjectProposalModal({
  isOpen,
  onClose,
  project,
  onCreateProposal
}: CreateProjectProposalModalProps) {
  if (!isOpen || !project) return null;

  const projName = typeof project?.name === "string" ? project.name : (typeof project?.title === "string" ? project.title : (project?.name?.name || project?.name?.title || "Project"));
  const [proposalTitle, setProposalTitle] = useState(`${projName} Custom Proposal`);
  const [selectedVariant, setSelectedVariant] = useState<"website" | "website_app" | "app">("website_app");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) return;
    onCreateProposal(proposalTitle.trim(), selectedVariant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white flex items-center justify-between border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl border border-orange-500/30 text-orange-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Create New Proposal for {projName}
              </h2>
              <p className="text-xs text-gray-400">
                Generate a new proposal variant specifically for <strong>{projName}</strong> ({project.id || "OPRJ"}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Proposal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HMS Enterprise Multi-Hospital Proposal"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1a0f00] border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Starting Preset Variant Template
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  key: "website" as const,
                  icon: <Globe className="w-5 h-5 text-sky-500" />,
                  title: "Website Only",
                  desc: "Web Portal, EMR Workstation, OPD/IPD Billing & Admin Panel."
                },
                {
                  key: "website_app" as const,
                  icon: <Zap className="w-5 h-5 text-orange-500" />,
                  title: "Website + App (Hybrid Ecosystem)",
                  desc: "Web Workstation + iOS & Android Patient/Doctor Mobile Apps with FCM Alerts."
                },
                {
                  key: "app" as const,
                  icon: <Smartphone className="w-5 h-5 text-purple-500" />,
                  title: "App Only",
                  desc: "Native iOS & Android Mobile Apps with QR check-in & camera document scanner."
                }
              ].map((varItem) => {
                const isSelected = selectedVariant === varItem.key;
                return (
                  <div
                    key={varItem.key}
                    onClick={() => setSelectedVariant(varItem.key)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-2 bg-white rounded-lg border border-gray-150 shadow-xs">
                      {varItem.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-extrabold text-xs text-[#1a0f00] flex items-center justify-between">
                        <span>{varItem.title}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-orange-600" />}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{varItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create 8 Sections Proposal</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
