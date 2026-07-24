"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  ArrowLeft, 
  Globe, 
  Zap, 
  Smartphone, 
  CheckCircle, 
  Sparkles,
  FileText,
  Building2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getProjectTailoredPreset } from "@/lib/proposalUtils";
import { HMS_PRESETS } from "@/lib/HMSPresets";
import { HRMS_PRESETS } from "@/lib/HRMSPresets";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function CreateProposalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "OPRJ-6561";

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proposalTitle, setProposalTitle] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<"website" | "website_app" | "app">("website_app");

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/crm/our-projects`);
        const data = await res.json();
        let currentProj = null;
        if (data.success && Array.isArray(data.data)) {
          currentProj = data.data.find((p: any) => p.id === projectId || (p.name && p.name.toLowerCase() === projectId.toLowerCase()));
        }
        if (!currentProj) {
          currentProj = {
            id: projectId,
            name: projectId === "OPRJ-6561" ? "hms" : (projectId === "OPRJ-4838" ? "hrms" : "Build Your Thoughts"),
            title: projectId === "OPRJ-6561" ? "Hospital Management System (HMS)" : (projectId === "OPRJ-4838" ? "Human Resource Management System (HRMS)" : "Build Your Thoughts Workspace"),
            category: "Web & Mobile Ecosystem",
            clientName: "Internal Showcase",
            description: "Enterprise software project scope."
          };
        }
        setProject(currentProj);
        setProposalTitle(`${currentProj.name || currentProj.title} Custom Proposal`);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const projName = project?.name || project?.title || projectId;
    const preset = getProjectTailoredPreset(project, selectedVariant);
    const newQuoteId = `QT-${project.id || "PROJ"}-${Date.now().toString().slice(-4)}`;

    const projectTypesMap: Record<string, string[]> = {
      website: ["Web Application"],
      website_app: ["Web Application", "Mobile Application (iOS & Android)"],
      app: ["Mobile Application (iOS & Android)"]
    };

    const newProposalPayload = {
      id: newQuoteId,
      number: newQuoteId,
      projectId: project.id,
      projectName: projName,
      clientName: project.clientName || "Enterprise Client",
      title: proposalTitle.trim(),
      projectTypes: projectTypesMap[selectedVariant],
      projectType: preset.category,
      overviewNarrative: preset.overviewNarrative,
      userRoles: preset.rolesMatrix.map((r, i) => ({ id: String(i + 1), title: r.role, description: r.description, count: r.count, permissions: r.permissions })),
      customerDesc: preset.customerDesc,
      merchantDesc: preset.merchantDesc,
      adminDesc: preset.adminDesc,
      planAPrice: preset.planAPrice,
      planBPrice: preset.planBPrice,
      planCPrice: preset.planCPrice,
      serviceItems: preset.serviceItems,
      planComparisonItems: preset.planComparisonItems,
      paymentTerms: preset.paymentTerms,
      termsAndConditions: preset.termsAndConditions,
      companyDetailsDoc: preset.companyDetailsDoc,
      status: "Approved",
      createdDate: new Date().toISOString().split("T")[0]
    };

    try {
      await fetch(`${API_URL}/crm/quotation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProposalPayload)
      });
    } catch (err) {
      console.error("Error creating proposal:", err);
    } finally {
      // Navigate to the newly created proposal 8 sections page or proposals list
      router.push(`/admin/our-projects/${project.id}/proposals/${newQuoteId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading Create Proposal Page...</p>
      </div>
    );
  }

  const projName = project?.name || project?.title || projectId;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <button 
            onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
            className="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Proposals</span>
          </button>
          <span>/</span>
          <span className="text-gray-700 font-mono">{projectId}</span>
          <span>/</span>
          <span className="text-orange-600">Create Proposal</span>
        </div>

        <Button
          onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
          variant="secondary"
          size="sm"
          className="gap-1.5 text-xs font-bold"
        >
          <ArrowLeft size={14} /> Back to Proposals
        </Button>
      </div>

      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white shadow-xl border border-orange-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30 text-orange-400">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
              {projectId} &bull; NEW PROPOSAL PAGE
            </span>
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-white">
              Create Proposal Name for {projName}
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              Fill out proposal parameters and select a starting template preset below.
            </p>
          </div>
        </div>
      </div>

      {/* CREATE FORM CANVAS PAGE */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Proposal Title Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HMS Enterprise Multi-Hospital Proposal"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              This name will be displayed on the proposals CRUD dashboard and PDF cover page headers.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Select Starting Preset Variant Template
            </label>

            <div className="grid grid-cols-1 gap-3.5">
              {[
                {
                  key: "website" as const,
                  icon: <Globe className="w-6 h-6 text-sky-500" />,
                  title: "Website Only",
                  desc: "Web Portal, EMR Workstation, OPD/IPD Billing & Admin Control Panel."
                },
                {
                  key: "website_app" as const,
                  icon: <Zap className="w-6 h-6 text-orange-500" />,
                  title: "Website + App (Hybrid Ecosystem)",
                  desc: "Web Workstation + iOS & Android Patient/Doctor Mobile Apps with FCM Push Alerts."
                },
                {
                  key: "app" as const,
                  icon: <Smartphone className="w-6 h-6 text-purple-500" />,
                  title: "App Only",
                  desc: "Native iOS & Android Mobile Apps with QR check-in & camera document scanner."
                }
              ].map((varItem) => {
                const isSelected = selectedVariant === varItem.key;
                return (
                  <div
                    key={varItem.key}
                    onClick={() => setSelectedVariant(varItem.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? "bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-3 bg-white rounded-xl border border-gray-150 shadow-xs">
                      {varItem.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-extrabold text-sm text-[#1a0f00] flex items-center justify-between">
                        <span>{varItem.title}</span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-orange-600" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{varItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
              className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Proposal..." : "Create PROPOSAL PAGES (8 SECTIONS)"}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
