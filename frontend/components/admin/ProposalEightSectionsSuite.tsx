"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  ArrowLeft, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle, 
  Building2, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  Save,
  Globe,
  Zap,
  Smartphone,
  X
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import QuoteReviewModal from "./QuoteReviewModal";
import CreateProjectProposalModal from "./CreateProjectProposalModal";
import { HMS_PRESETS } from "@/lib/HMSPresets";
import { HRMS_PRESETS } from "@/lib/HRMSPresets";
import { uploadImageToS3 } from "@/lib/uploadService";
import { 
  DEFAULT_PLAN_COMPARISON_DELIVERABLES, 
  getCleanPlanComparisonItems, 
  getProjectTailoredPreset,
  triggerDirectPdfDownload 
} from "@/lib/proposalUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ProposalEightSectionsSuiteProps {
  projectId: string;
  proposalId: string;
}

export default function ProposalEightSectionsSuite({ projectId, proposalId }: ProposalEightSectionsSuiteProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [allProposals, setAllProposals] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewingQuote, setReviewingQuote] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<"exact-pdf" | "live-editor">("exact-pdf");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // File refs for section documents & logos
  const universalSectionFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);

  // Feature form states
  const [newFeatTitle, setNewFeatTitle] = useState("");
  const [newFeatModule, setNewFeatModule] = useState("Core Architecture");
  const [newFeatDesc, setNewFeatDesc] = useState("");
  const [newFeatPriority, setNewFeatPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");

  // Load project & proposals from MongoDB
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Our Project
      const projRes = await fetch(`${API_URL}/crm/our-projects`);
      const projData = await projRes.json();
      let currentProj = null;
      if (projData.success && Array.isArray(projData.data)) {
        currentProj = projData.data.find((p: any) => p.id === projectId || (p.name && p.name.toLowerCase() === projectId.toLowerCase()));
      }
      if (!currentProj) {
        currentProj = {
          id: projectId,
          name: projectId === "OPRJ-6561" ? "hms" : (projectId === "OPRJ-4838" ? "hrms" : "Build Your Thoughts"),
          title: projectId === "OPRJ-6561" ? "Hospital Management System (HMS)" : (projectId === "OPRJ-4838" ? "Human Resource Management System (HRMS)" : "Build Your Thoughts Workspace"),
          category: "Web & Mobile Ecosystem",
          clientName: "Internal / Showcase",
          budget: 185000,
          status: "Live Production",
          description: "Internal showcase project management ecosystem."
        };
      }
      setProject(currentProj);

      // 2. Fetch Proposals / Quotations
      const quoteRes = await fetch(`${API_URL}/crm/quotation`);
      const quoteData = await quoteRes.json();
      let matchingQuotes: any[] = [];
      if (quoteData.success && Array.isArray(quoteData.data)) {
        matchingQuotes = quoteData.data.filter((q: any) => 
          (q.projectId && (q.projectId === currentProj.id || q.projectId === projectId)) ||
          (q.id && (q.id === proposalId || q.number === proposalId))
        );
        setAllProposals(matchingQuotes);
      }

      const targetQuote = matchingQuotes.find(q => q.id === proposalId || q.number === proposalId);

      const titleOrType = ((targetQuote?.title || "") + " " + (targetQuote?.projectType || "")).toLowerCase();
      let variantKey: "website" | "website_app" | "app" = "website_app";
      if (titleOrType.includes("app") && !titleOrType.includes("website") && !titleOrType.includes("web & mobile")) {
        variantKey = "app";
      } else if ((titleOrType.includes("website") || titleOrType.includes("web portal")) && !titleOrType.includes("app") && !titleOrType.includes("mobile")) {
        variantKey = "website";
      }

      const preset = getProjectTailoredPreset(currentProj, variantKey);

      const defaultQuote = {
        id: proposalId || `QT-${currentProj.id}`,
        number: proposalId || `QT-${currentProj.id}`,
        projectId: currentProj.id,
        title: `${currentProj.name || currentProj.title} Proposal Workspace`,
        clientName: currentProj.clientName || "Enterprise Client",
        projectName: currentProj.name || currentProj.title,
        projectType: preset ? preset.category : (currentProj.category || "Web Application"),
        planAPrice: preset ? preset.planAPrice : 60000,
        planBPrice: preset ? preset.planBPrice : 110000,
        planCPrice: preset ? preset.planCPrice : 210000,
        currency: "Indian Rupees (INR)",
        planComparisonItems: preset ? preset.planComparisonItems : DEFAULT_PLAN_COMPARISON_DELIVERABLES,
        overviewNarrative: preset ? preset.overviewNarrative : (currentProj.description || ""),
        userRoles: preset ? preset.rolesMatrix.map((r, i) => ({ id: String(i + 1), title: r.role, description: r.description, count: r.count, permissions: r.permissions })) : [
          { id: "1", title: "Customer Portal User", description: "Customer portal & cart checkout." },
          { id: "2", title: "Merchant / Seller Portal User", description: "Merchant portal & booking management." },
          { id: "3", title: "Super Admin Portal User", description: "Admin panel & ecosystem governance." }
        ],
        customerDesc: preset ? preset.customerDesc : "Customer portal & cart checkout.",
        merchantDesc: preset ? preset.merchantDesc : "Merchant portal & booking management.",
        adminDesc: preset ? preset.adminDesc : "Super Admin portal governance.",
        paymentTerms: preset ? preset.paymentTerms : "40% advance on project kick-off\n30% on completion of core module\n30% on final delivery",
        termsAndConditions: preset ? preset.termsAndConditions : "Estimation valid for 30 days.\nIncludes 30 days complimentary bug-fix support.\nSource code handed over upon full payment.",
        companyName: "Speshway Solutions",
        companyTagline: "Website & App Development Company | Hyderabad, India",
        companyEmail: "info@speshway.com",
        companyPhone: "+91 91000 06020",
        companyWebsite: "www.speshway.com",
        companyGstin: "36AAAAA0000A1Z5",
        companyAddress: "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India",
        companyLogoUrl: "",
        companyWatermarkUrl: "",
        companyWatermarkText: "SPESHWAY SOLUTIONS",
        companyWatermarkOpacity: 0.15,
        companyWatermarkContrast: 150,
        companyWatermarkGrayscale: true,
        companyWatermarkRotation: -25,
        pdfPrimaryColor: "#ea580c",
        pdfSecondaryColor: "#f97316",
        status: "Approved"
      };

      const mergedQuote = targetQuote ? {
        ...defaultQuote,
        ...targetQuote,
        id: targetQuote.id || proposalId,
        number: targetQuote.number || targetQuote.id || proposalId,
        title: targetQuote.title || defaultQuote.title,
        projectType: targetQuote.projectType || defaultQuote.projectType,
        overviewNarrative: targetQuote.overviewNarrative ? targetQuote.overviewNarrative : defaultQuote.overviewNarrative,
        userRoles: targetQuote.userRoles && targetQuote.userRoles.length > 0 ? targetQuote.userRoles : defaultQuote.userRoles,
        planAPrice: targetQuote.planAPrice !== undefined ? targetQuote.planAPrice : defaultQuote.planAPrice,
        planBPrice: targetQuote.planBPrice !== undefined ? targetQuote.planBPrice : defaultQuote.planBPrice,
        planComparisonItems: targetQuote.planComparisonItems && targetQuote.planComparisonItems.length > 0 ? targetQuote.planComparisonItems : defaultQuote.planComparisonItems,
        paymentTerms: targetQuote.paymentTerms ? targetQuote.paymentTerms : defaultQuote.paymentTerms,
        termsAndConditions: targetQuote.termsAndConditions ? targetQuote.termsAndConditions : defaultQuote.termsAndConditions
      } : defaultQuote;

      setProposal(mergedQuote);

      // 3. Fetch Features
      const featRes = await fetch(`${API_URL}/crm/feature`);
      const featData = await featRes.json();
      if (featData.success && Array.isArray(featData.data)) {
        setFeatures(featData.data);
      }
    } catch (err) {
      console.error("Error loading proposal 8 sections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, proposalId]);

  // Update proposal state helper
  const updateProposalField = (updatedFields: Record<string, any>) => {
    setProposal((prev: any) => ({ ...prev, ...updatedFields }));
  };

  // Save proposal to MongoDB
  const saveProposalToDb = async (updatedFields: Record<string, any> = {}) => {
    const mergedProposal = { ...proposal, ...updatedFields };
    const pId = mergedProposal.id || mergedProposal.number || proposalId;

    try {
      await fetch(`${API_URL}/crm/quotation/${pId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedProposal)
      });
      setProposal(mergedProposal);
    } catch (err) {
      console.error("Error saving proposal section:", err);
    }
  };

  // Preset Application
  const applyPreset = async (presetKey: "website" | "website_app" | "app") => {
    if (!project) return;
    const isHRMS = (project?.name && project.name.toLowerCase() === "hrms") || project?.id === "OPRJ-4838";
    const preset = isHRMS ? HRMS_PRESETS[presetKey] : HMS_PRESETS[presetKey];
    if (!preset) return;

    const projectTypesMap: Record<string, string[]> = {
      website: ["Web Application"],
      website_app: ["Web Application", "Mobile Application (iOS & Android)"],
      app: ["Mobile Application (iOS & Android)"]
    };

    const updatedFields = {
      projectTypes: projectTypesMap[presetKey],
      projectType: preset.category,
      title: `${project.name || project.title} ${preset.title}`,
      overviewNarrative: preset.overviewNarrative,
      userRoles: preset.rolesMatrix.map((r, i) => ({ id: String(i + 1), title: r.role, description: r.description, count: r.count, permissions: r.permissions })),
      customerDesc: preset.customerDesc,
      merchantDesc: preset.merchantDesc,
      adminDesc: preset.adminDesc,
      planAPrice: preset.planAPrice,
      planBPrice: preset.planBPrice,
      planCPrice: preset.planCPrice,
      planComparisonItems: preset.planComparisonItems,
      paymentTerms: preset.paymentTerms,
      termsAndConditions: preset.termsAndConditions,
      companyDetailsDoc: preset.companyDetailsDoc
    };

    await saveProposalToDb(updatedFields);
  };

  // Universal File Upload Handler
  const handleUniversalSectionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const updatedFields: Record<string, any> = {};
      if (activeTab === "overview" || activeTab === "all") updatedFields.overviewNarrative = text;
      if (activeTab === "payment-terms") updatedFields.paymentTerms = text;
      if (activeTab === "terms-conditions") updatedFields.termsAndConditions = text;
      if (activeTab === "company-details") updatedFields.companyDetailsDoc = text;

      await saveProposalToDb(updatedFields);
      alert(`Successfully uploaded '${file.name}' to ${activeTab.toUpperCase()} section!`);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  // PDF Generator HTML Builder
  const generatePdfHtml = () => {
    const projName = project?.name || proposal?.projectName || "Showcase Project";
    const clientName = proposal?.clientName || project?.clientName || "Speshway Showcase";
    const docTitle = proposal?.title || "Project Proposal Document";
    const docRef = proposal?.number || proposal?.id || `SPW/PROP/${projName.toUpperCase()}/2026`;
    const items = (proposal?.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [
      { description: `${projName} Core Scope Deliverables Suite`, qty: 1, rate: proposal?.planBPrice || proposal?.planAPrice || 60000 }
    ];
    const totalAmount = items.reduce((sum: number, it: any) => sum + ((it.qty || 1) * (it.rate || 0)), 0);

    return `
      <div class="pdf-page" style="padding: 40px; font-family: sans-serif; color: #1a0f00; background: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ea580c; padding-bottom: 15px; margin-bottom: 25px;">
          <div>
            <h1 style="margin: 0; font-size: 20px; color: #ea580c; font-weight: 800;">${docTitle}</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">Quotation Reference: <strong>${docRef}</strong> &bull; Client: <strong>${clientName}</strong></p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111;">Speshway Solutions</p>
            <p style="margin: 2px 0 0 0; font-size: 10px; color: #888;">Hyderabad, India</p>
          </div>
        </div>

        <h3 style="font-size: 13px; color: #ea580c; border-bottom: 1px solid #eee; padding-bottom: 5px;">1. Executive Summary Narrative</h3>
        <p style="font-size: 11px; line-height: 1.6; color: #444;">${proposal?.overviewNarrative || 'No overview provided.'}</p>

        <h3 style="font-size: 13px; color: #ea580c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">2. User Roles & Access Architecture</h3>
        <ul style="font-size: 11px; color: #444; line-height: 1.5;">
          ${(proposal?.userRoles || []).map((r: any) => `<li><strong>${r.title}:</strong> ${r.description}</li>`).join('')}
        </ul>

        <h3 style="font-size: 13px; color: #ea580c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">3. Itemized Proposal Quotation Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px;">
          <thead>
            <tr style="background: #fff7ed; color: #ea580c;">
              <th style="border: 1px solid #fed7aa; padding: 8px; text-align: left;">Quotation Service Item</th>
              <th style="border: 1px solid #fed7aa; padding: 8px; text-align: center; width: 50px;">Qty</th>
              <th style="border: 1px solid #fed7aa; padding: 8px; text-align: right; width: 100px;">Rate (₹)</th>
              <th style="border: 1px solid #fed7aa; padding: 8px; text-align: right; width: 120px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((it: any) => `
              <tr>
                <td style="border: 1px solid #eee; padding: 8px; font-weight: bold; color: #333;">${it.description}</td>
                <td style="border: 1px solid #eee; padding: 8px; text-align: center;">${it.qty || 1}</td>
                <td style="border: 1px solid #eee; padding: 8px; text-align: right;">₹${(it.rate || 0).toLocaleString()}</td>
                <td style="border: 1px solid #eee; padding: 8px; text-align: right; font-weight: bold;">₹${((it.qty || 1) * (it.rate || 0)).toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr style="background: #fafafa; font-weight: bold;">
              <td colspan="3" style="border: 1px solid #eee; padding: 8px; text-align: right;">Total Quotation Amount:</td>
              <td style="border: 1px solid #eee; padding: 8px; text-align: right; color: #ea580c; font-size: 12px;">₹${totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <h3 style="font-size: 13px; color: #ea580c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">4. Milestone Payment Schedule & Terms</h3>
        <pre style="font-size: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-family: inherit; color: #334155;">${proposal?.paymentTerms || ''}</pre>
      </div>
    `;
  };

  const proposalTabs = [
    { id: "all", label: "🌟 All 8 Sections (Full Master Page)", icon: "✨", page: "PDF Pages 1-4" },
    { id: "overview", label: "1. Overview & Project Type", icon: "📄", page: "PDF Page 1" },
    { id: "user-roles", label: "2. User Access & Roles", icon: "👥", page: "PDF Page 1" },
    { id: "features", label: "3. Features & Scope", icon: "⚡", page: "PDF Page 2" },
    { id: "investment-plans", label: "4. Investment Plans", icon: "💰", page: "PDF Page 3" },
    { id: "plan-comparison", label: "5. Plan Comparison", icon: "📊", page: "PDF Page 3" },
    { id: "payment-terms", label: "6. Payment Terms", icon: "💳", page: "PDF Page 4" },
    { id: "terms-conditions", label: "7. Terms & Conditions", icon: "📜", page: "PDF Page 4" },
    { id: "company-details", label: "8. Company Details", icon: "🏢", page: "PDF Header" }
  ];

  if (isLoading || !proposal) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading 8 Proposal Sections Workspace...</p>
      </div>
    );
  }

  const projName = project?.name || project?.title || projectId;

  return (
    <div className="w-full min-h-[90vh] bg-slate-50 flex flex-col">
      
      {/* HIDDEN UNIVERSAL SECTION FILE INPUT */}
      <input 
        type="file" 
        ref={universalSectionFileInputRef} 
        accept=".txt,.json,.csv,.doc,.docx,.pdf" 
        onChange={(e) => {
          handleUniversalSectionFileUpload(e);
          if (e.target) e.target.value = "";
        }} 
        className="hidden" 
      />

      {/* TOP HEADER BREADCRUMB & TOOLBAR */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-wrap gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/admin/our-projects/${project.id}/proposals`)}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
            title="Back to Proposals List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <span className="cursor-pointer hover:text-orange-600" onClick={() => router.push("/admin/dashboard?tab=our-projects")}>Our Projects</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-orange-600 font-mono" onClick={() => router.push(`/admin/our-projects/${project.id}/proposals`)}>{project.id}</span>
              <span>/</span>
              <span className="text-orange-600 font-extrabold">{proposal.id || proposal.number}</span>
            </div>
            <h1 className="font-heading font-extrabold text-lg text-[#1a0f00] flex items-center gap-2 mt-0.5">
              <span>{proposal.title || `${projName} Proposal`}</span>
              <span className="text-[9px] font-mono font-extrabold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full uppercase">
                {proposal.status || "APPROVED"}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setReviewingQuote(proposal)}
            variant="primary"
            size="sm"
            className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-md border-0 flex items-center gap-1.5"
          >
            <Eye size={14} />
            <span>Review PDF Proposal</span>
          </Button>

          <Button
            onClick={() => {
              const html = generatePdfHtml();
              triggerDirectPdfDownload(html, `${projName.replace(/[^a-zA-Z0-9]/g, '_')}_Proposal.pdf`);
            }}
            variant="secondary"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-3.5 rounded-xl border border-gray-200 flex items-center gap-1.5"
          >
            <Download size={14} className="text-orange-600" />
            <span>Download PDF Report</span>
          </Button>

          <Button
            onClick={() => router.push(`/admin/our-projects/${project.id}/proposals`)}
            variant="secondary"
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 px-3.5 rounded-xl border border-gray-200"
          >
            Exit Workspace
          </Button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR: 8 SECTIONS NAVIGATION */}
        <aside className="w-full md:w-80 bg-white text-gray-700 flex flex-col justify-between shrink-0 p-5 border-r border-gray-200 overflow-y-auto">
          <div className="space-y-6">
            
            {/* PROJECT BADGE */}
            <div className="border-b border-gray-150 pb-4">
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-wider block">
                {project.id} &bull; PROPOSAL WORKSPACE
              </span>
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base mt-1 line-clamp-1">
                {projName}
              </h3>
              <span className="text-xs text-gray-500 block mt-0.5">
                Client: {proposal.clientName || project.clientName || "Enterprise Client"}
              </span>
            </div>

            {/* 8 SECTIONS TABS */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2 mb-2">
                PROPOSAL PAGES (8 SECTIONS)
              </span>
              {proposalTabs.map(t => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all ${
                      isActive
                        ? "bg-orange-600 text-white shadow-md shadow-orange-500/10 scale-[1.02]" 
                        : "text-gray-600 hover:text-[#1a0f00] hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{t.icon}</span>
                      <span className="font-semibold tracking-wide text-[11px]">{t.label}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                      isActive ? "bg-orange-700/40 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {t.page}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM QUICK ACTIONS */}
          <div className="pt-4 border-t border-gray-150 space-y-2 mt-4">
            <button
              onClick={() => universalSectionFileInputRef.current?.click()}
              className="w-full bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Upload size={14} />
              <span>Upload Section Document</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN EDITOR CANVAS */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* SECTION HEADER BAR */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 flex-wrap gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                ACTIVE SECTION PAGE: {activeTab === "all" ? "ALL 8 PROPOSAL SECTIONS (FULL MASTER VIEW)" : activeTab.toUpperCase().replace('-', ' ')}
              </span>
              <h2 className="text-xl font-heading font-extrabold text-[#1a0f00] mt-1.5">
                {activeTab === "all" && "Complete Proposal Workspace — All 8 Proposal Sections"}
                {activeTab === "overview" && "1. Project Overview & Type Configuration"}
                {activeTab === "user-roles" && "2. Target User Roles & Access Architecture"}
                {activeTab === "features" && "3. Technical Scope & Feature Deliverables"}
                {activeTab === "investment-plans" && "4. Commercial Investment Plans"}
                {activeTab === "plan-comparison" && "5. Detailed Feature Comparison Matrix"}
                {activeTab === "payment-terms" && "6. Milestone Payment Schedule & Terms"}
                {activeTab === "terms-conditions" && "7. Support & Project Terms and Conditions"}
                {activeTab === "company-details" && "8. Company Details & Proposal Branding"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => saveProposalToDb()}
                variant="primary"
                size="sm"
                className="bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-md border-0 flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>

          {/* 1. OVERVIEW & PROJECT TYPE SECTION */}
          {(activeTab === "all" || activeTab === "overview") && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] flex items-center gap-2">
                  <FileText size={16} className="text-orange-600" />
                  <span>1. Executive Summary & Project Type</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">PDF Page 1</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Executive Overview Narrative
                </label>
                <textarea
                  rows={4}
                  value={proposal.overviewNarrative || ""}
                  onChange={(e) => updateProposalField({ overviewNarrative: e.target.value })}
                  onBlur={() => saveProposalToDb()}
                  placeholder="Outline comprehensive project overview narrative for proposal..."
                  className="w-full p-3.5 text-xs font-medium text-gray-800 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* 2. USER ACCESS & ROLES SECTION */}
          {(activeTab === "all" || activeTab === "user-roles") && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] flex items-center gap-2">
                  <Building2 size={16} className="text-orange-600" />
                  <span>2. Target User Roles & Access Matrix</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">PDF Page 1</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(proposal.userRoles || []).map((role: any, idx: number) => (
                  <div key={role.id || idx} className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[9px] font-mono font-extrabold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">
                      ROLE #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={role.title || ""}
                      onChange={(e) => {
                        const copy = [...proposal.userRoles];
                        copy[idx].title = e.target.value;
                        updateProposalField({ userRoles: copy });
                      }}
                      onBlur={() => saveProposalToDb()}
                      className="w-full font-bold text-xs text-[#1a0f00] bg-white px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none"
                    />
                    <textarea
                      rows={2}
                      value={role.description || ""}
                      onChange={(e) => {
                        const copy = [...proposal.userRoles];
                        copy[idx].description = e.target.value;
                        updateProposalField({ userRoles: copy });
                      }}
                      onBlur={() => saveProposalToDb()}
                      className="w-full text-[11px] text-gray-600 bg-white p-2 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INVESTMENT PLANS SECTION */}
          {(activeTab === "all" || activeTab === "investment-plans") && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] flex items-center gap-2">
                  <Layers size={16} className="text-orange-600" />
                  <span>4. Commercial Investment Pricing Plans</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">PDF Page 3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-orange-700 uppercase">Plan A: Web Application</span>
                    <span className="text-xs font-mono font-bold text-orange-600">INR (₹)</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Plan Price</label>
                    <input
                      type="number"
                      value={proposal.planAPrice || 0}
                      onChange={(e) => updateProposalField({ planAPrice: Number(e.target.value) })}
                      onBlur={() => saveProposalToDb()}
                      className="w-full p-2.5 font-bold text-sm text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-purple-700 uppercase">Plan B: Hybrid Web + Mobile</span>
                    <span className="text-xs font-mono font-bold text-purple-600">INR (₹)</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Plan Price</label>
                    <input
                      type="number"
                      value={proposal.planBPrice || 0}
                      onChange={(e) => updateProposalField({ planBPrice: Number(e.target.value) })}
                      onBlur={() => saveProposalToDb()}
                      className="w-full p-2.5 font-bold text-sm text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ITEMISED QUOTATION LINE ITEMS TABLE */}
              <div className="mt-6 border-t border-gray-150 pt-5 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1a0f00] uppercase tracking-wider flex items-center gap-2">
                      <FileText size={14} className="text-orange-600" />
                      <span>Dedicated Proposal Quotation Line Items</span>
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Configure itemized service rates and quantities specifically for this proposal quotation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = proposal.serviceItems && proposal.serviceItems.length > 0 ? proposal.serviceItems : [
                        { description: `${projName} Custom Scope Deliverable`, qty: 1, rate: 25000 }
                      ];
                      const updatedItems = [...currentItems, { description: "New Quotation Service Line Item", qty: 1, rate: 15000 }];
                      updateProposalField({ serviceItems: updatedItems });
                      saveProposalToDb({ serviceItems: updatedItems });
                    }}
                    className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold rounded-xl border border-orange-200 flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} />
                    <span>+ Add Quotation Line Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-slate-50 border border-gray-200 rounded-2xl p-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-100/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-3">Service / Deliverable Description</th>
                        <th className="p-3 w-24 text-center">Qty</th>
                        <th className="p-3 w-36 text-right">Unit Rate (₹)</th>
                        <th className="p-3 w-36 text-right">Line Total (₹)</th>
                        <th className="p-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {((proposal.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [
                        { description: `${projName} Scope Deliverable`, qty: 1, rate: proposal.planBPrice || proposal.planAPrice || 60000 }
                      ]).map((item: any, idx: number) => {
                        const lineTotal = (item.qty || 1) * (item.rate || 0);
                        return (
                          <tr key={idx} className="border-b border-gray-200/70 bg-white hover:bg-slate-50/50">
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={item.description || ""}
                                onChange={(e) => {
                                  const copy = [...((proposal.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [{ description: `${projName} Scope Deliverable`, qty: 1, rate: 60000 }])];
                                  copy[idx].description = e.target.value;
                                  updateProposalField({ serviceItems: copy });
                                }}
                                onBlur={() => saveProposalToDb()}
                                className="w-full text-xs font-bold text-[#1a0f00] p-2 border border-gray-200 rounded-xl outline-none"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                value={item.qty || 1}
                                onChange={(e) => {
                                  const copy = [...((proposal.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [{ description: `${projName} Scope Deliverable`, qty: 1, rate: 60000 }])];
                                  copy[idx].qty = Number(e.target.value);
                                  updateProposalField({ serviceItems: copy });
                                }}
                                onBlur={() => saveProposalToDb()}
                                className="w-full text-xs font-mono font-bold text-center p-2 border border-gray-200 rounded-xl outline-none"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                value={item.rate || 0}
                                onChange={(e) => {
                                  const copy = [...((proposal.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [{ description: `${projName} Scope Deliverable`, qty: 1, rate: 60000 }])];
                                  copy[idx].rate = Number(e.target.value);
                                  updateProposalField({ serviceItems: copy });
                                }}
                                onBlur={() => saveProposalToDb()}
                                className="w-full text-xs font-mono font-bold text-right p-2 border border-gray-200 rounded-xl outline-none"
                              />
                            </td>
                            <td className="p-2.5 text-right font-mono font-extrabold text-[#1a0f00]">
                              ₹{lineTotal.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...((proposal.serviceItems && proposal.serviceItems.length > 0) ? proposal.serviceItems : [{ description: `${projName} Scope Deliverable`, qty: 1, rate: 60000 }])];
                                  copy.splice(idx, 1);
                                  updateProposalField({ serviceItems: copy });
                                  saveProposalToDb({ serviceItems: copy });
                                }}
                                className="text-gray-300 hover:text-red-600 p-1.5 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. PAYMENT TERMS SECTION */}
          {(activeTab === "all" || activeTab === "payment-terms") && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] flex items-center gap-2">
                  <CheckCircle size={16} className="text-orange-600" />
                  <span>6. Payment Schedule & Terms</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">PDF Page 4</span>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={proposal.paymentTerms || ""}
                  onChange={(e) => updateProposalField({ paymentTerms: e.target.value })}
                  onBlur={() => saveProposalToDb()}
                  placeholder="Define payment milestones e.g. 40% Advance, 30% Milestone 1..."
                  className="w-full p-3.5 text-xs font-mono text-gray-800 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* 7. TERMS & CONDITIONS SECTION */}
          {(activeTab === "all" || activeTab === "terms-conditions") && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-heading font-extrabold text-sm text-[#1a0f00] flex items-center gap-2">
                  <ShieldCheck size={16} className="text-orange-600" />
                  <span>7. Terms & Conditions</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">PDF Page 4</span>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={proposal.termsAndConditions || ""}
                  onChange={(e) => updateProposalField({ termsAndConditions: e.target.value })}
                  onBlur={() => saveProposalToDb()}
                  placeholder="Terms and conditions..."
                  className="w-full p-3.5 text-xs font-mono text-gray-800 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PDF REVIEW MODAL */}
      {reviewingQuote && (
        <QuoteReviewModal
          reviewingQuote={reviewingQuote}
          setReviewingQuote={setReviewingQuote}
          reviewMode={reviewMode}
          setReviewMode={setReviewMode}
          reviewerNotes={reviewerNotes}
          setReviewerNotes={setReviewerNotes}
          features={features}
          activeProjectDetail={project}
          getCleanPlanComparisonItems={getCleanPlanComparisonItems}
          defaultPlanComparisonDeliverables={DEFAULT_PLAN_COMPARISON_DELIVERABLES}
          generateSpeshwayEstimationPdfHtml={() => generatePdfHtml()}
          triggerDirectPdfDownload={triggerDirectPdfDownload}
          handleSaveQuotationSection={async (qId, fields) => saveProposalToDb(fields)}
          handleApproveQuotation={async () => saveProposalToDb({ status: "Approved" })}
        />
      )}

    </div>
  );
}
