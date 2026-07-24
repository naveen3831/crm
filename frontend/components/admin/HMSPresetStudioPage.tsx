"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Globe, Zap, Smartphone, Trash2, CheckCircle, ArrowRight, Layers, FileText, Building2, ShieldCheck, Search } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import { HMS_PRESETS, HMSPresetData } from "@/lib/HMSPresets";

interface HMSPresetStudioPageProps {
  ourProjects: any[];
  onApplyPresetToProject: (project: any, presetData: HMSPresetData) => void;
}

export default function HMSPresetStudioPage({
  ourProjects,
  onApplyPresetToProject
}: HMSPresetStudioPageProps) {
  // Built-in presets array
  const initialPresets: HMSPresetData[] = [
    HMS_PRESETS.website,
    HMS_PRESETS.website_app,
    HMS_PRESETS.app
  ];

  const [customPresets, setCustomPresets] = useState<HMSPresetData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectMap, setSelectedProjectMap] = useState<Record<string, string>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for creating a new custom preset
  const [presetTitle, setPresetTitle] = useState("");
  const [presetCategory, setPresetCategory] = useState("Web & Mobile Ecosystem");
  const [presetBudget, setPresetBudget] = useState(120000);
  const [planAPrice, setPlanAPrice] = useState(65000);
  const [planBPrice, setPlanBPrice] = useState(120000);
  const [planCPrice, setPlanCPrice] = useState(210000);
  const [overviewNarrative, setOverviewNarrative] = useState("");
  const [scopeInput, setScopeInput] = useState("User Authentication & Roles\nInteractive Admin Dashboard\nPayment Gateway Integration\nCloud Deployment & SSL Certification");

  const allPresets = [...initialPresets, ...customPresets];

  const filteredPresets = allPresets.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetTitle.trim()) return;

    const scopeItems = scopeInput
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    const newPreset: HMSPresetData = {
      id: `preset-custom-${Date.now()}`,
      variantKey: "website_app",
      title: presetTitle,
      category: presetCategory,
      budget: presetBudget,
      overviewNarrative: overviewNarrative || `Comprehensive ${presetTitle} solution tailored for enterprise operations with scalable microservices and security compliance.`,
      rolesMatrix: [
        { role: "Super Admin", count: "1 - 3", description: "System governance & audit logs.", permissions: "Full Access" },
        { role: "Operational Staff", count: "5 - 20", description: "Daily operations & workflow management.", permissions: "Ops Access" },
        { role: "End Customer", count: "Unlimited", description: "Self-service mobile/web portal user.", permissions: "Customer Profile" }
      ],
      customerDesc: `### 🌐 Customer Portal Features\n${scopeItems.slice(0, 2).map(s => `- **${s}**`).join("\n")}`,
      merchantDesc: `### 🩺 Staff & Operational Portal\n${scopeItems.slice(2, 4).map(s => `- **${s}**`).join("\n")}`,
      adminDesc: `### 🏢 Executive Administration\n- Full system oversight, audit logs, and cloud infrastructure management.`,
      planAPrice,
      planBPrice,
      planCPrice,
      planComparisonItems: scopeItems.map(item => ({
        deliverable: item,
        planA: true,
        planB: true,
        planC: true
      })),
      paymentTerms: `### 💳 Payment Milestones\n- Milestone 1 (30%): Project Kickoff & UI Wireframes.\n- Milestone 2 (40%): Core Modules & Integration.\n- Milestone 3 (30%): Final Testing & Production Launch.`,
      termsAndConditions: `### 📄 Standard Terms\n1. Includes 90 days complimentary support.\n2. Full source code ownership upon final invoice settlement.`,
      companyDetailsDoc: `### 🏢 Speshway Solutions\nWebsite: www.speshway.com | Email: info@speshway.com | Phone: +91 91000 06020`,
      features: scopeItems.map((item, idx) => ({
        title: item,
        module: "Core Architecture",
        description: `Delivers ${item} module functionality.`,
        priority: idx === 0 ? "Critical" : "High"
      }))
    };

    setCustomPresets(prev => [newPreset, ...prev]);
    setIsCreateModalOpen(false);

    // Reset form
    setPresetTitle("");
    setOverviewNarrative("");
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    if (!confirm("Are you sure you want to delete this custom proposal preset?")) return;
    setCustomPresets(prev => prev.filter(p => p.id !== presetId));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 border border-orange-200 font-mono tracking-wider">
              PROPOSAL PRESETS STUDIO & DRIVER
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {allPresets.length} Active Presets Available
            </span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-[#1a0f00] mt-1.5 flex items-center gap-2">
            Proposal Quotation Presets Studio
          </h1>
          <p className="text-xs text-gray-500 max-w-3xl mt-0.5 leading-relaxed">
            Select a proposal variant to generate <strong>All 8 Proposal Sections</strong> for any showcase project, or build new custom proposal presets with pre-configured scope, pricing tiers, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="sm"
            className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Proposal Preset</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTER */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search proposal presets by title or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
          />
        </div>
        
        <div className="text-xs text-gray-500 font-medium hidden sm:block">
          Showing <strong>{filteredPresets.length}</strong> of <strong>{allPresets.length}</strong> proposal templates
        </div>
      </div>

      {/* PRESET CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => {
          const isCustom = preset.id.startsWith("preset-custom-");
          const selectedProjId = selectedProjectMap[preset.id] || (ourProjects[0]?.id || "");
          const targetProject = ourProjects.find(p => p.id === selectedProjId) || ourProjects[0];

          let icon = <Globe className="w-6 h-6 text-sky-500" />;
          let badgeColor = "bg-sky-50 text-sky-700 border-sky-200";

          if (preset.variantKey === "website_app" || preset.category.includes("Ecosystem")) {
            icon = <Zap className="w-6 h-6 text-orange-500" />;
            badgeColor = "bg-orange-50 text-orange-700 border-orange-200";
          } else if (preset.variantKey === "app" || preset.category.includes("Mobile")) {
            icon = <Smartphone className="w-6 h-6 text-purple-500" />;
            badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
          }

          return (
            <div
              key={preset.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group border-t-4 border-t-orange-500"
            >
              <div className="p-6">
                
                {/* Top Badge & Delete */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 bg-gray-50 rounded-xl group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <div>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${badgeColor}`}>
                        {preset.category}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 ml-1.5">
                          CUSTOM
                        </span>
                      )}
                    </div>
                  </div>

                  {isCustom && (
                    <button
                      onClick={() => handleDeleteCustomPreset(preset.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors p-1"
                      title="Delete Custom Preset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="font-heading font-extrabold text-base text-[#1a0f00] group-hover:text-orange-600 transition-colors mb-2">
                  {preset.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4">
                  {preset.overviewNarrative}
                </p>

                {/* Pricing Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/80 rounded-xl border border-gray-100 mb-4">
                  <div className="text-center">
                    <span className="text-[9px] font-bold uppercase text-gray-400 block">Starter</span>
                    <span className="font-mono text-xs font-bold text-gray-800">₹{(preset.planAPrice / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <span className="text-[9px] font-bold uppercase text-orange-600 block">Pro</span>
                    <span className="font-mono text-xs font-bold text-orange-600">₹{(preset.planBPrice / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-bold uppercase text-gray-400 block">Enterprise</span>
                    <span className="font-mono text-xs font-bold text-gray-800">₹{(preset.planCPrice / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                {/* Scope Preview Checklist */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                    8-Section Pre-configured Scope:
                  </span>
                  {preset.planComparisonItems.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.deliverable}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* CARD FOOTER WITH TARGET PROJECT SELECTOR & ACTION */}
              <div className="p-4 bg-gray-50/60 border-t border-gray-150 space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                    Apply To:
                  </label>
                  <select
                    value={selectedProjId}
                    onChange={(e) => setSelectedProjectMap(prev => ({ ...prev, [preset.id]: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                  >
                    {ourProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.title} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (targetProject) {
                      onApplyPresetToProject(targetProject, preset);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Build All 8 Sections Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE NEW PRESET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-base text-white">Create Custom Proposal Preset</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePreset} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Preset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Content SaaS Platform & Vector RAG"
                  value={presetTitle}
                  onChange={e => setPresetTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category Classification</label>
                  <input
                    type="text"
                    value={presetCategory}
                    onChange={e => setPresetCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Average Budget (INR &#8377;)</label>
                  <input
                    type="number"
                    value={presetBudget}
                    onChange={e => setPresetBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Starter Price (&#8377;)</label>
                  <input
                    type="number"
                    value={planAPrice}
                    onChange={e => setPlanAPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-orange-600 mb-1">Pro Price (&#8377;)</label>
                  <input
                    type="number"
                    value={planBPrice}
                    onChange={e => setPlanBPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Enterprise Price (&#8377;)</label>
                  <input
                    type="number"
                    value={planCPrice}
                    onChange={e => setPlanCPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Executive Overview Narrative</label>
                <textarea
                  rows={3}
                  placeholder="Enter high-level executive overview narrative..."
                  value={overviewNarrative}
                  onChange={e => setOverviewNarrative(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Included Scope Deliverables (One per line)</label>
                <textarea
                  rows={4}
                  value={scopeInput}
                  onChange={e => setScopeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md"
                >
                  + Save Proposal Preset
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
