"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Upload, ArrowLeft, Eye, Download, FileText, CheckCircle, Building2, Sparkles, Layers, ShieldCheck } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

interface ProjectDetailModalProps {
  activeProjectDetail: any;
  setActiveProjectDetail: (val: any) => void;
  activeProjectTab: string;
  setActiveProjectTab: (val: string) => void;
  quotations: any[];
  setQuotations: React.Dispatch<React.SetStateAction<any[]>>;
  features: any[];
  setFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  setReviewingQuote: (val: any) => void;
  API_URL: string;
  loadDatabase: () => Promise<void>;
  defaultPlanComparisonDeliverables: any[];
  getCleanPlanComparisonItems: (items: any) => any[];
  generateSpeshwayEstimationPdfHtml: (proj: any, quote: any, feats: any) => string;
  triggerDirectPdfDownload: (html: string, filename: string) => void;
  universalSectionFileInputRef: React.RefObject<HTMLInputElement>;
  activeSectionToUpload: string;
  setActiveSectionToUpload: (val: string) => void;
  handleUniversalSectionFileUpload: (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, quote: any) => void;
  handleSaveQuotationSection: (quoteId: string, updatedFields: any) => Promise<void>;
}

export default function ProjectDetailModal({
  activeProjectDetail,
  setActiveProjectDetail,
  activeProjectTab,
  setActiveProjectTab,
  quotations,
  setQuotations,
  features,
  setFeatures,
  setReviewingQuote,
  API_URL,
  loadDatabase,
  defaultPlanComparisonDeliverables,
  getCleanPlanComparisonItems,
  generateSpeshwayEstimationPdfHtml,
  triggerDirectPdfDownload,
  universalSectionFileInputRef,
  activeSectionToUpload,
  setActiveSectionToUpload,
  handleUniversalSectionFileUpload,
  handleSaveQuotationSection
}: ProjectDetailModalProps) {
  // Inline feature form states
  const [newFeatTitle, setNewFeatTitle] = useState("");
  const [newFeatModule, setNewFeatModule] = useState("Core Architecture");
  const [newFeatDesc, setNewFeatDesc] = useState("");
  const [newFeatPriority, setNewFeatPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [isAddingFeat, setIsAddingFeat] = useState(false);
  // Logo & Watermark file upload handlers
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        updateQuoteField({ companyLogoUrl: base64Url });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWatermarkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        updateQuoteField({ companyWatermarkUrl: base64Url });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!activeProjectDetail) return null;

  const foundQuote = quotations.find(q => 
    (q.projectId && q.projectId === activeProjectDetail.id) || 
    (q.projectName && activeProjectDetail.name && q.projectName.toLowerCase() === activeProjectDetail.name.toLowerCase()) ||
    (q.id && q.id === `QT-${activeProjectDetail.id}`)
  );

  const defaultQuote = {
    id: `QT-${activeProjectDetail.id || "0001"}`,
    number: `QT-${activeProjectDetail.id || "0001"}`,
    projectId: activeProjectDetail.id,
    title: `${activeProjectDetail.name || activeProjectDetail.title} Custom Estimation Proposal`,
    clientName: activeProjectDetail.clientName || "Enterprise Client",
    projectName: activeProjectDetail.name || activeProjectDetail.title,
    projectType: activeProjectDetail.category || "Web Application",
    planAPrice: 60000,
    planBPrice: 110000,
    currency: "Indian Rupees (INR)",
    planComparisonItems: defaultPlanComparisonDeliverables,
    overviewNarrative: activeProjectDetail.description || "",
    userRoles: [
      { id: "1", title: "Customer Portal User", description: "Customer portal & cart checkout." },
      { id: "2", title: "Merchant / Seller Portal User", description: "Merchant portal & booking management." },
      { id: "3", title: "Super Admin Portal User", description: "Admin panel & ecosystem governance." }
    ],
    customerDesc: "Customer portal & cart checkout.",
    merchantDesc: "Merchant portal & booking management.",
    adminDesc: "Admin panel & ecosystem governance.",
    paymentTerms: "40% advance on project kick-off\n30% on completion of core module\n30% on final delivery",
    termsAndConditions: "Estimation valid for 30 days.\nIncludes 30 days complimentary bug-fix support.\nSource code handed over upon full payment.",
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
    pdfPrimaryColor: "#4c1d95",
    pdfSecondaryColor: "#7c3aed",
    status: "Approved"
  };

  const activeQuote = foundQuote ? { ...defaultQuote, ...foundQuote } : defaultQuote;

  const updateQuoteField = (updatedFields: Record<string, any>) => {
    setQuotations(prev => {
      const matchIdx = prev.findIndex(q => 
        q.id === activeQuote.id || 
        (q as any).number === activeQuote.id || 
        q.projectId === activeProjectDetail.id ||
        (activeProjectDetail.name && q.projectName === activeProjectDetail.name)
      );
      const mergedQuote = { ...activeQuote, ...updatedFields };
      if (matchIdx !== -1) {
        const copy = [...prev];
        copy[matchIdx] = mergedQuote;
        return copy;
      } else {
        return [mergedQuote, ...prev];
      }
    });
  };

  const saveQuoteSection = async (updatedFields: Record<string, any>) => {
    const mergedQuote = { ...activeQuote, ...updatedFields };
    updateQuoteField(updatedFields);
    await handleSaveQuotationSection(activeQuote.id || activeQuote.number, mergedQuote);
  };

  const activeCompItems = getCleanPlanComparisonItems(activeQuote.planComparisonItems);

  const activeUserRoles = activeQuote.userRoles && activeQuote.userRoles.length > 0
    ? activeQuote.userRoles
    : [
        { id: "1", title: "Customer Portal User", description: activeQuote.customerDesc || "Customer portal & cart checkout." },
        { id: "2", title: "Merchant / Seller Portal User", description: activeQuote.merchantDesc || "Merchant portal & booking management." },
        { id: "3", title: "Super Admin Portal User", description: activeQuote.adminDesc || "Admin panel & ecosystem governance." }
      ];

  const proposalTabs = [
    { id: "overview", label: "1. Overview & Project Type", icon: "📄", page: "PDF Page 1" },
    { id: "user-roles", label: "2. User Access & Roles", icon: "👥", page: "PDF Page 1" },
    { id: "features", label: "3. Features & Scope", icon: "⚡", page: "PDF Page 2" },
    { id: "investment-plans", label: "4. Investment Plans", icon: "💰", page: "PDF Page 3" },
    { id: "plan-comparison", label: "5. Plan Comparison", icon: "📊", page: "PDF Page 3" },
    { id: "payment-terms", label: "6. Payment Terms", icon: "💳", page: "PDF Page 4" },
    { id: "terms-conditions", label: "7. Terms & Conditions", icon: "📜", page: "PDF Page 4" },
    { id: "company-details", label: "8. Company Details", icon: "🏢", page: "PDF Header" }
  ];

  const projectTypesList = [
    "Web Application",
    "Mobile Application",
    "Web & Mobile Application",
    "E-Commerce Application",
    "AI Application",
    "SaaS Platform",
    "CRM / ERP Software",
    "Custom Project"
  ];

  // Helper to add a feature to MongoDB & local state
  const handleAddFeatureInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatTitle.trim()) return;

    const payload = {
      id: `FEAT-${Date.now().toString().slice(-4)}`,
      projectId: activeProjectDetail.id,
      projectName: activeProjectDetail.name || activeProjectDetail.title,
      title: newFeatTitle,
      moduleName: newFeatModule,
      description: newFeatDesc || "Feature deliverable specification included in technical scope.",
      requirementType: "Functional Deliverable",
      priority: newFeatPriority,
      assignedDeveloper: "Unassigned Lead",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      estimatedHours: 40,
      progress: 0,
      status: "Planned",
      clientApproval: true,
      notes: "Created via proposal manager workspace."
    };

    try {
      const res = await fetch(`${API_URL}/crm/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFeatures(prev => [data.data, ...prev]);
      } else {
        setFeatures(prev => [payload, ...prev]);
      }
      setNewFeatTitle("");
      setNewFeatDesc("");
      setIsAddingFeat(false);
    } catch (err) {
      setFeatures(prev => [payload, ...prev]);
      setNewFeatTitle("");
      setNewFeatDesc("");
      setIsAddingFeat(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[85vh] animate-in fade-in duration-200">
      {/* HIDDEN UNIVERSAL SECTION FILE INPUT */}
      <input 
        type="file" 
        ref={universalSectionFileInputRef} 
        accept=".txt,.json,.csv,.doc,.docx,.pdf" 
        onChange={(e) => {
          handleUniversalSectionFileUpload(e, activeProjectTab, activeQuote);
          if (e.target) e.target.value = "";
        }} 
        className="hidden" 
      />

      {/* LEFT PROJECT PROPOSAL PAGES SIDEBAR */}
      <aside className="w-full md:w-72 bg-white text-gray-700 flex flex-col justify-between shrink-0 p-5 border-r border-gray-200 overflow-y-auto">
        <div className="space-y-6">
          {/* PROJECT HEADER BADGE */}
          <div className="border-b border-gray-150 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-wider">
                {activeProjectDetail.id} &bull; WORKSPACE
              </span>
              <button 
                onClick={() => setActiveProjectDetail(null)} 
                className="text-gray-400 hover:text-gray-700 text-xl md:hidden font-bold"
              >
                &times;
              </button>
            </div>
            <h3 className="font-heading font-extrabold text-[#1a0f00] text-base mt-1 line-clamp-1">
              {activeProjectDetail.name || activeProjectDetail.title}
            </h3>
            <span className="text-xs text-gray-500 block mt-0.5 font-sans">
              Client: {activeProjectDetail.clientName || "Enterprise Client"}
            </span>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-extrabold uppercase bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                STATUS: {activeQuote.status || "APPROVED"}
              </span>
              <span className="text-[9px] font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                {activeQuote.id || activeQuote.number}
              </span>
            </div>
          </div>

          {/* PROPOSAL PAGES VERTICAL NAVIGATION LIST */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2 mb-2">
              PROPOSAL PAGES (8 SECTIONS)
            </span>
            {proposalTabs.map(t => {
              const isActive = activeProjectTab === t.id || (activeProjectTab === "quotations" && t.id === "plan-comparison");
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveProjectTab(t.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs text-left transition-all ${
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

        {/* SIDEBAR BOTTOM ACTION BUTTONS */}
        <div className="pt-4 border-t border-gray-150 space-y-2 mt-4">
          <Button
            onClick={() => setReviewingQuote(activeQuote)}
            variant="primary"
            size="sm"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md border-0 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            <span>Review PDF Proposal</span>
          </Button>
          
          <Button
            onClick={() => {
              const projectFeatures = features.filter(f => f.projectId === activeProjectDetail.id || f.projectName === activeProjectDetail.name);
              const pdfHtml = generateSpeshwayEstimationPdfHtml(activeProjectDetail, activeQuote, projectFeatures);
              triggerDirectPdfDownload(pdfHtml, `${(activeProjectDetail.name || activeProjectDetail.title).replace(/[^a-zA-Z0-9]/gi, '_')}_Proposal.pdf`);
            }}
            variant="secondary"
            size="sm"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={14} className="text-orange-600" />
            <span>Download Report PDF</span>
          </Button>

          <button 
            onClick={() => setActiveProjectDetail(null)} 
            className="w-full py-2 text-center text-xs text-gray-500 hover:text-[#1a0f00] font-bold transition-all flex items-center justify-center gap-1"
          >
            <ArrowLeft size={12} />
            <span>Exit Project Workspace</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE CANVAS */}
      <main className="flex-1 bg-slate-50/50 p-6 md:p-8 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6 shrink-0 flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              ACTIVE SECTION PAGE: {activeProjectTab.toUpperCase().replace('-', ' ')}
            </span>
            <h2 className="text-xl font-heading font-extrabold text-[#1a0f00] mt-1.5">
              {activeProjectTab === "overview" && "1. Project Overview & Type Configuration"}
              {activeProjectTab === "user-roles" && "2. Target User Roles & Access Architecture"}
              {activeProjectTab === "features" && "3. Technical Scope & Feature Deliverables"}
              {activeProjectTab === "investment-plans" && "4. Commercial Investment Plans"}
              {activeProjectTab === "plan-comparison" && "5. Detailed Feature Comparison Matrix"}
              {activeProjectTab === "payment-terms" && "6. Milestone Payment Schedule & Terms"}
              {activeProjectTab === "terms-conditions" && "7. Support & Project Terms and Conditions"}
              {activeProjectTab === "company-details" && "8. Company Details & Proposal Branding"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              onClick={() => {
                setActiveSectionToUpload(activeProjectTab);
                universalSectionFileInputRef.current?.click();
              }}
              variant="secondary"
              size="sm"
              className="text-xs py-2 px-3.5 flex items-center gap-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold rounded-xl shadow-sm transition-all"
            >
              <Upload size={14} className="text-orange-600" />
              <span>Upload Section Doc</span>
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (!confirm(`Delete proposal document '${activeQuote.title || activeQuote.id}' permanently from database?`)) return;
                try {
                  await fetch(`${API_URL}/crm/quotation/${activeQuote.id || activeQuote.number}`, { method: "DELETE" });
                  setQuotations(prev => prev.filter(q => q.id !== activeQuote.id && (q as any).number !== activeQuote.id));
                  alert("Proposal document deleted from database successfully!");
                  setActiveProjectDetail(null);
                } catch (err) {
                  console.error("[Delete Proposal Error]", err);
                  setQuotations(prev => prev.filter(q => q.id !== activeQuote.id));
                  setActiveProjectDetail(null);
                }
              }}
              variant="secondary"
              size="sm"
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-xl border border-red-200 flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Delete Proposal</span>
            </Button>
            <Button 
              onClick={() => setActiveProjectDetail(null)} 
              variant="secondary" 
              size="sm" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 px-3.5 rounded-xl border border-gray-200"
            >
              Exit
            </Button>
          </div>
        </div>

        <div className="flex-1 text-xs text-gray-700 space-y-6">
          {/* 1. OVERVIEW NARRATIVE & PROJECT TYPE TAB */}
          {(activeProjectTab === "overview" || activeProjectTab === "project-details") && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">1. Project Type Selection & Executive Narrative</h4>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 1</span>
              </div>

              {/* PROJECT TYPE SELECTION CARD (FIRST STEP IN FLOW) */}
              <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-600" />
                  <span className="text-xs font-extrabold text-[#1a0f00] uppercase tracking-wider">Step 1: Select Target Project Category & Type</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Project Type Dropdown</label>
                    <select
                      value={activeQuote.projectType || activeProjectDetail.category || "Web Application"}
                      onChange={e => updateQuoteField({ projectType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    >
                      {projectTypesList.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Custom Category Name</label>
                    <input
                      type="text"
                      placeholder="Enter custom project classification..."
                      onChange={e => updateQuoteField({ projectType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* EXECUTIVE OVERVIEW NARRATIVE EDIT & CRUD */}
              <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Executive Overview Narrative</label>
                <textarea
                  rows={6}
                  value={activeQuote.overviewNarrative || activeProjectDetail.description || ""}
                  onChange={e => updateQuoteField({ overviewNarrative: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs font-sans text-[#1a0f00] bg-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                />
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    onClick={() => saveQuoteSection({ projectType: activeQuote.projectType, overviewNarrative: activeQuote.overviewNarrative })}
                    variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
                  >
                    Save Narrative & Type
                  </Button>

                  <Button 
                    type="button" 
                    onClick={() => {
                      if (!confirm("Clear overview narrative?")) return;
                      saveQuoteSection({ overviewNarrative: "" });
                    }}
                    variant="secondary" size="sm" className="text-xs py-2 px-3 border border-gray-200 text-red-600 hover:bg-red-50 font-bold rounded-xl"
                  >
                    Clear Narrative
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 2. USER ACCESS & ROLES TAB (FULL CRUD ON ROLES) */}
          {activeProjectTab === "user-roles" && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">2. Target User Access & Roles Architecture</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 1</span>
                  <Button
                    type="button"
                    onClick={async () => {
                      const updated = [
                        ...activeUserRoles,
                        { id: Date.now().toString(), title: `New Role (${activeUserRoles.length + 1})`, description: "Role permissions & access capabilities." }
                      ];
                      await saveQuoteSection({ userRoles: updated });
                    }}
                    variant="secondary"
                    size="sm"
                    className="text-xs py-1 px-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold rounded-xl"
                  >
                    + Add New Role
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeUserRoles.map((role: any, idx: number) => (
                  <div key={role.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 relative">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={role.title}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = activeUserRoles.map((r: any, i: number) => i === idx ? { ...r, title: val } : r);
                          updateQuoteField({ userRoles: updated });
                        }}
                        className="font-extrabold text-[#1a0f00] text-xs uppercase bg-gray-50 border border-gray-200 rounded p-1.5 focus:outline-none focus:border-orange-500 w-full mr-2"
                      />
                      {activeUserRoles.length > 1 && (
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this user role?")) return;
                            const updated = activeUserRoles.filter((_: any, i: number) => i !== idx);
                            await saveQuoteSection({ userRoles: updated });
                          }}
                          className="text-red-400 hover:text-red-600 p-1 font-bold"
                          title="Delete Role"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={role.description}
                      onChange={e => {
                        const val = e.target.value;
                        const updated = activeUserRoles.map((r: any, i: number) => i === idx ? { ...r, description: val } : r);
                        updateQuoteField({ userRoles: updated });
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:outline-none focus:border-orange-500 resize-none text-[#1a0f00]"
                    />
                  </div>
                ))}
              </div>

              <Button 
                type="button" 
                onClick={() => saveQuoteSection({ userRoles: activeUserRoles })}
                variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                Save User Access Roles
              </Button>
            </div>
          )}

          {/* 3. FEATURES TAB (FULL CRUD ON FEATURES) */}
          {activeProjectTab === "features" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">3. Technical Features & Scope</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 2</span>
                  <Button
                    type="button"
                    onClick={() => setIsAddingFeat(prev => !prev)}
                    variant="secondary"
                    size="sm"
                    className="text-xs py-1 px-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold rounded-xl"
                  >
                    {isAddingFeat ? "Cancel" : "+ Add Feature to Scope"}
                  </Button>
                </div>
              </div>

              {/* INLINE CREATE FEATURE FORM */}
              {isAddingFeat && (
                <form onSubmit={handleAddFeatureInline} className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 flex flex-col gap-3">
                  <span className="text-xs font-bold text-orange-700 uppercase">Create New Technical Feature</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Feature Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Real-Time Chat & Booking Gateway"
                        value={newFeatTitle}
                        onChange={e => setNewFeatTitle(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Module Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Core Booking Module"
                        value={newFeatModule}
                        onChange={e => setNewFeatModule(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Priority Level</label>
                      <select
                        value={newFeatPriority}
                        onChange={e => setNewFeatPriority(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Feature Specification Description</label>
                    <textarea
                      rows={2}
                      placeholder="Enter detailed feature scope description..."
                      value={newFeatDesc}
                      onChange={e => setNewFeatDesc(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none resize-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="sm" className="w-fit text-xs py-1.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl">
                    + Add Feature
                  </Button>
                </form>
              )}

              {/* FEATURES LIST WITH READ & DELETE */}
              <div className="flex flex-col gap-2">
                {features.filter(f => f.projectId === activeProjectDetail.id || f.projectName === activeProjectDetail.name).map((feat, idx) => (
                  <div key={feat.id || idx} className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-bold border border-orange-200">{feat.id}</span>
                        <span className="font-bold text-[#1a0f00] text-xs">{feat.title}</span>
                        <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{feat.moduleName}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{feat.description}</p>
                    </div>
                    <button 
                      onClick={async () => {
                        if (!confirm(`Delete feature '${feat.title}'?`)) return;
                        try {
                          await fetch(`${API_URL}/crm/feature/${feat.id}`, { method: "DELETE" });
                          setFeatures(prev => prev.filter(f => f.id !== feat.id));
                        } catch (err) {
                          setFeatures(prev => prev.filter(f => f.id !== feat.id));
                        }
                      }}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Feature"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INVESTMENT PLANS TAB (FULL CRUD ON PLANS) */}
          {activeProjectTab === "investment-plans" && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">4. Commercial Investment Plans</h4>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 3</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-[#1a0f00] uppercase">Plan A Price (INR &#8377;)</span>
                  <input
                    type="number"
                    value={activeQuote.planAPrice || 60000}
                    onChange={e => updateQuoteField({ planAPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-[#1a0f00] uppercase">Plan B Price (INR &#8377;)</span>
                  <input
                    type="number"
                    value={activeQuote.planBPrice || 110000}
                    onChange={e => updateQuoteField({ planBPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={() => saveQuoteSection({ planAPrice: activeQuote.planAPrice, planBPrice: activeQuote.planBPrice })}
                variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                Save Investment Prices
              </Button>
            </div>
          )}

          {/* 5. PLAN COMPARISON TAB (FULL CRUD ON MATRIX ROWS) */}
          {(activeProjectTab === "plan-comparison" || activeProjectTab === "quotations") && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">5. Feature Deliverables Comparison Matrix</h4>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 3</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold text-[11px] uppercase border-b border-gray-200">
                    <tr>
                      <th className="p-3">Deliverable / Feature Description</th>
                      <th className="p-3 text-center w-24">Plan A</th>
                      <th className="p-3 text-center w-24">Plan B</th>
                      <th className="p-3 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {activeCompItems.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/60">
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.deliverable}
                            onChange={e => {
                              const val = e.target.value;
                              const updated = activeCompItems.map((it: any, i: number) => i === idx ? { ...it, deliverable: val } : it);
                              updateQuoteField({ planComparisonItems: updated });
                            }}
                            className="w-full p-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 text-[#1a0f00] focus:outline-none focus:border-orange-500"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.planA}
                            onChange={e => {
                              const checked = e.target.checked;
                              const updated = activeCompItems.map((it: any, i: number) => i === idx ? { ...it, planA: checked } : it);
                              updateQuoteField({ planComparisonItems: updated });
                            }}
                            className="w-4 h-4 text-orange-600 accent-orange-600 rounded"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.planB}
                            onChange={e => {
                              const checked = e.target.checked;
                              const updated = activeCompItems.map((it: any, i: number) => i === idx ? { ...it, planB: checked } : it);
                              updateQuoteField({ planComparisonItems: updated });
                            }}
                            className="w-4 h-4 text-orange-600 accent-orange-600 rounded"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={async () => {
                              if (!confirm("Delete this comparison row?")) return;
                              const updated = activeCompItems.filter((_: any, i: number) => i !== idx);
                              await saveQuoteSection({ planComparisonItems: updated });
                            }}
                            className="text-red-400 hover:text-red-600 p-1 font-bold text-sm"
                            title="Delete Comparison Row"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  onClick={async () => {
                    const updated = [...activeCompItems, { deliverable: "New Custom Requirement", planA: false, planB: true }];
                    await saveQuoteSection({ planComparisonItems: updated });
                  }}
                  variant="secondary" size="sm" className="text-xs py-2 px-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold rounded-xl shadow-sm"
                >
                  + Add Comparison Row
                </Button>
                <Button 
                  type="button" 
                  onClick={() => saveQuoteSection({ planComparisonItems: activeCompItems })}
                  variant="primary" size="sm" className="text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Matrix
                </Button>
              </div>
            </div>
          )}

          {/* 6. PAYMENT TERMS TAB (FULL CRUD ON PAYMENT TERMS) */}
          {activeProjectTab === "payment-terms" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">6. Payment Terms & Milestone Schedule</h4>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 4</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">MILESTONE PAYMENT TERMS BREAKDOWN</label>
                <textarea
                  rows={6}
                  value={activeQuote.paymentTerms || "40% advance on project kick-off\n30% on completion of core module development & UAT build\n30% on final delivery, deployment & go-live"}
                  onChange={e => updateQuoteField({ paymentTerms: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs font-sans text-[#1a0f00] bg-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                />
                <Button 
                  type="button" 
                  onClick={() => saveQuoteSection({ paymentTerms: activeQuote.paymentTerms })}
                  variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Payment Terms
                </Button>
              </div>
            </div>
          )}

          {/* 7. TERMS & CONDITIONS TAB (FULL CRUD ON T&C) */}
          {activeProjectTab === "terms-conditions" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">7. Terms & Conditions</h4>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Page 4</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COMPLIMENTARY SUPPORT & SCOPE GOVERNANCE RULES</label>
                  <textarea
                    rows={6}
                    value={activeQuote.termsAndConditions || "Estimation is valid for 30 days from the date of issue.\nTimeline: Plan A — approx 6–8 weeks; Plan B — approx 10–12 weeks.\nCost excludes third-party charges such as payment gateway fees, SMS fees, and store publishing fees.\nIncludes 30 days complimentary post-launch bug-fix support.\nSource code handed over upon full and final payment."}
                    onChange={e => updateQuoteField({ termsAndConditions: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-sans text-[#1a0f00] bg-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                  />
                  <Button 
                    type="button" 
                    onClick={() => saveQuoteSection({ termsAndConditions: activeQuote.termsAndConditions })}
                    variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all"
                  >
                    Save Terms & Conditions
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 8. COMPANY & BRANDING DETAILS TAB (FULL CRUD ON BRANDING) */}
          {activeProjectTab === "company-details" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">8. Company & Proposal Branding Details</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Manage and edit company information displayed on proposal PDF headers, footers & signatures.</p>
                </div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">PDF Header & Footer</span>
              </div>
              
              <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      value={activeQuote.companyName || "Speshway Solutions"}
                      onChange={e => updateQuoteField({ companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Company Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={activeQuote.companyTagline || "Website & App Development Company | Hyderabad, India"}
                      onChange={e => updateQuoteField({ companyTagline: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={activeQuote.companyEmail || "info@speshway.com"}
                      onChange={e => updateQuoteField({ companyEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Official Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={activeQuote.companyPhone || "+91 91000 06020"}
                      onChange={e => updateQuoteField({ companyPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Official Website URL</label>
                    <input
                      type="text"
                      value={activeQuote.companyWebsite || "www.speshway.com"}
                      onChange={e => updateQuoteField({ companyWebsite: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Tax ID / GSTIN Identification</label>
                    <input
                      type="text"
                      value={activeQuote.companyGstin || "36AAAAA0000A1Z5"}
                      onChange={e => updateQuoteField({ companyGstin: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Complete Office Address</label>
                  <textarea
                    rows={2}
                    value={activeQuote.companyAddress || "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India"}
                    onChange={e => updateQuoteField({ companyAddress: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                  />
                </div>

                {/* COMPANY LOGO & BACKGROUND WATERMARK SETTINGS */}
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-[#1a0f00] uppercase tracking-wider">Company Logo & Background Watermark Config</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Company Logo Image (Upload or URL)</label>
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL or click upload button..."
                          value={activeQuote.companyLogoUrl || ""}
                          onChange={e => updateQuoteField({ companyLogoUrl: e.target.value })}
                          className="flex-1 p-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                        />
                        <Button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          variant="secondary"
                          size="sm"
                          className="text-xs py-2.5 px-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
                        >
                          <Upload size={14} className="text-orange-600" />
                          <span>Upload Image</span>
                        </Button>
                      </div>
                      {activeQuote.companyLogoUrl && (
                        <div className="mt-2 flex items-center gap-2.5 p-2 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                          <img src={activeQuote.companyLogoUrl} alt="Company Logo Preview" className="h-8 w-auto max-w-[120px] object-contain rounded-lg bg-white p-1 border border-gray-200" />
                          <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">Logo Uploaded</span>
                          <button
                            type="button"
                            onClick={() => saveQuoteSection({ companyLogoUrl: "" })}
                            className="text-xs text-red-500 hover:text-red-700 font-bold px-1"
                          >
                            &times; Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Background PDF Watermark Text</label>
                      <input
                        type="text"
                        placeholder="e.g. SPESHWAY SOLUTIONS"
                        value={activeQuote.companyWatermarkText || activeQuote.companyName || "SPESHWAY SOLUTIONS"}
                        onChange={e => updateQuoteField({ companyWatermarkText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1a0f00] bg-gray-50 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* WATERMARK OPACITY, CONTRAST & ROTATION FINE-TUNING */}
                  <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 flex flex-col gap-3 mt-1">
                    <span className="text-xs font-extrabold text-orange-800 uppercase tracking-wider">Watermark Opacity, Contrast & Rotation Controls</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Watermark Opacity ({Math.round((activeQuote.companyWatermarkOpacity ?? 0.15) * 100)}%)</label>
                        <input
                          type="range"
                          min="0.05"
                          max="0.60"
                          step="0.05"
                          value={activeQuote.companyWatermarkOpacity ?? 0.15}
                          onChange={e => updateQuoteField({ companyWatermarkOpacity: parseFloat(e.target.value) })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Watermark Contrast ({activeQuote.companyWatermarkContrast ?? 150}%)</label>
                        <input
                          type="range"
                          min="100"
                          max="300"
                          step="10"
                          value={activeQuote.companyWatermarkContrast ?? 150}
                          onChange={e => updateQuoteField({ companyWatermarkContrast: parseInt(e.target.value) })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Rotation Angle ({activeQuote.companyWatermarkRotation ?? -25}&deg;)</label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={activeQuote.companyWatermarkRotation ?? -25}
                          onChange={e => updateQuoteField({ companyWatermarkRotation: parseInt(e.target.value) })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Watermark Color Mode</label>
                        <select
                          value={activeQuote.companyWatermarkGrayscale !== false ? "grayscale" : "color"}
                          onChange={e => updateQuoteField({ companyWatermarkGrayscale: e.target.value === "grayscale" })}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold text-[#1a0f00] bg-white focus:outline-none"
                        >
                          <option value="grayscale">Monochrome Grayscale (Classic)</option>
                          <option value="color">Full Original Brand Colors</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF THEME & COLOR PALETTE CUSTOMIZATION */}
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-[#1a0f00] uppercase tracking-wider">PDF Report Theme & Header Color Customization</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-500 font-bold">Preset Palettes:</span>
                    {[
                      { name: "Purple (Default)", primary: "#4c1d95", secondary: "#7c3aed" },
                      { name: "Speshway Orange", primary: "#c2410c", secondary: "#ea580c" },
                      { name: "Midnight Navy", primary: "#1e3a8a", secondary: "#2563eb" },
                      { name: "Emerald Green", primary: "#065f46", secondary: "#059669" },
                      { name: "Crimson Red", primary: "#991b1b", secondary: "#dc2626" },
                      { name: "Slate Dark", primary: "#0f172a", secondary: "#334155" }
                    ].map(pal => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => saveQuoteSection({ pdfPrimaryColor: pal.primary, pdfSecondaryColor: pal.secondary })}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${pal.primary}, ${pal.secondary})` }}
                      >
                        <span>{pal.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Primary Header Color (Hex)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeQuote.pdfPrimaryColor || "#4c1d95"}
                          onChange={e => updateQuoteField({ pdfPrimaryColor: e.target.value })}
                          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={activeQuote.pdfPrimaryColor || "#4c1d95"}
                          onChange={e => updateQuoteField({ pdfPrimaryColor: e.target.value })}
                          className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono font-bold text-[#1a0f00] bg-gray-50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Accent Secondary Color (Hex)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeQuote.pdfSecondaryColor || "#7c3aed"}
                          onChange={e => updateQuoteField({ pdfSecondaryColor: e.target.value })}
                          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={activeQuote.pdfSecondaryColor || "#7c3aed"}
                          onChange={e => updateQuoteField({ pdfSecondaryColor: e.target.value })}
                          className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono font-bold text-[#1a0f00] bg-gray-50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={() => saveQuoteSection({ 
                    companyName: activeQuote.companyName, 
                    companyTagline: activeQuote.companyTagline, 
                    companyEmail: activeQuote.companyEmail, 
                    companyPhone: activeQuote.companyPhone, 
                    companyWebsite: activeQuote.companyWebsite, 
                    companyGstin: activeQuote.companyGstin, 
                    companyAddress: activeQuote.companyAddress,
                    pdfPrimaryColor: activeQuote.pdfPrimaryColor,
                    pdfSecondaryColor: activeQuote.pdfSecondaryColor,
                    companyLogoUrl: activeQuote.companyLogoUrl,
                    companyWatermarkUrl: activeQuote.companyWatermarkUrl,
                    companyWatermarkText: activeQuote.companyWatermarkText,
                    companyWatermarkOpacity: activeQuote.companyWatermarkOpacity,
                    companyWatermarkContrast: activeQuote.companyWatermarkContrast,
                    companyWatermarkGrayscale: activeQuote.companyWatermarkGrayscale,
                    companyWatermarkRotation: activeQuote.companyWatermarkRotation
                  })}
                  variant="primary" size="sm" className="w-fit text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-sm transition-all mt-1"
                >
                  Save Company, Logo & Watermark Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
