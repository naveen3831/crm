"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle, 
  Receipt, 
  Upload, 
  Sliders, 
  Palette, 
  RotateCw, 
  MapPin, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Building2,
  Sparkles
} from "lucide-react";
import Button from "../ui/Button";
import { numberToIndianWords, triggerDirectPdfDownload } from "@/lib/proposalUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Curated 2-Color Dual Gradient Combos & Palette
const DUAL_COLOR_PRESETS = [
  { id: "sunset-glow", name: "🌅 Sunset Glow", c1: "#c2410c", c2: "#f97316" },
  { id: "ocean-deep", name: "🌊 Ocean Deep", c1: "#0b3c86", c2: "#0284c7" },
  { id: "royal-velvet", name: "👑 Royal Velvet", c1: "#5b21b6", c2: "#9333ea" },
  { id: "emerald-luxe", name: "💎 Emerald Luxe", c1: "#047857", c2: "#10b981" },
  { id: "midnight-cyber", name: "🌃 Midnight Cyber", c1: "#0f172a", c2: "#3b82f6" },
  { id: "crimson-flame", name: "🔥 Crimson Flame", c1: "#9f1239", c2: "#e11d48" },
  { id: "electric-neon", name: "⚡ Electric Neon", c1: "#4338ca", c2: "#06b6d4" },
  { id: "rose-gold", name: "🌸 Rose Gold", c1: "#be185d", c2: "#f43f5e" }
];

// Footer Color Presets
const FOOTER_COLOR_PRESETS = [
  { id: "slate", name: "Dark Slate", hex: "#334155" },
  { id: "charcoal", name: "Deep Charcoal", hex: "#0f172a" },
  { id: "muted", name: "Muted Gray", hex: "#64748b" },
  { id: "orange", name: "Vibrant Orange", hex: "#c2410c" },
  { id: "navy", name: "Navy Blue", hex: "#0b3c86" },
  { id: "emerald", name: "Emerald Green", hex: "#047857" },
  { id: "purple", name: "Royal Purple", hex: "#5b21b6" }
];

// Background paper theme options
const INVOICE_BG_THEMES = [
  { id: "clean-white", name: "Pure Classic White", bgCss: "#ffffff", borderCss: "#e2e8f0" },
  { id: "slate-soft", name: "Subtle Slate Tint", bgCss: "#f8fafc", borderCss: "#cbd5e1" },
  { id: "warm-ivory", name: "Soft Ivory Warm", bgCss: "#fdfbf7", borderCss: "#e7e5e4" },
  { id: "gradient-blue", name: "Modern Ice Blue Gradient", bgCss: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)", borderCss: "#bfdbfe" }
];

const getSafeStr = (val: any, fallback: string = ""): string => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.title || val.name || val.label || fallback;
  return String(val);
};

interface FullInvoiceEditorPageProps {
  projectId: string;
  invoiceId?: string; // If present, edit mode; if absent, create mode
}

