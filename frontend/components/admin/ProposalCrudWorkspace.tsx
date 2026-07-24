"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle, 
  ChevronRight,
  Eye,
  Receipt,
  Download,
  Printer,
  DollarSign,
  Calendar,
  Building2,
  X,
  Palette,
  Upload,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Type,
  RotateCw,
  MapPin
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

// Single Solid Color Options
const INVOICE_COLOR_THEMES = [
  { id: "amber", name: "Warm Amber", hex: "#c2410c" },
  { id: "navy", name: "Speshway Navy", hex: "#0b3c86" },
  { id: "midnight", name: "Midnight Black", hex: "#0f172a" },
  { id: "emerald", name: "Emerald Corporate", hex: "#047857" },
  { id: "purple", name: "Royal Purple", hex: "#5b21b6" },
  { id: "crimson", name: "Crimson Red", hex: "#9f1239" },
  { id: "teal", name: "Ocean Teal", hex: "#0f766e" }
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

// Helper to guarantee string output for React JSX rendering
const getSafeStr = (val: any, fallback: string = ""): string => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.title || val.name || val.label || fallback;
  return String(val);
};

export default function ProposalCrudWorkspace({ projectId }: ProposalCrudWorkspaceProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"proposals" | "invoices">("proposals");

  // Create & Edit Invoice Modal State
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
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

  // Dual Color Gradient & Theme Settings
  const [invColorTheme, setInvColorTheme] = useState<string>("#c2410c"); // Color 1 (Primary)
  const [invColorTheme2, setInvColorTheme2] = useState<string>("#f97316"); // Color 2 (Secondary Accent)
  const [invEnableDualGradient, setInvEnableDualGradient] = useState<boolean>(true); // Enable 2-Color Blend Mode

  const [invCompanyLogo, setInvCompanyLogo] = useState<string>("");
  const [invBgTheme, setInvBgTheme] = useState<string>("clean-white");

  // Footer Settings & Dynamic Footer Color
  const [invFooterCompanyName, setInvFooterCompanyName] = useState<string>("Speshway Solutions Private Limited");
  const [invFooterAddress, setInvFooterAddress] = useState<string>("T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
  const [invFooterColor, setInvFooterColor] = useState<string>("#334155");

  // Watermark Settings (Supports: "both" | "logo" | "text" | "none", Opacity 5%-90%, Rotation -90deg to +90deg)
  const [invWatermarkType, setInvWatermarkType] = useState<"both" | "logo" | "text" | "none">("both");
  const [invWatermarkText, setInvWatermarkText] = useState<string>("SPESHWAY SOLUTIONS PRIVATE LIMITED");
  const [invWatermarkOpacity, setInvWatermarkOpacity] = useState<number>(0.25);
  const [invWatermarkRotation, setInvWatermarkRotation] = useState<number>(-25);

  const [invItems, setInvItems] = useState<{ description: string; qty: number; rate: number }[]>([
    { description: "Custom Scope Development Deliverables", qty: 1, rate: 170000 }
  ]);

  // Live On-Screen Preview Modal State
  const [showPreviewInvoiceModal, setShowPreviewInvoiceModal] = useState(false);
  const [previewingInvoice, setPreviewingInvoice] = useState<any>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(0.8);

  const loadProjectAndData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch project details
      let currentProj = null;
      try {
        const projRes = await fetch(`${API_URL}/crm/our-projects`);
        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.data)) {
          currentProj = projData.data.find((p: any) => p && (p.id === projectId || (p.name && getSafeStr(p.name).toLowerCase() === String(projectId).toLowerCase())));
        }
      } catch (err) {
        console.error("Error loading project info:", err);
      }

      if (!currentProj) {
        currentProj = {
          id: projectId,
          name: projectId === "OPRJ-6561" ? "hms" : (projectId === "OPRJ-4838" ? "hrms" : "Build Your Thoughts Workspace"),
          title: projectId === "OPRJ-6561" ? "Hospital Management System (HMS)" : (projectId === "OPRJ-4838" ? "Human Resource Management System (HRMS)" : "Build Your Thoughts Workspace"),
          category: "Web & Mobile Ecosystem",
          clientName: "Internal / Showcase",
          budget: 185000,
          status: "Live Production",
          description: "Internal showcase project management ecosystem."
        };
      }
      setProject(currentProj);

      // 2. Fetch quotations / proposals for this project strictly
      let matchingQuotes: any[] = [];
      try {
        const quoteRes = await fetch(`${API_URL}/crm/quotation`);
        const quoteData = await quoteRes.json();
        if (quoteData.success && Array.isArray(quoteData.data)) {
          matchingQuotes = quoteData.data.filter((q: any) => 
            q && q.projectId && (q.projectId === currentProj.id || q.projectId === projectId)
          );
          setProposals(matchingQuotes);
        }
      } catch (err) {
        console.error("Error loading quotations:", err);
        setProposals([]);
      }

      // 3. Fetch ONLY user-generated invoices from DB for this project
      try {
        const invRes = await fetch(`${API_URL}/crm/invoice`);
        const invData = await invRes.json();
        if (invData.success && Array.isArray(invData.data)) {
          const projectInvoices = invData.data.filter((inv: any) => 
            inv && (
              inv.projectId === currentProj.id || 
              inv.projectId === projectId ||
              (matchingQuotes.length > 0 && matchingQuotes.some(q => q && (q.id === inv.proposalId || q.number === inv.proposalId)))
            )
          );
          setInvoices(projectInvoices);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      }

    } catch (err) {
      console.error("Error loading project proposals and invoices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProjectAndData();
    }
  }, [projectId]);

  // Handle selecting a proposal to auto-fill Create Invoice Modal
  const handleSelectProposalForInvoice = (propId: string) => {
    setSelectedProposalForInv(propId);
    const selectedProp = proposals.find(p => p && (p.id === propId || p.number === propId));
    if (selectedProp) {
      const safePropTitle = getSafeStr(selectedProp.title, "Custom Proposal");
      setInvTitle(`Tax Invoice for ${safePropTitle}`);
      setInvClientName(getSafeStr(selectedProp.clientName || project?.clientName, "Hyper Mobility Services"));
      setInvCategory(getSafeStr(selectedProp.projectType, "Web Application"));
      
      const items = Array.isArray(selectedProp.serviceItems) && selectedProp.serviceItems.length > 0 
        ? selectedProp.serviceItems.map((it: any) => ({
            description: getSafeStr(it.description || it.title, "Deliverable Item"),
            qty: Number(it.qty || 1),
            rate: Number(it.rate || 0)
          }))
        : [
            { description: `${safePropTitle} Scope Deliverables`, qty: 1, rate: Number(selectedProp.planBPrice || selectedProp.planAPrice || 170000) }
          ];
      setInvItems(items);
      const total = items.reduce((sum: number, it: any) => sum + ((it.qty || 1) * (it.rate || 0)), 0);
      setInvAmount(total);
    }
  };

  // Open Create Invoice Modal with fresh state
  const handleOpenCreateInvoiceModal = () => {
    setEditingInvoice(null);
    const firstProp = proposals[0];
    const defaultPropId = firstProp ? (firstProp.id || firstProp.number || "") : "";
    setSelectedProposalForInv(defaultPropId);
    
    const safeProjName = getSafeStr(project?.name || project?.title, String(projectId));
    const safeClientName = getSafeStr(project?.clientName, "Hyper Mobility Services");

    setInvCompanyLogo("");
    setInvBgTheme("clean-white");
    setInvColorTheme("#c2410c");
    setInvColorTheme2("#f97316");
    setInvEnableDualGradient(true);
    setInvFooterCompanyName("Speshway Solutions Private Limited");
    setInvFooterAddress("T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
    setInvFooterColor("#334155");
    setInvWatermarkType("both");
    setInvWatermarkText(invBilledByCompany.toUpperCase());
    setInvWatermarkOpacity(0.25);
    setInvWatermarkRotation(-25);

    if (firstProp) {
      handleSelectProposalForInvoice(defaultPropId);
    } else {
      setInvTitle(`Tax Invoice for ${safeProjName}`);
      setInvClientName(safeClientName);
      setInvCategory(getSafeStr(project?.category, "Web & Mobile Application"));
      setInvAmount(170000);
      setInvItems([{ 
        description: `Design, development & delivery of web and mobile applications for the ${safeProjName} product, provided to ${safeClientName}`, 
        qty: 1, 
        rate: 170000 
      }]);
    }
    setShowCreateInvoiceModal(true);
  };

  // Open Edit Invoice Modal with existing invoice data
  const handleOpenEditInvoiceModal = (inv: any) => {
    setEditingInvoice(inv);
    setSelectedProposalForInv(getSafeStr(inv.proposalId));
    setInvTitle(getSafeStr(inv.title));
    setInvClientName(getSafeStr(inv.clientName));
    setInvCategory(getSafeStr(inv.projectType, "Web Application"));
    setInvBilledByCompany(getSafeStr(inv.billedByCompany, "Speshway Solutions Private Limited"));
    setInvBilledBySub(getSafeStr(inv.billedBySub, "Software Development Company"));
    setInvTaxRate(inv.taxRate !== undefined ? Number(inv.taxRate) : 18);
    setInvIssuedDate(getSafeStr(inv.issuedDate, new Date().toISOString().split("T")[0]));
    setInvDueDate(getSafeStr(inv.dueDate, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]));
    setInvBankAccName(getSafeStr(inv.bankAccName, "SPESHWAY SOLUTIONS PRIVATE LIMITED"));
    setInvBankAccNo(getSafeStr(inv.bankAccNo, "018326900000850"));
    setInvBankBranch(getSafeStr(inv.bankBranch, "HITECH CITY"));
    setInvBankIfsc(getSafeStr(inv.bankIfsc, "YESB0000183"));
    setInvColorTheme(getSafeStr(inv.colorTheme, "#c2410c"));
    setInvColorTheme2(getSafeStr(inv.colorTheme2, "#f97316"));
    setInvEnableDualGradient(inv.enableDualGradient !== undefined ? Boolean(inv.enableDualGradient) : true);
    setInvCompanyLogo(getSafeStr(inv.companyLogoUrl || inv.logoUrl));
    setInvBgTheme(getSafeStr(inv.bgTheme, "clean-white"));
    setInvFooterCompanyName(getSafeStr(inv.footerCompanyName, inv.billedByCompany || "Speshway Solutions Private Limited"));
    setInvFooterAddress(getSafeStr(inv.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com"));
    setInvFooterColor(getSafeStr(inv.footerColor, "#334155"));
    setInvWatermarkType((inv.watermarkType || "both") as any);
    setInvWatermarkText(getSafeStr(inv.watermarkText, inv.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED"));
    setInvWatermarkOpacity(inv.watermarkOpacity !== undefined ? Number(inv.watermarkOpacity) : 0.25);
    setInvWatermarkRotation(inv.watermarkRotation !== undefined ? Number(inv.watermarkRotation) : -25);

    const items = Array.isArray(inv.serviceItems) && inv.serviceItems.length > 0 ? inv.serviceItems.map((it: any) => ({
      description: getSafeStr(it.description || it.title, "Scope Item"),
      qty: Number(it.qty || 1),
      rate: Number(it.rate || 0)
    })) : [
      { description: getSafeStr(inv.title, "Scope Deliverables"), qty: 1, rate: Number(inv.amount || 170000) }
    ];
    setInvItems(items);
    setInvAmount(Number(inv.amount || items.reduce((sum: number, it: any) => sum + ((it.qty || 1) * (it.rate || 0)), 0)));
    setShowCreateInvoiceModal(true);
  };

  // Open Live On-Screen Preview Modal for an Invoice
  const handleOpenPreviewModal = (inv: any) => {
    setPreviewingInvoice(inv);
    setPreviewZoom(0.8);
    setShowPreviewInvoiceModal(true);
  };

  // Construct draft object from current form inputs and open Live Preview Modal
  const handlePreviewCurrentDraft = () => {
    const safeProjName = getSafeStr(project?.name || project?.title, String(projectId));
    const draftInvoice = {
      id: editingInvoice ? (editingInvoice.id || editingInvoice.number) : `DRAFT-SPW${Date.now().toString().slice(-4)}`,
      number: editingInvoice ? (editingInvoice.id || editingInvoice.number) : `DRAFT-SPW${Date.now().toString().slice(-4)}`,
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

    setPreviewingInvoice(draftInvoice);
    setPreviewZoom(0.8);
    setShowPreviewInvoiceModal(true);
  };

  // Create or Update user-generated invoice (Full CRUD)
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = Boolean(editingInvoice);
    const invId = isEdit ? (editingInvoice.id || editingInvoice.number) : `SPW${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${Date.now().toString().slice(-4)}`;
    
    const selectedProp = proposals.find(p => p && (p.id === selectedProposalForInv || p.number === selectedProposalForInv));
    const safeProjName = getSafeStr(project?.name || project?.title, String(projectId));

    const invoicePayload = {
      id: invId,
      number: invId,
      proposalId: selectedProposalForInv || (selectedProp ? (selectedProp.id || selectedProp.number) : "CUSTOM"),
      projectId: project?.id || projectId,
      projectName: safeProjName,
      productName: safeProjName,
      clientName: invClientName || getSafeStr(project?.clientName, "Hyper Mobility Services"),
      billedByCompany: invBilledByCompany,
      billedBySub: invBilledBySub,
      title: invTitle.trim() || `Tax Invoice for ${safeProjName}`,
      proposalTitle: selectedProp ? getSafeStr(selectedProp.title) : (invTitle || "Custom Proposal Invoice"),
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
      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit ? `${API_URL}/crm/invoice/${encodeURIComponent(invId)}` : `${API_URL}/crm/invoice`;

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload)
      }).then(r => r.json());

      const savedInvoice = res.data || invoicePayload;

      if (isEdit) {
        setInvoices(prev => prev.map(i => (i.id === invId || i.number === invId) ? savedInvoice : i));
      } else {
        setInvoices(prev => [savedInvoice, ...prev]);
      }
    } catch (err) {
      console.error("Error saving invoice:", err);
      if (isEdit) {
        setInvoices(prev => prev.map(i => (i.id === invId || i.number === invId) ? invoicePayload : i));
      } else {
        setInvoices(prev => [invoicePayload, ...prev]);
      }
    }

    setShowCreateInvoiceModal(false);
    setEditingInvoice(null);
  };

  // Handle deleting proposal
  const handleDeleteProposal = async (proposalId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete proposal '${title}'?`)) return;

    try {
      await fetch(`${API_URL}/crm/quotation/${proposalId}`, {
        method: "DELETE"
      });
      setProposals(prev => prev.filter(p => p.id !== proposalId && p.number !== proposalId));
    } catch (err) {
      setProposals(prev => prev.filter(p => p.id !== proposalId && p.number !== proposalId));
    }
  };

  // Handle deleting invoice
  const handleDeleteInvoice = async (invoiceId: string, invTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete invoice '${invoiceId}' for '${invTitle}'?`)) return;

    try {
      await fetch(`${API_URL}/crm/invoice/${invoiceId}`, {
        method: "DELETE"
      });
      setInvoices(prev => prev.filter(i => i.id !== invoiceId && i.number !== invoiceId));
    } catch (err) {
      setInvoices(prev => prev.filter(i => i.id !== invoiceId && i.number !== invoiceId));
    }
  };

  // PDF Exporter with Dual-Color Gradient Header & Styling
  const handleDownloadInvoicePdf = (inv: any) => {
    const projName = getSafeStr(project?.name || inv?.projectName || inv?.productName, "Showcase Project");
    const clientName = getSafeStr(inv?.clientName || project?.clientName, "Hyper Mobility Services");
    const productName = getSafeStr(inv?.productName || project?.name, "Carzzi");
    const invNumber = getSafeStr(inv?.number || inv?.id, "SPW2026070712");
    const invDateStr = inv?.issuedDate ? new Date(inv.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "09 July, 2026";
    
    const themeColor1 = getSafeStr(inv?.colorTheme, "#c2410c");
    const themeColor2 = getSafeStr(inv?.colorTheme2, "#f97316");
    const isDual = inv?.enableDualGradient !== false && Boolean(themeColor2);
    const headerBgStyle = isDual ? `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)` : themeColor1;

    const logoUrl = getSafeStr(inv?.companyLogoUrl || inv?.logoUrl);

    const footerCompanyNameStr = getSafeStr(inv?.footerCompanyName, inv?.billedByCompany || "Speshway Solutions Private Limited");
    const footerAddressStr = getSafeStr(inv?.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
    const footerTextColor = getSafeStr(inv?.footerColor, "#334155");

    const watermarkType = inv?.watermarkType || "both";
    const watermarkText = getSafeStr(inv?.watermarkText, inv?.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED");
    const watermarkOpacity = inv?.watermarkOpacity !== undefined ? Number(inv?.watermarkOpacity) : 0.25;
    const watermarkRotation = inv?.watermarkRotation !== undefined ? Number(inv?.watermarkRotation) : -25;

    const selectedBgObj = INVOICE_BG_THEMES.find(t => t.id === inv?.bgTheme) || INVOICE_BG_THEMES[0];
    const bgCss = selectedBgObj.bgCss;
    
    const items = Array.isArray(inv?.serviceItems) && inv.serviceItems.length > 0 ? inv.serviceItems : [
      { 
        title: `${productName} Web & Mobile Application`, 
        description: `Design, development & delivery of web and mobile applications for the ${productName} product, provided to ${clientName}`,
        qty: 1, 
        rate: Number(inv?.amount || 170000)
      }
    ];
    
    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) * Number(item.rate || 0)), 0);
    const taxRate = inv?.taxRate !== undefined ? Number(inv.taxRate) : 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalDue = subtotal + taxAmount;
    const amountInWords = numberToIndianWords(totalDue);

    const logoHtml = logoUrl ? `
      <img src="${logoUrl}" alt="Logo" style="height: 42px; max-width: 130px; object-fit: contain; background: #ffffff; padding: 4px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
    ` : `
      <div style="background: #ffffff; border-radius: 10px; padding: 8px 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${themeColor1}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    `;

    const renderWatermarkHtml = () => {
      if (watermarkType === "none") return "";
      if (watermarkType === "both") {
        return `
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; pointer-events: none; z-index: 0; overflow: hidden; transform: rotate(${watermarkRotation}deg);">
            ${logoUrl ? `
              <img src="${logoUrl}" alt="Watermark Logo" style="max-width: 280px; max-height: 280px; opacity: ${watermarkOpacity}; font-weight: bold;" />
            ` : `
              <div style="font-size: 130px; font-weight: 900; opacity: ${watermarkOpacity}; color: ${themeColor1}; user-select: none;">🏢</div>
            `}
            <div style="font-size: 24px; font-weight: 900; opacity: ${watermarkOpacity}; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 2px; text-align: center; max-width: 580px; user-select: none;">
              ${watermarkText}
            </div>
          </div>
        `;
      }
      if (watermarkType === "logo") {
        return `
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 0; overflow: hidden;">
            ${logoUrl ? `
              <img src="${logoUrl}" alt="Watermark Logo" style="max-width: 400px; max-height: 400px; opacity: ${watermarkOpacity}; transform: rotate(${watermarkRotation}deg);" />
            ` : `
              <div style="font-size: 160px; font-weight: 900; opacity: ${watermarkOpacity}; color: ${themeColor1}; transform: rotate(${watermarkRotation}deg); user-select: none;">🏢</div>
            `}
          </div>
        `;
      }
      return `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 0; overflow: hidden;">
          <div style="font-size: 32px; font-weight: 900; opacity: ${watermarkOpacity}; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 2px; transform: rotate(${watermarkRotation}deg); text-align: center; max-width: 650px; user-select: none;">
            ${watermarkText}
          </div>
        </div>
      `;
    };

    const htmlContent = `
      <div class="pdf-page" style="width: 790px; padding: 0; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: ${bgCss.includes('gradient') ? bgCss : bgCss}; box-sizing: border-box; overflow: hidden;">
        
        <!-- BACKGROUND WATERMARK LAYER -->
        ${renderWatermarkHtml()}

        <div style="position: relative; z-index: 1;">
          
          <!-- TOP HEADER BANNER (ATTRACTIVE 2-COLOR DUAL GRADIENT NAV BAR) -->
          <div style="background: ${headerBgStyle}; color: #ffffff; padding: 22px 35px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 16px;">
              ${logoHtml}
              <div style="margin-left: 4px;">
                <h1 style="margin: 0; font-size: 16px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #ffffff; line-height: 1.3;">
                  ${getSafeStr(inv?.billedByCompany, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}
                </h1>
                <p style="margin: 3px 0 0 0; font-size: 10.5px; color: rgba(255, 255, 255, 0.90); font-weight: 500; letter-spacing: 0.3px;">
                  ${getSafeStr(inv?.billedBySub, 'Software Development Company • IT Solutions')}
                </p>
              </div>
            </div>
          </div>

          <div style="padding: 28px 35px 35px 35px;">

            <!-- TITLE & INVOICE NO / DATE HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
              <div>
                <h2 style="margin: 0; font-size: 22px; color: ${themeColor1}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">TAX INVOICE</h2>
              </div>
              <div style="text-align: right; font-size: 12px; line-height: 1.6;">
                <div style="color: #64748b;">Invoice No: <strong style="color: #0f172a; font-weight: 700;">${invNumber}</strong></div>
                <div style="color: #64748b;">Date: <strong style="color: #0f172a; font-weight: 700;">${invDateStr}</strong></div>
              </div>
            </div>

            <!-- BILLED BY & BILLED TO BOXES -->
            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
              <!-- BILLED BY -->
              <div style="flex: 1; background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 14px 18px;">
                <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">BILLED BY</span>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${getSafeStr(inv?.billedByCompany, 'Speshway Solutions Private Limited')}</h4>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #475569;">${getSafeStr(inv?.billedBySub, 'Software Development Company')}</p>
              </div>

              <!-- BILLED TO -->
              <div style="flex: 1; background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 14px 18px;">
                <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">BILLED TO</span>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${clientName}</h4>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #475569;">Product: ${productName}</p>
              </div>
            </div>

            <!-- TABLE HEADER (ATTRACTIVE GRADIENT ACCENT) -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: ${headerBgStyle}; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                  <th style="padding: 10px 14px; text-align: left; border: none;">DESCRIPTION</th>
                  <th style="padding: 10px 14px; text-align: right; width: 120px; border: none;">RATE (INR)</th>
                  <th style="padding: 10px 14px; text-align: right; width: 130px; border: none;">AMOUNT (INR)</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((it: any) => {
                  const lineRate = Number(it.rate || 0);
                  const lineAmount = Number(it.qty || 1) * lineRate;
                  const titleStr = getSafeStr(it.title || it.description, `${productName} Web & Mobile Application`);
                  const descStr = getSafeStr(it.details || it.description, `Design, development & delivery of web and mobile applications for the ${productName} product, provided to ${clientName}`);
                  return `
                    <tr style="background: #ffffff;">
                      <td style="padding: 16px 14px 12px 14px; border-bottom: 1px solid ${selectedBgObj.borderCss}; vertical-align: top;">
                        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${titleStr}</div>
                        <div style="font-size: 11px; color: #64748b; line-height: 1.5; max-width: 480px;">${descStr}</div>
                      </td>
                      <td style="padding: 16px 14px 12px 14px; border-bottom: 1px solid ${selectedBgObj.borderCss}; text-align: right; font-size: 12px; font-weight: 500; color: #334155; vertical-align: top;">
                        ${lineRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style="padding: 16px 14px 12px 14px; border-bottom: 1px solid ${selectedBgObj.borderCss}; text-align: right; font-size: 12px; font-weight: 500; color: #0f172a; vertical-align: top;">
                        ${lineAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <!-- TOTALS SUMMARY BLOCK -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
              <div style="width: 320px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #475569;">
                  <span>Subtotal</span>
                  <span style="font-weight: 600; color: #0f172a;">₹ ${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #475569; border-bottom: 1px solid #cbd5e1;">
                  <span>Tax (${taxRate}%)</span>
                  <span style="font-weight: 600; color: #0f172a;">₹ ${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0 6px 0; font-size: 14px; font-weight: 800; color: ${themeColor1};">
                  <span>Total Due</span>
                  <span>₹ ${totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <!-- AMOUNT IN WORDS BANNER -->
            <div style="background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-left: 4px solid ${themeColor1}; padding: 12px 16px; border-radius: 4px; font-size: 11px; margin-bottom: 25px; color: #334155;">
              <strong>Amount in Words:</strong> ${amountInWords}
            </div>

            <!-- BANK DETAILS BOX -->
            <div style="background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 16px 20px; font-size: 11px;">
              <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">BANK DETAILS FOR PAYMENT</span>
              <div style="display: flex; gap: 40px;">
                <div style="flex: 1.2;">
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">ACCOUNT NAME</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px; margin-bottom: 10px;">${getSafeStr(inv?.bankAccName, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}</div>
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">ACCOUNT NUMBER</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${getSafeStr(inv?.bankAccNo, '018326900000850')}</div>
                </div>
                <div style="flex: 1;">
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">BRANCH</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px; margin-bottom: 10px;">${getSafeStr(inv?.bankBranch, 'HITECH CITY')}</div>
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">IFSC CODE</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${getSafeStr(inv?.bankIfsc, 'YESB0000183')}</div>
                </div>
              </div>
            </div>

            <!-- DYNAMIC FOOTER BRAND NAME, ADDRESS & DYNAMIC FOOTER COLOR -->
            <div style="margin-top: 50px; text-align: center; font-size: 10px; color: ${footerTextColor}; border-top: 1px solid ${selectedBgObj.borderCss}; padding-top: 15px; line-height: 1.6;">
              <strong style="color: ${footerTextColor}; font-size: 11px; font-weight: 800;">${footerCompanyNameStr}</strong><br/>
              ${footerAddressStr}
            </div>

          </div>
        </div>
      </div>
    `;

    triggerDirectPdfDownload(htmlContent, `INVOICE_${invNumber}.pdf`);
  };

  const filteredProposals = proposals.filter((p: any) => {
    if (!p) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleStr = getSafeStr(p.title).toLowerCase();
    const idStr = getSafeStr(p.id).toLowerCase();
    const numStr = getSafeStr(p.number).toLowerCase();
    const statusStr = getSafeStr(p.status).toLowerCase();
    return titleStr.includes(query) || idStr.includes(query) || numStr.includes(query) || statusStr.includes(query);
  });

  const filteredInvoices = invoices.filter((inv: any) => {
    if (!inv) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleStr = getSafeStr(inv.title).toLowerCase();
    const propTitleStr = getSafeStr(inv.proposalTitle).toLowerCase();
    const idStr = getSafeStr(inv.id).toLowerCase();
    const numStr = getSafeStr(inv.number).toLowerCase();
    return titleStr.includes(query) || propTitleStr.includes(query) || idStr.includes(query) || numStr.includes(query);
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading Project Proposals & Invoices Workspace...</p>
      </div>
    );
  }

  const projName = getSafeStr(project?.name || project?.title, String(projectId));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* BREADCRUMB & BACK ACTION */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <button 
            onClick={() => router.push("/admin/dashboard?tab=our-projects")}
            className="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Our Projects</span>
          </button>
          <span>/</span>
          <span className="text-gray-700 font-mono">{getSafeStr(project?.id, String(projectId))}</span>
          <span>/</span>
          <span className="text-orange-600 font-extrabold">Proposals & Invoices Workspace</span>
        </div>

        <Button
          onClick={() => router.push("/admin/dashboard?tab=our-projects")}
          variant="secondary"
          size="sm"
          className="gap-1.5 text-xs font-bold"
        >
          <ArrowLeft size={14} /> Back to Projects Showcase
        </Button>
      </div>

      {/* PROJECT DETAILS HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white shadow-xl border border-orange-500/20 relative overflow-hidden">
        <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-md uppercase">
                {getSafeStr(project?.id, String(projectId))}
              </span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-md uppercase">
                {getSafeStr(project?.category, "Web & Mobile Ecosystem")}
              </span>
              <span className="text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-0.5 rounded-md uppercase">
                {getSafeStr(project?.status, "Live Production")}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              {projName} &bull; Proposals & Invoices Workspace
            </h1>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Manage proposals, generate custom proposal tax invoices manually, download PDF reports, and manage billing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/create`)}
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 gap-2 py-3 px-5 rounded-2xl border-0"
            >
              <Plus size={16} />
              <span>Create New Proposal (Dedicated Page)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* WORKSPACE NAVIGATION TABS (PROPOSALS VS INVOICES) */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveWorkspaceTab("proposals")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeWorkspaceTab === "proposals"
              ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <FileText size={16} />
          <span>Proposals Workspace</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeWorkspaceTab === "proposals" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
          }`}>
            {proposals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab("invoices")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeWorkspaceTab === "invoices"
              ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Receipt size={16} />
          <span>Invoices Page</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeWorkspaceTab === "invoices" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
          }`}>
            {invoices.length}
          </span>
        </button>
      </div>

      {/* SEARCH BAR & HEADER ACTIONS */}
      <div className="flex justify-between items-center flex-wrap gap-4 pt-1">
        <div>
          <h2 className="font-heading font-bold text-base text-[#1a0f00] flex items-center gap-2">
            {activeWorkspaceTab === "proposals" ? (
              <>
                <FileText className="w-5 h-5 text-orange-600" />
                <span>Proposal Names & Quotations List</span>
              </>
            ) : (
              <>
                <Receipt className="w-5 h-5 text-orange-600" />
                <span>User Generated Invoices List</span>
              </>
            )}
          </h2>
          <p className="text-xs text-gray-500">
            {activeWorkspaceTab === "proposals"
              ? `Total proposals: ${proposals.length}. Every operation runs on a dedicated page.`
              : `Total user generated invoices: ${invoices.length}. Manually create, view, download PDF, and delete proposal invoices.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeWorkspaceTab === "proposals" ? "Search proposal titles..." : "Search invoice numbers & titles..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
          </div>

          {activeWorkspaceTab === "proposals" ? (
            <Button
              onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/create`)}
              variant="primary"
              size="sm"
              className="gap-1.5 whitespace-nowrap text-xs py-2"
            >
              <Plus size={14} /> Create Proposal Page
            </Button>
          ) : (
            <Button
              onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/invoices/create`)}
              variant="primary"
              size="sm"
              className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5 whitespace-nowrap text-xs py-2 shadow-sm font-bold"
            >
              <Plus size={14} /> + Create New Invoice Page
            </Button>
          )}
        </div>
      </div>

      {/* -------------------- TAB 1: PROPOSALS WORKSPACE -------------------- */}
      {activeWorkspaceTab === "proposals" && (
        <>
          {filteredProposals.length === 0 ? (
            <div className="p-12 bg-white border border-dashed border-gray-200 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
              <FileText className="w-12 h-12 text-gray-300" />
              <h3 className="font-heading font-bold text-gray-800 text-base">No Proposals Found</h3>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                There are no proposals created for <strong>{projName}</strong> yet. Click below to create your first proposal.
              </p>
              <Button
                onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/create`)}
                variant="primary"
                size="sm"
                className="mt-2 gap-1.5"
              >
                <Plus size={14} /> Create Proposal Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((prop, idx) => {
                const proposalId = getSafeStr(prop.id || prop.number, `PROP-${idx}`);
                const startingPrice = Number(prop.planBPrice || prop.planAPrice || (project?.budget || 0));
                const safeTitle = getSafeStr(prop.title, "Custom Proposal Document");

                return (
                  <div 
                    key={proposalId}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative"
                  >
                    <div>
                      {/* BADGES & ACTIONS */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                            {proposalId}
                          </span>
                          <span className="text-[9px] font-bold uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                            {getSafeStr(prop.status, "APPROVED")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/${proposalId}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="Edit Proposal Page"
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProposal(proposalId, safeTitle)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Proposal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* PROPOSAL TITLE & SUBTITLE */}
                      <h3 
                        onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/${proposalId}`)}
                        className="font-heading font-extrabold text-sm text-[#1a0f00] mt-3 hover:text-orange-600 cursor-pointer transition-colors line-clamp-2"
                      >
                        {safeTitle}
                      </h3>
                      <span className="text-[11px] text-gray-400 block mt-1">
                        Client: {getSafeStr(prop.clientName || project?.clientName, "Enterprise Client")}
                      </span>

                      {/* SUMMARY STATS */}
                      <div className="mt-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="text-[11px]">Estimate Tier Budget:</span>
                          <span className="font-bold text-[#1a0f00]">₹{startingPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="text-[11px]">Scope Category:</span>
                          <span className="font-semibold text-gray-700">{getSafeStr(prop.projectType, "Web & Mobile")}</span>
                        </div>
                        {prop.createdDate && (
                          <div className="flex justify-between items-center text-gray-400 text-[10px]">
                            <span>Created:</span>
                            <span>{getSafeStr(prop.createdDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTTOM PRIMARY BUTTON */}
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                      <Button
                        onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/proposals/${proposalId}`)}
                        variant="primary"
                        size="sm"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Open PROPOSAL PAGES (8 SECTIONS)</span>
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* -------------------- TAB 2: INVOICES WORKSPACE -------------------- */}
      {activeWorkspaceTab === "invoices" && (
        <>
          {filteredInvoices.length === 0 ? (
            <div className="p-12 bg-white border border-dashed border-gray-200 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
              <Receipt className="w-12 h-12 text-gray-300" />
              <h3 className="font-heading font-bold text-gray-800 text-base">No Invoices Generated Yet</h3>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                There are no user generated invoices for <strong>{projName}</strong> yet. Click the button below to generate a new invoice manually.
              </p>
              <Button
                onClick={handleOpenCreateInvoiceModal}
                variant="primary"
                size="sm"
                className="mt-2 bg-orange-600 hover:bg-orange-500 text-white gap-1.5 font-bold"
              >
                <Plus size={14} /> + Create New Invoice
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvoices.map((inv, idx) => {
                const invId = getSafeStr(inv.id || inv.number, `INV-${idx}`);
                const safeInvTitle = getSafeStr(inv.title, `Tax Invoice for ${projName}`);
                const safePropTitle = getSafeStr(inv.proposalTitle);
                const safeAmount = Number(inv.amount || 170000);
                const themeHex1 = getSafeStr(inv.colorTheme, "#c2410c");
                const themeHex2 = getSafeStr(inv.colorTheme2, "#f97316");

                return (
                  <div 
                    key={invId}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative overflow-hidden"
                  >
                    {/* Top Color Indicator Accent Line with Dual Gradient */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5" 
                      style={{ background: inv.enableDualGradient !== false ? `linear-gradient(90deg, ${themeHex1}, ${themeHex2})` : themeHex1 }} 
                    />

                    <div>
                      {/* INVOICE NUMBER & ACTIONS */}
                      <div className="flex justify-between items-start gap-2 pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                            {invId}
                          </span>
                          {inv.proposalId && (
                            <span className="text-[9px] font-mono font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                              REF: {getSafeStr(inv.proposalId)}
                            </span>
                          )}
                          <span className="text-[9px] font-bold uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                            {getSafeStr(inv.status, "PAID")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/invoices/${invId}`)}
                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="Open Standalone Full Page Invoice Studio"
                          >
                            <Maximize2 size={14} />
                            <span>Full Page</span>
                          </button>
                          <button
                            onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/invoices/${invId}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="Edit Invoice Full Page"
                          >
                            <Edit3 size={14} />
                            <span>Edit Page</span>
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invId, safeInvTitle)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* INVOICE TITLE & PROPOSAL TITLE */}
                      <h3 
                        onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/invoices/${invId}`)}
                        className="font-heading font-extrabold text-sm text-[#1a0f00] mt-3 hover:text-orange-600 cursor-pointer transition-colors line-clamp-2"
                      >
                        {safeInvTitle}
                      </h3>
                      {safePropTitle && (
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                          Proposal: <strong>{safePropTitle}</strong>
                        </p>
                      )}

                      {/* SUMMARY STATS */}
                      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-gray-150 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="text-[11px] font-medium">Billed Client:</span>
                          <span className="font-bold text-[#1a0f00]">{getSafeStr(inv.clientName || project?.clientName, "Hyper Mobility Services")}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="text-[11px] font-medium">Scope Category:</span>
                          <span className="font-semibold text-gray-700">{getSafeStr(inv.projectType, "Web Application")}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-gray-200">
                          <span className="text-[11px] font-bold text-gray-700">Total Billed Amount:</span>
                          <span className="font-mono font-extrabold text-sm text-orange-600">₹{safeAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400 text-[10px] pt-1">
                          <span>Issued: {getSafeStr(inv.issuedDate, "2026-07-24")}</span>
                          <span>Due: {getSafeStr(inv.dueDate, "2026-08-24")}</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM ACTIONS WITH DEDICATED FULL PAGE BUTTON */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <Button
                        onClick={() => router.push(`/admin/our-projects/${project?.id || projectId}/invoices/${invId}`)}
                        variant="primary"
                        size="sm"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 size={14} className="text-orange-400" />
                        <span>Open FULL PAGE INVOICE STUDIO</span>
                        <ChevronRight size={14} />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleOpenPreviewModal(inv)}
                          variant="secondary"
                          size="sm"
                          className="w-1/2 font-bold text-xs py-2 rounded-xl gap-1"
                        >
                          <Eye size={14} /> Quick Preview
                        </Button>

                        <Button
                          onClick={() => handleDownloadInvoicePdf(inv)}
                          variant="primary"
                          size="sm"
                          className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs py-2 rounded-xl shadow-sm flex items-center justify-center gap-1"
                        >
                          <Download size={14} /> PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* -------------------- CREATE & EDIT INVOICE MODAL -------------------- */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* MODAL HEADER */}
            <div className="p-5 bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white flex justify-between items-center">
              <div>
                <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
                  <Receipt size={18} className="text-orange-400" />
                  <span>{editingInvoice ? "Edit Tax Invoice Details" : "Generate New Tax Invoice"}</span>
                </h3>
                <p className="text-[11px] text-gray-300">
                  {editingInvoice ? `Update billing specifications for invoice ${editingInvoice.id || editingInvoice.number}` : `Manually create and issue an official tax invoice for ${projName}.`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateInvoiceModal(false);
                  setEditingInvoice(null);
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* SELECT PROPOSAL REFERENCE */}
              {proposals.length > 0 && !editingInvoice && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Reference Proposal (Optional)
                  </label>
                  <select
                    value={selectedProposalForInv}
                    onChange={(e) => handleSelectProposalForInvoice(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-slate-50 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="">-- Select Proposal Reference --</option>
                    {proposals.map((p, idx) => (
                      <option key={p.id || p.number || idx} value={p.id || p.number}>
                        {p.number || p.id} - {getSafeStr(p.title)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* LOGO UPLOAD & BACKGROUND THEME SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload size={14} className="text-orange-600" />
                    <span>Company Logo & Background Theme</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* LOGO FILE UPLOADER */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Upload Company Logo (PNG / JPG)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
                        <Upload size={14} className="text-orange-600" />
                        <span>{invCompanyLogo ? "Change Logo" : "Choose File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setInvCompanyLogo(ev.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {invCompanyLogo && (
                        <div className="flex items-center gap-1.5">
                          <img src={invCompanyLogo} alt="Uploaded logo" className="h-8 max-w-[80px] object-contain rounded border border-gray-200 bg-white p-0.5" />
                          <button
                            type="button"
                            onClick={() => setInvCompanyLogo("")}
                            className="text-xs text-red-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BACKGROUND THEME SELECTION */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Invoice Background Paper Theme
                    </label>
                    <select
                      value={invBgTheme}
                      onChange={(e) => setInvBgTheme(e.target.value)}
                      className="w-full p-2 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
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

              {/* DYNAMIC FOOTER COMPANY NAME, ADDRESS & FOOTER COLOR CONFIGURATION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-600" />
                    <span>Footer Brand Name, Office Address & Footer Color</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Footer Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={invFooterCompanyName}
                        onChange={(e) => setInvFooterCompanyName(e.target.value)}
                        placeholder="e.g. Speshway Solutions Private Limited"
                        className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                      />
                    </div>

                    {/* FOOTER COLOR SELECTION & CUSTOM PICKER */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-between">
                        <span>Footer Text & Accent Color</span>
                        <span className="font-mono text-[10px] text-gray-500">{invFooterColor}</span>
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {FOOTER_COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setInvFooterColor(preset.hex)}
                            title={preset.name}
                            className={`w-6 h-6 rounded-lg border transition-transform ${
                              invFooterColor === preset.hex ? "scale-115 border-black shadow-md ring-2 ring-orange-400" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          />
                        ))}
                        {/* CUSTOM FOOTER COLOR PICKER */}
                        <label className="cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-lg border border-gray-300 bg-white text-[10px] font-bold text-gray-700 hover:bg-gray-50">
                          <input
                            type="color"
                            value={invFooterColor}
                            onChange={(e) => setInvFooterColor(e.target.value)}
                            className="w-4 h-4 cursor-pointer rounded border-0 p-0"
                          />
                          <span>Custom</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Footer Office Address, Website & Contact Email
                    </label>
                    <textarea
                      rows={2}
                      value={invFooterAddress}
                      onChange={(e) => setInvFooterAddress(e.target.value)}
                      placeholder="e.g. T-Hub, Knowledge City Rd, Hyderabad 500032 www.speshway.com • info@speshway.com"
                      className="w-full p-2.5 text-xs font-medium text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* DUAL-COLOR BLEND & MULTI-COLOR THEME SELECTION SECTION */}
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={14} className="text-orange-600" />
                    <span>2-Color Dual Gradient & Multi-Color Theme Selection</span>
                  </span>
                  
                  {/* LIVE 2-COLOR GRADIENT PREVIEW PILL */}
                  <div 
                    className="px-3 py-1 rounded-full text-white text-[10px] font-mono font-extrabold shadow-sm border border-white/20"
                    style={{ background: invEnableDualGradient ? `linear-gradient(135deg, ${invColorTheme}, ${invColorTheme2})` : invColorTheme }}
                  >
                    {invEnableDualGradient ? "2-Color Blend Mode" : "Solid Color"}
                  </div>
                </div>

                {/* DUAL COLOR PRESETS (ATTRACTIVE 2-COLOR COMBOS) */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
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
                            isSelected ? "border-orange-600 bg-white shadow-md ring-2 ring-orange-500/20" : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full shrink-0 shadow-xs border border-white/20"
                            style={{ background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})` }}
                          />
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOM 2-COLOR PICKERS (PRIMARY COLOR 1 & SECONDARY COLOR 2) */}
                <div className="pt-2 border-t border-orange-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-gray-700">
                      Custom 2-Color Pickers (Primary & Secondary Accent)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-orange-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invEnableDualGradient}
                        onChange={(e) => setInvEnableDualGradient(e.target.checked)}
                        className="accent-orange-600 rounded cursor-pointer w-3.5 h-3.5"
                      />
                      <span>Enable 2-Color Gradient Blend</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* PRIMARY COLOR 1 */}
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                      <input
                        type="color"
                        value={invColorTheme}
                        onChange={(e) => setInvColorTheme(e.target.value)}
                        className="w-7 h-7 cursor-pointer rounded-lg border-0 p-0"
                      />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase">Primary Color 1</span>
                        <span className="font-mono text-xs font-extrabold text-slate-900">{invColorTheme}</span>
                      </div>
                    </div>

                    {/* SECONDARY COLOR 2 */}
                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                      <input
                        type="color"
                        value={invColorTheme2}
                        onChange={(e) => setInvColorTheme2(e.target.value)}
                        className="w-7 h-7 cursor-pointer rounded-lg border-0 p-0"
                        disabled={!invEnableDualGradient}
                      />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase">Secondary Color 2</span>
                        <span className="font-mono text-xs font-extrabold text-slate-900">{invColorTheme2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACKGROUND WATERMARK, HIGH CONTRAST & ROTATION SECTION */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-300 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={14} className="text-amber-700" />
                    <span>Background Watermark Style, Contrast & Rotation</span>
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-amber-900 bg-amber-200/80 border border-amber-300 px-2.5 py-0.5 rounded-md">
                    {Math.round(invWatermarkOpacity * 100)}% Contrast &bull; {invWatermarkRotation}° Angle
                  </span>
                </div>

                <div className="space-y-3">
                  {/* WATERMARK TYPE BUTTONS */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Select Watermark Display Mode
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setInvWatermarkType("both")}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          invWatermarkType === "both"
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        🏢+📝 Logo & Name
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvWatermarkType("logo")}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          invWatermarkType === "logo"
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        🏢 Logo Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvWatermarkType("text")}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          invWatermarkType === "text"
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        📝 Name Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvWatermarkType("none")}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          invWatermarkType === "none"
                            ? "bg-red-600 text-white border-red-600 shadow-xs"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        🚫 None
                      </button>
                    </div>
                  </div>

                  {/* CONTRAST PRESETS & EXTENDED SLIDER (5% TO 90%) */}
                  {invWatermarkType !== "none" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-gray-700">
                          Watermark Contrast Slider (5% to 90%)
                        </label>
                        <span className="font-mono font-extrabold text-amber-800 text-xs">
                          {Math.round(invWatermarkOpacity * 100)}% Contrast
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0.05"
                        max="0.90"
                        step="0.01"
                        value={invWatermarkOpacity}
                        onChange={(e) => setInvWatermarkOpacity(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer h-2.5 bg-gray-200 rounded-lg"
                      />

                      {/* QUICK CONTRAST PRESET BUTTONS */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-500">Quick Presets:</span>
                        {[
                          { label: "Subtle (12%)", val: 0.12 },
                          { label: "Medium (25%)", val: 0.25 },
                          { label: "Bold (45%)", val: 0.45 },
                          { label: "Ultra Bold (70%)", val: 0.70 }
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => setInvWatermarkOpacity(preset.val)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                              invWatermarkOpacity === preset.val
                                ? "bg-amber-800 text-white shadow-xs"
                                : "bg-white text-amber-900 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ROTATION ANGLE CONTROL & PRESETS */}
                  {invWatermarkType !== "none" && (
                    <div className="space-y-2 pt-2 border-t border-amber-200/60">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                          <RotateCw size={12} className="text-amber-700" />
                          <span>Watermark Rotation Angle (-90° to +90°)</span>
                        </label>
                        <span className="font-mono font-extrabold text-amber-800 text-xs">
                          {invWatermarkRotation}° Angle
                        </span>
                      </div>

                      <input
                        type="range"
                        min="-90"
                        max="90"
                        step="5"
                        value={invWatermarkRotation}
                        onChange={(e) => setInvWatermarkRotation(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer h-2.5 bg-gray-200 rounded-lg"
                      />

                      {/* QUICK ROTATION PRESETS */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-500">Angle Presets:</span>
                        {[
                          { label: "0° Horizontal", val: 0 },
                          { label: "-25° Standard Diagonal", val: -25 },
                          { label: "-45° Steep Diagonal", val: -45 },
                          { label: "45° Reverse Diagonal", val: 45 },
                          { label: "90° Vertical", val: 90 }
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => setInvWatermarkRotation(preset.val)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                              invWatermarkRotation === preset.val
                                ? "bg-amber-800 text-white shadow-xs"
                                : "bg-white text-amber-900 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CUSTOM WATERMARK TEXT INPUT */}
                  {(invWatermarkType === "text" || invWatermarkType === "both") && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Watermark Company Name Text
                      </label>
                      <input
                        type="text"
                        value={invWatermarkText}
                        onChange={(e) => setInvWatermarkText(e.target.value)}
                        placeholder="e.g. SPESHWAY SOLUTIONS PRIVATE LIMITED"
                        className="w-full p-2 text-xs font-bold uppercase text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* INVOICE TITLE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Invoice Title *
                </label>
                <input
                  type="text"
                  required
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  placeholder="e.g. Carzzi Web & Mobile Application"
                  className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BILLED BY COMPANY */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Billed By Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={invBilledByCompany}
                    onChange={(e) => setInvBilledByCompany(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                {/* BILLED TO CLIENT */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Billed To Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={invClientName}
                    onChange={(e) => setInvClientName(e.target.value)}
                    placeholder="e.g. Hyper Mobility Services"
                    className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TAX RATE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={invTaxRate}
                    onChange={(e) => setInvTaxRate(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-mono font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                {/* ISSUED DATE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invIssuedDate}
                    onChange={(e) => setInvIssuedDate(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                {/* DUE DATE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* BANK DETAILS SECTION */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Bank Details for Payment
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={invBankAccName}
                    onChange={(e) => setInvBankAccName(e.target.value)}
                    placeholder="Account Name"
                    className="p-2 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                  <input
                    type="text"
                    value={invBankAccNo}
                    onChange={(e) => setInvBankAccNo(e.target.value)}
                    placeholder="Account Number"
                    className="p-2 text-xs font-mono font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                  <input
                    type="text"
                    value={invBankBranch}
                    onChange={(e) => setInvBankBranch(e.target.value)}
                    placeholder="Branch"
                    className="p-2 text-xs font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                  <input
                    type="text"
                    value={invBankIfsc}
                    onChange={(e) => setInvBankIfsc(e.target.value)}
                    placeholder="IFSC Code"
                    className="p-2 text-xs font-mono font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* ITEMISED BILLING BREAKDOWN */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Invoice Service Deliverables Breakdown
                  </label>
                  <button
                    type="button"
                    onClick={() => setInvItems(prev => [...prev, { description: "New Scope Deliverable", qty: 1, rate: 170000 }])}
                    className="text-[11px] font-bold text-orange-600 hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto p-1">
                  {invItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-gray-200 text-xs">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...invItems];
                          copy[idx].description = e.target.value;
                          setInvItems(copy);
                        }}
                        className="flex-1 p-1.5 font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-lg outline-none"
                        placeholder="Item title / description"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const copy = [...invItems];
                          copy[idx].qty = Number(e.target.value);
                          setInvItems(copy);
                        }}
                        className="w-14 p-1.5 text-center font-mono font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-lg outline-none"
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
                        className="w-28 p-1.5 text-right font-mono font-bold text-[#1a0f00] bg-white border border-gray-200 rounded-lg outline-none"
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
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center gap-3">
                <Button
                  type="button"
                  onClick={handlePreviewCurrentDraft}
                  variant="secondary"
                  size="sm"
                  className="font-bold text-xs gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  <Eye size={14} /> <span>Live Preview Draft</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCreateInvoiceModal(false);
                      setEditingInvoice(null);
                    }}
                    variant="secondary"
                    size="sm"
                    className="font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold gap-1.5"
                  >
                    <CheckCircle size={14} /> {editingInvoice ? "Save & Update Invoice" : "Generate & Save Invoice"}
                  </Button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* -------------------- FULL PAGE INTERACTIVE TAX INVOICE PREVIEW MODAL -------------------- */}
      {showPreviewInvoiceModal && previewingInvoice && (() => {
        const pInv = previewingInvoice;
        const pProjName = getSafeStr(project?.name || pInv.projectName || pInv.productName, "Showcase Project");
        const pClientName = getSafeStr(pInv.clientName || project?.clientName, "Hyper Mobility Services");
        const pProductName = getSafeStr(pInv.productName || project?.name, "Carzzi");
        const pInvNumber = getSafeStr(pInv.number || pInv.id, "SPW2026070712");
        const pInvDateStr = pInv.issuedDate ? new Date(pInv.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "09 July, 2026";
        
        const pThemeHex1 = getSafeStr(pInv.colorTheme, "#c2410c");
        const pThemeHex2 = getSafeStr(pInv.colorTheme2, "#f97316");
        const pIsDual = pInv.enableDualGradient !== false && Boolean(pThemeHex2);
        const pHeaderBgStyle = pIsDual ? `linear-gradient(135deg, ${pThemeHex1} 0%, ${pThemeHex2} 100%)` : pThemeHex1;

        const pLogoUrl = getSafeStr(pInv.companyLogoUrl || pInv.logoUrl);

        const pFooterCompanyName = getSafeStr(pInv.footerCompanyName, pInv.billedByCompany || "Speshway Solutions Private Limited");
        const pFooterAddress = getSafeStr(pInv.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
        const pFooterColor = getSafeStr(pInv.footerColor, "#334155");

        const pWatermarkType = pInv.watermarkType || "both";
        const pWatermarkText = getSafeStr(pInv.watermarkText, pInv.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED");
        const pWatermarkOpacity = pInv.watermarkOpacity !== undefined ? Number(pInv.watermarkOpacity) : 0.25;
        const pWatermarkRotation = pInv.watermarkRotation !== undefined ? Number(pInv.watermarkRotation) : -25;

        const selectedBgObj = INVOICE_BG_THEMES.find(t => t.id === pInv.bgTheme) || INVOICE_BG_THEMES[0];
        const pBgCss = selectedBgObj.bgCss;

        const pItems = Array.isArray(pInv.serviceItems) && pInv.serviceItems.length > 0 ? pInv.serviceItems : [
          { 
            title: `${pProductName} Web & Mobile Application`, 
            description: `Design, development & delivery of web and mobile applications for the ${pProductName} product, provided to ${pClientName}`,
            qty: 1, 
            rate: Number(pInv.amount || 170000)
          }
        ];

        const pSubtotal = pItems.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) * Number(item.rate || 0)), 0);
        const pTaxRate = pInv.taxRate !== undefined ? Number(pInv.taxRate) : 18;
        const pTaxAmount = (pSubtotal * pTaxRate) / 100;
        const pTotalDue = pSubtotal + pTaxAmount;
        const pAmountInWords = numberToIndianWords(pTotalDue);

        return (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col h-screen w-screen overflow-hidden animate-in fade-in zoom-in duration-150">
            
            {/* TOP INTERACTIVE ACTION BAR */}
            <div className="h-16 px-6 bg-slate-950 text-white flex justify-between items-center border-b border-gray-800 shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Receipt className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Tax Invoice Document Viewer</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-orange-300 border border-white/10">
                      {pInvNumber}
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 hidden sm:block">
                    Exact A4 paper view with 2-color gradient theme ({pThemeHex1} &bull; {pThemeHex2}), watermark ({pWatermarkType}), opacity ({Math.round(pWatermarkOpacity*100)}%), and angle ({pWatermarkRotation}°).
                  </p>
                </div>
              </div>

              {/* ZOOM & CONTROLS TOOLBAR */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
                  <button
                    onClick={() => setPreviewZoom(prev => Math.max(0.4, Number((prev - 0.08).toFixed(2))))}
                    className="p-1 text-gray-400 hover:text-white rounded font-bold"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="text-orange-400 font-mono font-bold text-xs px-1 min-w-10 text-center">
                    {Math.round(previewZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setPreviewZoom(prev => Math.min(1.5, Number((prev + 0.08).toFixed(2))))}
                    className="p-1 text-gray-400 hover:text-white rounded font-bold"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <div className="h-4 w-px bg-gray-800 mx-1" />
                  <button
                    onClick={() => setPreviewZoom(0.75)}
                    className="px-2 py-1 text-[10px] font-bold bg-white/10 text-gray-300 hover:bg-white/20 rounded transition-colors"
                  >
                    Fit Screen
                  </button>
                  <button
                    onClick={() => setPreviewZoom(1.0)}
                    className="px-2 py-1 text-[10px] font-bold bg-white/10 text-gray-300 hover:bg-white/20 rounded transition-colors"
                  >
                    100% Full Size
                  </button>
                </div>

                <Button
                  onClick={() => handleDownloadInvoicePdf(pInv)}
                  variant="primary"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs gap-1.5 py-2"
                >
                  <Download size={14} /> Download PDF Report
                </Button>

                <button
                  onClick={() => setShowPreviewInvoiceModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  title="Close Preview (ESC)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* SCROLLABLE DOCUMENT PAPER VIEWPORT */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/95 flex justify-center items-start">
              <div 
                className="w-full max-w-[800px] rounded-xl shadow-2xl border overflow-hidden text-slate-800 text-xs transition-all duration-200 relative"
                style={{ 
                  background: pBgCss.includes('gradient') ? pBgCss : pBgCss,
                  borderColor: selectedBgObj.borderCss,
                  transform: `scale(${previewZoom})`,
                  transformOrigin: "top center",
                  marginBottom: previewZoom < 1 ? `-${(1 - previewZoom) * 950}px` : "20px"
                }}
              >
                
                {/* ON-SCREEN WATERMARK LAYER WITH DYNAMIC ROTATION */}
                {pWatermarkType !== "none" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    {pWatermarkType === "both" ? (
                      <div className="flex flex-col items-center justify-center gap-3 text-center select-none" style={{ transform: `rotate(${pWatermarkRotation}deg)` }}>
                        {pLogoUrl ? (
                          <img 
                            src={pLogoUrl} 
                            alt="Watermark Logo" 
                            style={{ opacity: pWatermarkOpacity }}
                            className="max-w-[280px] max-h-[280px] object-contain drop-shadow-md"
                          />
                        ) : (
                          <div style={{ opacity: pWatermarkOpacity, color: pThemeHex1 }} className="text-[130px] font-extrabold">
                            🏢
                          </div>
                        )}
                        <div 
                          style={{ opacity: pWatermarkOpacity, color: pThemeHex1 }}
                          className="text-xl md:text-2xl font-black uppercase tracking-widest max-w-[580px]"
                        >
                          {pWatermarkText || "SPESHWAY SOLUTIONS PRIVATE LIMITED"}
                        </div>
                      </div>
                    ) : pWatermarkType === "logo" ? (
                      pLogoUrl ? (
                        <img 
                          src={pLogoUrl} 
                          alt="Watermark Logo" 
                          style={{ opacity: pWatermarkOpacity, transform: `rotate(${pWatermarkRotation}deg)` }}
                          className="max-w-[400px] max-h-[400px] object-contain select-none drop-shadow-md"
                        />
                      ) : (
                        <div 
                          style={{ opacity: pWatermarkOpacity, color: pThemeHex1, transform: `rotate(${pWatermarkRotation}deg)` }}
                          className="text-[160px] font-extrabold select-none"
                        >
                          🏢
                        </div>
                      )
                    ) : (
                      <div 
                        style={{ opacity: pWatermarkOpacity, color: pThemeHex1, transform: `rotate(${pWatermarkRotation}deg)` }}
                        className="text-2xl md:text-3xl font-black text-center uppercase tracking-widest max-w-[650px] select-none p-4"
                      >
                        {pWatermarkText || "SPESHWAY SOLUTIONS PRIVATE LIMITED"}
                      </div>
                    )}
                  </div>
                )}

                {/* CONTENT LAYER */}
                <div className="relative z-10">
                  
                  {/* ATTRACTIVE DYNAMIC 2-COLOR DUAL GRADIENT HEADER BANNER */}
                  <div className="p-6 text-white flex justify-between items-center" style={{ background: pHeaderBgStyle }}>
                    <div className="flex items-center gap-4">
                      {pLogoUrl ? (
                        <img 
                          src={pLogoUrl} 
                          alt="Company Logo" 
                          className="h-11 max-w-[130px] object-contain rounded-lg bg-white p-1 shadow-md"
                        />
                      ) : (
                        <div className="bg-white rounded-xl p-2.5 flex items-center justify-center shadow-md">
                          <Building2 className="w-6 h-6" style={{ color: pThemeHex1 }} />
                        </div>
                      )}
                      <div>
                        <h1 className="font-extrabold text-base uppercase tracking-wider text-white leading-tight">
                          {getSafeStr(pInv.billedByCompany, "SPESHWAY SOLUTIONS PRIVATE LIMITED")}
                        </h1>
                        <p className="text-[10px] text-white/90 font-medium mt-1 tracking-wide">
                          {getSafeStr(pInv.billedBySub, "Software Development Company • IT Solutions")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">

                    {/* TITLE & INVOICE NO / DATE */}
                    <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                      <div>
                        <h2 className="font-extrabold text-2xl uppercase tracking-tight" style={{ color: pThemeHex1 }}>
                          TAX INVOICE
                        </h2>
                      </div>
                      <div className="text-right text-gray-500 leading-relaxed text-xs">
                        <div>Invoice No: <strong className="text-slate-900 font-mono font-bold">{pInvNumber}</strong></div>
                        <div>Date: <strong className="text-slate-900 font-bold">{pInvDateStr}</strong></div>
                      </div>
                    </div>

                    {/* BILLED BY & BILLED TO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: pThemeHex1 }}>
                          BILLED BY
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {getSafeStr(pInv.billedByCompany, "Speshway Solutions Private Limited")}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {getSafeStr(pInv.billedBySub, "Software Development Company")}
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: pThemeHex1 }}>
                          BILLED TO
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {pClientName}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Product: {pProductName}
                        </p>
                      </div>
                    </div>

                    {/* LINE ITEMS TABLE */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-white text-[11px] font-bold uppercase" style={{ background: pHeaderBgStyle }}>
                            <th className="p-3">DESCRIPTION</th>
                            <th className="p-3 text-right w-28">RATE (INR)</th>
                            <th className="p-3 text-right w-32">AMOUNT (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {pItems.map((it: any, idx: number) => {
                            const lineRate = Number(it.rate || 0);
                            const lineAmount = Number(it.qty || 1) * lineRate;
                            const titleStr = getSafeStr(it.title || it.description, `${pProductName} Deliverables`);
                            const descStr = getSafeStr(it.details || it.description, `Custom software development for ${pClientName}`);
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-900 text-xs">{titleStr}</div>
                                  <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{descStr}</div>
                                </td>
                                <td className="p-3.5 text-right font-mono text-gray-700">
                                  {lineRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                                  {lineAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* TOTALS SUMMARY */}
                    <div className="flex justify-end pt-2">
                      <div className="w-72 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-mono font-bold text-slate-900">₹ {pSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-200">
                          <span>Tax ({pTaxRate}%)</span>
                          <span className="font-mono font-bold text-slate-900">₹ {pTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-sm pt-1" style={{ color: pThemeHex1 }}>
                          <span>Total Due</span>
                          <span className="font-mono">₹ {pTotalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    {/* AMOUNT IN WORDS BANNER */}
                    <div className="bg-white border border-gray-200 border-l-4 p-3.5 rounded-lg text-xs text-slate-700 shadow-xs" style={{ borderLeftColor: pThemeHex1 }}>
                      <strong className="text-slate-900">Amount in Words:</strong> {pAmountInWords}
                    </div>

                    {/* BANK DETAILS BOX */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: pThemeHex1 }}>
                        BANK DETAILS FOR PAYMENT
                      </span>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase">ACCOUNT NAME</div>
                          <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(pInv.bankAccName, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase mt-2">ACCOUNT NUMBER</div>
                          <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(pInv.bankAccNo, '018326900000850')}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase">BRANCH</div>
                          <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(pInv.bankBranch, 'HITECH CITY')}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase mt-2">IFSC CODE</div>
                          <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(pInv.bankIfsc, 'YESB0000183')}</div>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC FOOTER BRAND NAME, ADDRESS & CUSTOM FOOTER COLOR */}
                    <div className="pt-6 border-t border-gray-200 text-center text-[10px] leading-relaxed" style={{ color: pFooterColor }}>
                      <strong className="font-extrabold text-[11px]" style={{ color: pFooterColor }}>{pFooterCompanyName}</strong><br/>
                      {pFooterAddress}
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        );
      })()}

    </div>
  );
}