export default function FullInvoiceEditorPage({ projectId, invoiceId }: FullInvoiceEditorPageProps) {
  const router = useRouter();
  const isEditMode = Boolean(invoiceId);

  const [project, setProject] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [selectedProposalForInv, setSelectedProposalForInv] = useState<string>("");
  const [invTitle, setInvTitle] = useState("");
  const [invClientName, setInvClientName] = useState("");
  const [invCategory, setInvCategory] = useState("Web Application");
  const [invAmount, setInvAmount] = useState<number>(170000);
  const [invBilledByCompany, setInvBilledByCompany] = useState("Speshway Solutions Private Limited");
  const [invBilledBySub, setInvBilledBySub] = useState("Software Development Company");
  const [invTaxRate, setInvTaxRate] = useState<number>(18);
  const [invIssuedDate, setInvIssuedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [invDueDate, setInvDueDate] = useState<string>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [invBankAccName, setInvBankAccName] = useState("SPESHWAY SOLUTIONS PRIVATE LIMITED");
  const [invBankAccNo, setInvBankAccNo] = useState("018326900000850");
  const [invBankBranch, setInvBankBranch] = useState("HITECH CITY");
  const [invBankIfsc, setInvBankIfsc] = useState("YESB0000183");

  // Dual Color Gradient & Custom Pickers
  const [invColorTheme, setInvColorTheme] = useState<string>("#c2410c");
  const [invColorTheme2, setInvColorTheme2] = useState<string>("#f97316");
  const [invEnableDualGradient, setInvEnableDualGradient] = useState<boolean>(true);

  const [invCompanyLogo, setInvCompanyLogo] = useState<string>("");
  const [invBgTheme, setInvBgTheme] = useState<string>("clean-white");

  // Footer Branding & Color
  const [invFooterCompanyName, setInvFooterCompanyName] = useState<string>("Speshway Solutions Private Limited");
  const [invFooterAddress, setInvFooterAddress] = useState<string>("T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
  const [invFooterColor, setInvFooterColor] = useState<string>("#334155");

  // Watermark Settings
  const [invWatermarkType, setInvWatermarkType] = useState<"both" | "logo" | "text" | "none">("both");
  const [invWatermarkText, setInvWatermarkText] = useState<string>("SPESHWAY SOLUTIONS PRIVATE LIMITED");
  const [invWatermarkOpacity, setInvWatermarkOpacity] = useState<number>(0.25);
  const [invWatermarkRotation, setInvWatermarkRotation] = useState<number>(-25);

  const [invItems, setInvItems] = useState<{ description: string; qty: number; rate: number }[]>([
    { description: "Custom Scope Development Deliverables", qty: 1, rate: 170000 }
  ]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch project info
      let currentProj = null;
      try {
        const projRes = await fetch(`${API_URL}/crm/our-projects`);
        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.data)) {
          currentProj = projData.data.find((p: any) => p && (p.id === projectId || getSafeStr(p.name).toLowerCase() === String(projectId).toLowerCase()));
        }
      } catch (err) {
        console.error("Error loading project info:", err);
      }

      if (!currentProj) {
        currentProj = {
          id: projectId,
          name: "HMS System",
          clientName: "Hyper Mobility Services",
          category: "Web & Mobile Ecosystem"
        };
      }
      setProject(currentProj);

      // 2. Fetch quotations
      try {
        const quoteRes = await fetch(`${API_URL}/crm/quotation`);
        const quoteData = await quoteRes.json();
        if (quoteData.success && Array.isArray(quoteData.data)) {
          const matching = quoteData.data.filter((q: any) => q && q.projectId === currentProj.id);
          setProposals(matching);
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
      }

      // 3. If Edit Mode, fetch existing invoice
      if (isEditMode && invoiceId) {
        let existingInv = null;
        try {
          const invRes = await fetch(`${API_URL}/crm/invoice/${invoiceId}`);
          const invData = await invRes.json();
          if (invData.success && invData.data) existingInv = invData.data;
        } catch (err) {
          console.error("Error fetching single invoice:", err);
        }

        if (!existingInv) {
          try {
            const allInvRes = await fetch(`${API_URL}/crm/invoice`);
            const allInvData = await allInvRes.json();
            if (allInvData.success && Array.isArray(allInvData.data)) {
              existingInv = allInvData.data.find((i: any) => i && (i.id === invoiceId || i.number === invoiceId));
            }
          } catch (err) {
            console.error("Error fetching all invoices for edit:", err);
          }
        }

        if (existingInv) {
          setSelectedProposalForInv(getSafeStr(existingInv.proposalId));
          setInvTitle(getSafeStr(existingInv.title));
          setInvClientName(getSafeStr(existingInv.clientName));
          setInvCategory(getSafeStr(existingInv.projectType, "Web Application"));
          setInvBilledByCompany(getSafeStr(existingInv.billedByCompany, "Speshway Solutions Private Limited"));
          setInvBilledBySub(getSafeStr(existingInv.billedBySub, "Software Development Company"));
          setInvTaxRate(existingInv.taxRate !== undefined ? Number(existingInv.taxRate) : 18);
          setInvIssuedDate(getSafeStr(existingInv.issuedDate, new Date().toISOString().split("T")[0]));
          setInvDueDate(getSafeStr(existingInv.dueDate, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]));
          setInvBankAccName(getSafeStr(existingInv.bankAccName, "SPESHWAY SOLUTIONS PRIVATE LIMITED"));
          setInvBankAccNo(getSafeStr(existingInv.bankAccNo, "018326900000850"));
          setInvBankBranch(getSafeStr(existingInv.bankBranch, "HITECH CITY"));
          setInvBankIfsc(getSafeStr(existingInv.bankIfsc, "YESB0000183"));
          setInvColorTheme(getSafeStr(existingInv.colorTheme, "#c2410c"));
          setInvColorTheme2(getSafeStr(existingInv.colorTheme2, "#f97316"));
          setInvEnableDualGradient(existingInv.enableDualGradient !== false);
          setInvCompanyLogo(getSafeStr(existingInv.companyLogoUrl || existingInv.logoUrl));
          setInvBgTheme(getSafeStr(existingInv.bgTheme, "clean-white"));
          setInvFooterCompanyName(getSafeStr(existingInv.footerCompanyName, existingInv.billedByCompany || "Speshway Solutions Private Limited"));
          setInvFooterAddress(getSafeStr(existingInv.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com"));
          setInvFooterColor(getSafeStr(existingInv.footerColor, "#334155"));
          setInvWatermarkType((existingInv.watermarkType || "both") as any);
          setInvWatermarkText(getSafeStr(existingInv.watermarkText, existingInv.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED"));
          setInvWatermarkOpacity(existingInv.watermarkOpacity !== undefined ? Number(existingInv.watermarkOpacity) : 0.25);
          setInvWatermarkRotation(existingInv.watermarkRotation !== undefined ? Number(existingInv.watermarkRotation) : -25);

          const items = Array.isArray(existingInv.serviceItems) && existingInv.serviceItems.length > 0 ? existingInv.serviceItems.map((it: any) => ({
            description: getSafeStr(it.description || it.title, "Scope Deliverable"),
            qty: Number(it.qty || 1),
            rate: Number(it.rate || 0)
          })) : [
            { description: getSafeStr(existingInv.title, "Scope Deliverables"), qty: 1, rate: Number(existingInv.amount || 170000) }
          ];
          setInvItems(items);
          setInvAmount(Number(existingInv.amount || items.reduce((sum: number, it: any) => sum + ((it.qty || 1) * (it.rate || 0)), 0)));
        }
      } else {
        // Create Mode defaults
        const safeProjName = getSafeStr(currentProj.name || currentProj.title, String(projectId));
        setInvTitle(`Tax Invoice for ${safeProjName}`);
        setInvClientName(getSafeStr(currentProj.clientName, "Hyper Mobility Services"));
        setInvWatermarkText("SPESHWAY SOLUTIONS PRIVATE LIMITED");
      }

    } catch (err) {
      console.error("Error loading editor data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, invoiceId]);

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const invIdToSave = isEditMode && invoiceId 
      ? invoiceId 
      : `SPW${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${Date.now().toString().slice(-4)}`;

    const safeProjName = getSafeStr(project?.name || project?.title, String(projectId));

    const invoicePayload = {
      id: invIdToSave,
      number: invIdToSave,
      proposalId: selectedProposalForInv || "CUSTOM",
      projectId: project?.id || projectId,
      projectName: safeProjName,
      productName: safeProjName,
      clientName: invClientName || getSafeStr(project?.clientName, "Hyper Mobility Services"),
      billedByCompany: invBilledByCompany,
      billedBySub: invBilledBySub,
      title: invTitle.trim() || `Tax Invoice for ${safeProjName}`,
      projectType: invCategory,
      amount: invAmount,
      taxRate: invTaxRate,
      issuedDate: invIssuedDate,
      dueDate: invDueDate,
      bankAccName: invBankAccName,
      bankAccNo: invBankAccNo,
      bankBranch: invBankBranch,
      bankIfsc: invBankIfsc,
      colorTheme: invColorTheme || "#c2410c",
      colorTheme2: invColorTheme2 || "#f97316",
      enableDualGradient: invEnableDualGradient,
      companyLogoUrl: invCompanyLogo,
      logoUrl: invCompanyLogo,
      bgTheme: invBgTheme || "clean-white",
      footerCompanyName: invFooterCompanyName,
      footerAddress: invFooterAddress,
      footerColor: invFooterColor,
      watermarkType: invWatermarkType,
      watermarkText: invWatermarkText,
      watermarkOpacity: invWatermarkOpacity,
      watermarkRotation: invWatermarkRotation,
      status: "Paid",
      serviceItems: invItems
    };

    try {
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode ? `${API_URL}/crm/invoice/${encodeURIComponent(invIdToSave)}` : `${API_URL}/crm/invoice`;

      await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload)
      });
      
      router.push(`/admin/our-projects/${projectId}/invoices/${invIdToSave}`);
    } catch (err) {
      console.error("Error saving invoice:", err);
      router.push(`/admin/our-projects/${projectId}/invoices/${invIdToSave}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400">Loading Full Page Standalone Invoice Editor...</p>
      </div>
    );
  }

  const selectedBgObj = INVOICE_BG_THEMES.find(t => t.id === invBgTheme) || INVOICE_BG_THEMES[0];
  const pBgCss = selectedBgObj.bgCss;
  const pIsDual = invEnableDualGradient && Boolean(invColorTheme2);
  const pHeaderBgStyle = pIsDual ? `linear-gradient(135deg, ${invColorTheme} 0%, ${invColorTheme2} 100%)` : invColorTheme;

  const invNumberStr = isEditMode ? (invoiceId || "SPW2026070712") : "NEW-TAX-INVOICE";
  const invDateStr = invIssuedDate ? new Date(invIssuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "09 July, 2026";
  const clientNameStr = invClientName || getSafeStr(project?.clientName, "Hyper Mobility Services");
  const productNameStr = getSafeStr(project?.name, "HMS System");

  const subtotal = invItems.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) * Number(item.rate || 0)), 0);
  const taxAmount = (subtotal * invTaxRate) / 100;
  const totalDue = subtotal + taxAmount;
  const amountInWords = numberToIndianWords(totalDue);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* TOP HEADER NAV BAR */}
      <div className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0 z-30 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Cancel & Back</span>
          </button>
          
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Receipt className="text-orange-500 w-5 h-5" />
            <h1 className="font-heading font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
              <span>{isEditMode ? "Edit Tax Invoice Full Page Page" : "Create New Tax Invoice Full Page Page"}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {invNumberStr}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
            variant="secondary"
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border-slate-700"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            variant="primary"
            size="sm"
            disabled={isSaving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs gap-1.5 py-2 shadow-lg shadow-orange-500/20"
          >
            <CheckCircle size={15} />
            <span>{isSaving ? "Saving..." : (isEditMode ? "Save & View Full Studio" : "Generate & View Full Studio")}</span>
          </Button>
        </div>
      </div>

      {/* FULL PAGE SPLIT WORKSPACE (LEFT FORM EDITOR, RIGHT LIVE PREVIEW) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: COMPREHENSIVE FULL PAGE FORM EDITOR (7 COLS) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-slate-900 border-r border-slate-800 p-6 md:p-8 overflow-y-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. BASIC INVOICE DETAILS */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <span className="font-heading font-bold text-xs text-orange-400 uppercase tracking-wider block">
                1. Invoice General Specifications
              </span>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Tax Invoice Title *
                </label>
                <input
                  type="text"
                  required
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  placeholder="e.g. Tax Invoice for Carzzi Web & Mobile App"
                  className="w-full p-3 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Billed By Company
                  </label>
                  <input
                    type="text"
                    required
                    value={invBilledByCompany}
                    onChange={(e) => setInvBilledByCompany(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Billed To Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={invClientName}
                    onChange={(e) => setInvClientName(e.target.value)}
                    placeholder="e.g. Hyper Mobility Services"
                    className="w-full p-2.5 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={invTaxRate}
                    onChange={(e) => setInvTaxRate(Number(e.target.value))}
                    className="w-full p-2 text-xs font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invIssuedDate}
                    onChange={(e) => setInvIssuedDate(e.target.value)}
                    className="w-full p-2 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full p-2 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. DUAL-COLOR GRADIENT & CUSTOM PICKERS */}
            <div className="p-5 bg-orange-950/20 rounded-2xl border border-orange-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-xs text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={15} />
                  <span>2-Color Dual Gradient Theme & Accent Pickers</span>
                </span>

                <div 
                  className="px-3 py-1 rounded-full text-white text-[10px] font-mono font-extrabold shadow-sm border border-white/20"
                  style={{ background: invEnableDualGradient ? `linear-gradient(135deg, ${invColorTheme}, ${invColorTheme2})` : invColorTheme }}
                >
                  {invEnableDualGradient ? "2-Color Gradient" : "Solid Theme"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Attractive 2-Color Preset Combinations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DUAL_COLOR_PRESETS.map((preset) => {
                    const isSelected = invEnableDualGradient && invColorTheme === preset.c1 && invColorTheme2 === preset.c2;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setInvColorTheme(preset.c1);
                          setInvColorTheme2(preset.c2);
                          setInvEnableDualGradient(true);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                          isSelected ? "border-orange-500 bg-slate-900 shadow-md ring-1 ring-orange-500" : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white/20"
                          style={{ background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})` }}
                        />
                        <span className="text-[10px] font-bold text-slate-200 truncate">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-orange-500/20">
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={invColorTheme}
                    onChange={(e) => setInvColorTheme(e.target.value)}
                    className="w-6 h-6 cursor-pointer rounded border-0 p-0"
                  />
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Primary Color 1</span>
                    <span className="font-mono text-xs font-extrabold text-white">{invColorTheme}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={invColorTheme2}
                    onChange={(e) => setInvColorTheme2(e.target.value)}
                    className="w-6 h-6 cursor-pointer rounded border-0 p-0"
                  />
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Secondary Color 2</span>
                    <span className="font-mono text-xs font-extrabold text-white">{invColorTheme2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. LOGO UPLOAD & PAPER THEME */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <span className="font-heading font-bold text-xs text-orange-400 uppercase tracking-wider block">
                3. Company Logo & Background Paper Theme
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company Logo File</label>
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                    <Upload size={14} className="text-orange-500" />
                    <span>{invCompanyLogo ? "Change Logo" : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setInvCompanyLogo(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {invCompanyLogo && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={invCompanyLogo} alt="Logo" className="h-8 max-w-[100px] object-contain rounded bg-white p-1" />
                      <button type="button" onClick={() => setInvCompanyLogo("")} className="text-xs text-red-400 font-bold hover:underline">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Paper Background Theme</label>
                  <select
                    value={invBgTheme}
                    onChange={(e) => setInvBgTheme(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                  >
                    {INVOICE_BG_THEMES.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. WATERMARK CONTROLS */}
            <div className="p-5 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={15} />
                  <span>4. Watermark Contrast & Rotation Angle</span>
                </span>
                <span className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  {Math.round(invWatermarkOpacity * 100)}% Contrast &bull; {invWatermarkRotation}°
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setInvWatermarkType("both")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    invWatermarkType === "both" ? "bg-amber-600 text-white border-amber-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🏢+📝 Logo & Name
                </button>
                <button
                  type="button"
                  onClick={() => setInvWatermarkType("logo")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    invWatermarkType === "logo" ? "bg-amber-600 text-white border-amber-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🏢 Logo Only
                </button>
                <button
                  type="button"
                  onClick={() => setInvWatermarkType("text")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    invWatermarkType === "text" ? "bg-amber-600 text-white border-amber-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  📝 Name Only
                </button>
                <button
                  type="button"
                  onClick={() => setInvWatermarkType("none")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    invWatermarkType === "none" ? "bg-red-600 text-white border-red-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🚫 None
                </button>
              </div>

              {invWatermarkType !== "none" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                      <span>Contrast Opacity</span>
                      <span className="text-amber-400 font-mono">{Math.round(invWatermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.90"
                      step="0.01"
                      value={invWatermarkOpacity}
                      onChange={(e) => setInvWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                      <span>Rotation Angle</span>
                      <span className="text-amber-400 font-mono">{invWatermarkRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="5"
                      value={invWatermarkRotation}
                      onChange={(e) => setInvWatermarkRotation(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. ITEMISED BILLING BREAKDOWN */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-xs text-orange-400 uppercase tracking-wider">
                  5. Deliverables & Pricing Items Breakdown
                </span>
                <button
                  type="button"
                  onClick={() => setInvItems(prev => [...prev, { description: "New Scope Item", qty: 1, rate: 170000 }])}
                  className="text-xs font-bold text-orange-400 hover:underline"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {invItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...invItems];
                        copy[idx].description = e.target.value;
                        setInvItems(copy);
                      }}
                      className="flex-1 p-2 font-bold text-white bg-slate-950 border border-slate-800 rounded-lg outline-none"
                      placeholder="Scope item description"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        const copy = [...invItems];
                        copy[idx].qty = Number(e.target.value);
                        setInvItems(copy);
                      }}
                      className="w-14 p-2 text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-lg outline-none"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const copy = [...invItems];
                        copy[idx].rate = Number(e.target.value);
                        setInvItems(copy);
                        const newTotal = copy.reduce((sum, it) => sum + ((it.qty || 1) * (it.rate || 0)), 0);
                        setInvAmount(newTotal);
                      }}
                      className="w-28 p-2 text-right font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...invItems];
                        copy.splice(idx, 1);
                        setInvItems(copy);
                        const newTotal = copy.reduce((sum, it) => sum + ((it.qty || 1) * (it.rate || 0)), 0);
                        setInvAmount(newTotal);
                      }}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. FOOTER BRANDING & COLOR */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <span className="font-heading font-bold text-xs text-orange-400 uppercase tracking-wider block">
                6. Footer Company Name, Address & Accent Color
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Footer Brand Name</label>
                  <input
                    type="text"
                    value={invFooterCompanyName}
                    onChange={(e) => setInvFooterCompanyName(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-white bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Footer Text Color</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {FOOTER_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setInvFooterColor(preset.hex)}
                        className={`w-6 h-6 rounded-lg border ${invFooterColor === preset.hex ? "ring-2 ring-orange-400 scale-110 border-white" : "border-slate-800"}`}
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                    <input
                      type="color"
                      value={invFooterColor}
                      onChange={(e) => setInvFooterColor(e.target.value)}
                      className="w-6 h-6 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Footer Address & Contact Info</label>
                <textarea
                  rows={2}
                  value={invFooterAddress}
                  onChange={(e) => setInvFooterAddress(e.target.value)}
                  className="w-full p-2.5 text-xs font-medium text-white bg-slate-900 border border-slate-700 rounded-xl outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>{isSaving ? "Saving Invoice Document..." : (isEditMode ? "Save & View Full Studio Page" : "Generate & View Full Studio Page")}</span>
              </Button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: REAL-TIME LIVE DOCUMENT PREVIEW (5 COLS) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-slate-950 p-4 md:p-8 overflow-y-auto flex justify-center items-start">
          <div 
            className="w-full max-w-[760px] rounded-xl shadow-2xl border overflow-hidden text-slate-800 text-xs relative transition-all duration-200"
            style={{ 
              background: pBgCss.includes('gradient') ? pBgCss : pBgCss,
              borderColor: selectedBgObj.borderCss
            }}
          >
            
            {/* ON-SCREEN WATERMARK LAYER */}
            {invWatermarkType !== "none" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                {invWatermarkType === "both" ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-center select-none" style={{ transform: `rotate(${invWatermarkRotation}deg)` }}>
                    {invCompanyLogo ? (
                      <img 
                        src={invCompanyLogo} 
                        alt="Watermark Logo" 
                        style={{ opacity: invWatermarkOpacity }}
                        className="max-w-[260px] max-h-[260px] object-contain drop-shadow-md"
                      />
                    ) : (
                      <div style={{ opacity: invWatermarkOpacity, color: invColorTheme }} className="text-[120px] font-extrabold">
                        🏢
                      </div>
                    )}
                    <div 
                      style={{ opacity: invWatermarkOpacity, color: invColorTheme }}
                      className="text-lg md:text-xl font-black uppercase tracking-widest max-w-[520px]"
                    >
                      {invWatermarkText || "SPESHWAY SOLUTIONS PRIVATE LIMITED"}
                    </div>
                  </div>
                ) : invWatermarkType === "logo" ? (
                  invCompanyLogo ? (
                    <img 
                      src={invCompanyLogo} 
                      alt="Watermark Logo" 
                      style={{ opacity: invWatermarkOpacity, transform: `rotate(${invWatermarkRotation}deg)` }}
                      className="max-w-[350px] max-h-[350px] object-contain select-none drop-shadow-md"
                    />
                  ) : (
                    <div 
                      style={{ opacity: invWatermarkOpacity, color: invColorTheme, transform: `rotate(${invWatermarkRotation}deg)` }}
                      className="text-[140px] font-extrabold select-none"
                    >
                      🏢
                    </div>
                  )
                ) : (
                  <div 
                    style={{ opacity: invWatermarkOpacity, color: invColorTheme, transform: `rotate(${invWatermarkRotation}deg)` }}
                    className="text-xl md:text-2xl font-black text-center uppercase tracking-widest max-w-[600px] select-none p-4"
                  >
                    {invWatermarkText || "SPESHWAY SOLUTIONS PRIVATE LIMITED"}
                  </div>
                )}
              </div>
            )}

            {/* CONTENT LAYER */}
            <div className="relative z-10">
              
              {/* TOP HEADER BANNER (SPACIOUS NAV BAR LAYOUT WITH DUAL GRADIENT) */}
              <div className="p-6 text-white flex justify-between items-center" style={{ background: pHeaderBgStyle }}>
                <div className="flex items-center gap-4">
                  {invCompanyLogo ? (
                    <img 
                      src={invCompanyLogo} 
                      alt="Company Logo" 
                      className="h-10 max-w-[120px] object-contain rounded-lg bg-white p-1 shadow-md"
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                      <Building2 className="w-5 h-5" style={{ color: invColorTheme }} />
                    </div>
                  )}
                  <div>
                    <h1 className="font-extrabold text-sm uppercase tracking-wider text-white leading-tight">
                      {getSafeStr(invBilledByCompany, "SPESHWAY SOLUTIONS PRIVATE LIMITED")}
                    </h1>
                    <p className="text-[10px] text-white/90 font-medium mt-0.5 tracking-wide">
                      {getSafeStr(invBilledBySub, "Software Development Company • IT Solutions")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-5">

                {/* TITLE & INVOICE NO / DATE */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="font-extrabold text-xl uppercase tracking-tight" style={{ color: invColorTheme }}>
                      TAX INVOICE
                    </h2>
                  </div>
                  <div className="text-right text-gray-500 leading-relaxed text-xs">
                    <div>Invoice No: <strong className="text-slate-900 font-mono font-bold">{invNumberStr}</strong></div>
                    <div>Date: <strong className="text-slate-900 font-bold">{invDateStr}</strong></div>
                  </div>
                </div>

                {/* BILLED BY & BILLED TO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: invColorTheme }}>
                      BILLED BY
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {getSafeStr(invBilledByCompany, "Speshway Solutions Private Limited")}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {getSafeStr(invBilledBySub, "Software Development Company")}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: invColorTheme }}>
                      BILLED TO
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {clientNameStr}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Product: {productNameStr}
                    </p>
                  </div>
                </div>

                {/* LINE ITEMS TABLE */}
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-white text-[10px] font-bold uppercase" style={{ background: pHeaderBgStyle }}>
                        <th className="p-2.5">DESCRIPTION</th>
                        <th className="p-2.5 text-right w-24">RATE (INR)</th>
                        <th className="p-2.5 text-right w-28">AMOUNT (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {invItems.map((it: any, idx: number) => {
                        const lineRate = Number(it.rate || 0);
                        const lineAmount = Number(it.qty || 1) * lineRate;
                        const titleStr = getSafeStr(it.description, `${productNameStr} Scope Deliverables`);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900 text-xs">{titleStr}</div>
                            </td>
                            <td className="p-3 text-right font-mono text-gray-700">
                              {lineRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                              {lineAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* TOTALS SUMMARY */}
                <div className="flex justify-end pt-1">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-mono font-bold text-slate-900">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 pb-1.5 border-b border-gray-200">
                      <span>Tax ({invTaxRate}%)</span>
                      <span className="font-mono font-bold text-slate-900">₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-xs pt-0.5" style={{ color: invColorTheme }}>
                      <span>Total Due</span>
                      <span className="font-mono">₹ {totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* AMOUNT IN WORDS BANNER */}
                <div className="bg-white border border-gray-200 border-l-4 p-3 rounded-lg text-[11px] text-slate-700 shadow-xs" style={{ borderLeftColor: invColorTheme }}>
                  <strong className="text-slate-900">Amount in Words:</strong> {amountInWords}
                </div>

                {/* BANK DETAILS BOX */}
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2 shadow-xs">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider block" style={{ color: invColorTheme }}>
                    BANK DETAILS FOR PAYMENT
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">ACCOUNT NAME</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(invBankAccName, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase mt-1.5">ACCOUNT NUMBER</div>
                      <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(invBankAccNo, '018326900000850')}</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">BRANCH</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(invBankBranch, 'HITECH CITY')}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase mt-1.5">IFSC CODE</div>
                      <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(invBankIfsc, 'YESB0000183')}</div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC FOOTER BRAND NAME, ADDRESS & CUSTOM FOOTER COLOR */}
                <div className="pt-4 border-t border-gray-200 text-center text-[9px] leading-relaxed" style={{ color: invFooterColor }}>
                  <strong className="font-extrabold text-[10px]" style={{ color: invFooterColor }}>{invFooterCompanyName}</strong><br/>
                  {invFooterAddress}
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
