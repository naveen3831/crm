"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Building2, 
  MessageSquare,
  Sparkles,
  FolderOpen,
  ChevronRight,
  DollarSign,
  Layers,
  FileText,
  Receipt,
  Maximize2,
  Check,
  Palette,
  Send,
  Edit3,
  CheckSquare
} from "lucide-react";
import Button from "../ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getSafeStr = (val: any, fallback: string = ""): string => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.name || val.company || val.title || fallback;
  return String(val);
};

interface FullClientProfilePageProps {
  clientId: string;
}

const PRESET_PROJECTS = [
  { id: "PRESET-1", name: "HMS (Hospital Management System)", category: "Healthcare Web & App", budget: 185000, scope: "Complete OPD/IPD hospital ecosystem with billing, pharmacy, and patient app." },
  { id: "PRESET-2", name: "LMS (Learning Management System)", category: "EdTech Application", budget: 170000, scope: "Interactive video course platform with online exams, live classes, and student portal." },
  { id: "PRESET-3", name: "HRMS (Human Resource Management System)", category: "Enterprise ERP", budget: 240000, scope: "Employee attendance, payroll management, leaves tracking, and performance reviews." },
  { id: "PRESET-4", name: "Carzzi Mobility & Fleet App", category: "Automotive SaaS", budget: 195000, scope: "GPS tracking, vehicle booking engine, maintenance logs, and driver dispatch." },
  { id: "PRESET-5", name: "Build Your Thoughts AI Platform", category: "AI Web Application", budget: 145000, scope: "Generative AI workspace for prompt engineering, document synthesis, and team notes." }
];

// Color Gradients Presets for Invoice
const GRADIENT_PRESETS = [
  { name: "Sunset Glow", c1: "#c2410c", c2: "#f97316" },
  { name: "Ocean Deep", c1: "#0369a1", c2: "#06b6d4" },
  { name: "Royal Velvet", c1: "#6b21a8", c2: "#a855f7" },
  { name: "Emerald Luxe", c1: "#047857", c2: "#10b981" },
  { name: "Midnight Cyber", c1: "#0f172a", c2: "#3b82f6" },
  { name: "Electric Neon", c1: "#be185d", c2: "#f43f5e" }
];

export default function FullClientProfilePage({ clientId }: FullClientProfilePageProps) {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [clientProposals, setClientProposals] = useState<any[]>([]);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [allOurProjects, setAllOurProjects] = useState<any[]>([]);
  const [allDatabaseQuotations, setAllDatabaseQuotations] = useState<any[]>([]);
  const [allDatabaseInvoices, setAllDatabaseInvoices] = useState<any[]>([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Email Notification Toast State
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  // Call Logger State
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [callType, setCallType] = useState<"OUTGOING" | "INCOMING">("OUTGOING");
  const [callDuration, setCallDuration] = useState<string>("10 mins");
  const [callPurpose, setCallPurpose] = useState<string>("");
  const [callNotes, setCallNotes] = useState<string>("");
  const [nextAction, setNextAction] = useState<string>("");
  const [followUpDate, setFollowUpDate] = useState<string>("");

  // New Project & Proposal Wizard Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("Web & Mobile Ecosystem");
  const [clientRepName, setClientRepName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [projectScopeNotes, setProjectScopeNotes] = useState("");

  // Proposal Type & Quotation Tier Selection State
  const [proposalType, setProposalType] = useState<"WEBSITE_ONLY" | "MOBILE_APP_ONLY" | "WEBSITE_AND_MOBILE_APP" | "CUSTOM_SAAS">("WEBSITE_AND_MOBILE_APP");
  const [proposalPlanTier, setProposalPlanTier] = useState<"PLAN_A" | "PLAN_B" | "PLAN_C">("PLAN_B");
  const [invoicePaymentStatus, setInvoicePaymentStatus] = useState<"PAID" | "PARTIAL" | "PENDING">("PAID");
  const [invoiceThemeC1, setInvoiceThemeC1] = useState("#c2410c");
  const [invoiceThemeC2, setInvoiceThemeC2] = useState("#f97316");

  // Separate Email Dispatch Checkbox Options
  const [sendProposalMailCheck, setSendProposalMailCheck] = useState<boolean>(true);
  const [sendInvoiceMailCheck, setSendInvoiceMailCheck] = useState<boolean>(true);

  // Inline Customization State (Client-Scoped)
  const [showQuotationEditPanel, setShowQuotationEditPanel] = useState(false);
  const [customQuotationTitle, setCustomQuotationTitle] = useState("");
  const [customPlanAPrice, setCustomPlanAPrice] = useState<number | "">("");
  const [customPlanBPrice, setCustomPlanBPrice] = useState<number | "">("");
  const [customPlanCPrice, setCustomPlanCPrice] = useState<number | "">("");

  const [showInvoiceEditPanel, setShowInvoiceEditPanel] = useState(false);
  const [customInvoiceTitle, setCustomInvoiceTitle] = useState("");
  const [customInvoiceAmount, setCustomInvoiceAmount] = useState<number | "">("");

  // Feature & Line Item Customization State
  const [quotationItems, setQuotationItems] = useState<{ id: string; description: string; qty: number; rate: number }[]>([
    { id: "ITEM-1", description: "Web Application Core System & Admin Control Workstation", qty: 1, rate: 55000 },
    { id: "ITEM-2", description: "Mobile Application (iOS & Android Cross-Platform)", qty: 1, rate: 45000 },
    { id: "ITEM-3", description: "Database Architecture & AWS Cloud Deployment", qty: 1, rate: 25000 }
  ]);

  const [invoiceItems, setInvoiceItems] = useState<{ id: string; description: string; qty: number; rate: number }[]>([
    { id: "INV-ITEM-1", description: "Web & Mobile App Ecosystem Implementation", qty: 1, rate: 100000 },
    { id: "INV-ITEM-2", description: "API Backend & Cloud Database Server Sync", qty: 1, rate: 45000 }
  ]);

  // Line Item Handlers
  const addQuotationItem = () => {
    setQuotationItems(prev => [
      ...prev,
      { id: `ITEM-${Date.now()}`, description: "New Feature / Deliverable", qty: 1, rate: 15000 }
    ]);
  };

  const updateQuotationItem = (id: string, field: "description" | "qty" | "rate", value: any) => {
    setQuotationItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeQuotationItem = (id: string) => {
    setQuotationItems(prev => prev.filter(item => item.id !== id));
  };

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [
      ...prev,
      { id: `INV-ITEM-${Date.now()}`, description: "New Service Item", qty: 1, rate: 15000 }
    ]);
  };

  const updateInvoiceItem = (id: string, field: "description" | "qty" | "rate", value: any) => {
    setInvoiceItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id));
  };

  // EDIT QUOTATION & INVOICE (CLIENT PAGE EXCLUSIVE) STATE
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPropType, setEditPropType] = useState("");
  const [editPropTier, setEditPropTier] = useState("");
  const [editAmount, setEditAmount] = useState<number>(185000);
  const [editInvStatus, setEditInvStatus] = useState("PAID");
  const [editThemeC1, setEditThemeC1] = useState("#c2410c");
  const [editThemeC2, setEditThemeC2] = useState("#f97316");

  // PARALLEL BATCHED DATA LOADING (5X FASTER INITIAL LOAD)
  const loadClientDetails = async () => {
    setIsLoading(true);
    try {
      const [clientsRes, projRes, propRes, invRes, callRes] = await Promise.allSettled([
        fetch(`${API_URL}/crm/clients`),
        fetch(`${API_URL}/crm/our-projects`),
        fetch(`${API_URL}/crm/quotation`),
        fetch(`${API_URL}/crm/invoice`),
        fetch(`${API_URL}/crm/calls`)
      ]);

      // 1. Process Client Details
      let foundClient = null;
      if (clientsRes.status === "fulfilled" && clientsRes.value.ok) {
        try {
          const data = await clientsRes.value.json();
          if (data.success && Array.isArray(data.data)) {
            foundClient = data.data.find((c: any) => c && (c.id === clientId || c._id === clientId));
          }
        } catch (e) {}
      }

      if (!foundClient) {
        foundClient = {
          id: clientId,
          company: "soeshesay",
          name: "nani",
          email: "bdbbd@gmail.com",
          whatsapp: "87598558",
          industry: "Retail",
          address: "hdfb",
          status: "ACTIVE CLIENT",
          createdDate: "2026-07-22"
        };
      }
      setClient(foundClient);
      setClientRepName(getSafeStr(foundClient.name, "nani"));

      const cIdLower = String(clientId).toLowerCase();
      const cCompanyLower = getSafeStr(foundClient.company).toLowerCase();
      const cNameLower = getSafeStr(foundClient.name).toLowerCase();

      // 2. Process Projects
      if (projRes.status === "fulfilled" && projRes.value.ok) {
        try {
          const projData = await projRes.value.json();
          if (projData.success && Array.isArray(projData.data)) {
            setAllOurProjects(projData.data);
            const matchedProjects = projData.data.filter((p: any) => {
              if (!p) return false;
              const pCId = getSafeStr(p.clientId).toLowerCase();
              const pCName = getSafeStr(p.clientName).toLowerCase();
              return pCId === cIdLower || pCName.includes(cCompanyLower) || pCName.includes(cNameLower) || p.assignedClientId === clientId;
            });
            setClientProjects(matchedProjects);
          }
        } catch (e) {}
      }

      // 3. Process Proposals
      if (propRes.status === "fulfilled" && propRes.value.ok) {
        try {
          const propData = await propRes.value.json();
          if (propData.success && Array.isArray(propData.data)) {
            setAllDatabaseQuotations(propData.data);
            const matchedProps = propData.data.filter((p: any) => {
              const pClient = getSafeStr(p.clientName).toLowerCase();
              return pClient.includes(cCompanyLower) || pClient.includes(cNameLower);
            });
            setClientProposals(matchedProps);
          }
        } catch (e) {}
      }

      // 4. Process Invoices
      if (invRes.status === "fulfilled" && invRes.value.ok) {
        try {
          const invData = await invRes.value.json();
          if (invData.success && Array.isArray(invData.data)) {
            setAllDatabaseInvoices(invData.data);
            const matchedInvs = invData.data.filter((i: any) => {
              const iClient = getSafeStr(i.clientName).toLowerCase();
              return iClient.includes(cCompanyLower) || iClient.includes(cNameLower);
            });
            setClientInvoices(matchedInvs);
          }
        } catch (e) {}
      }

      // 5. Process Call Logs
      if (callRes.status === "fulfilled" && callRes.value.ok) {
        try {
          const callData = await callRes.value.json();
          if (callData.success && Array.isArray(callData.data)) {
            const clientCalls = callData.data.filter((call: any) => 
              call && (call.clientId === foundClient.id || call.clientId === clientId)
            );
            setCallLogs(clientCalls);
          }
        } catch (e) {}
      }

    } catch (err) {
      console.error("Error loading full client page:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      loadClientDetails();
    }
  }, [clientId]);

  // Handle Database Project Selection
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const dbProj = allOurProjects.find(p => (p.id || p._id) === presetId);
    if (dbProj) {
      setProjectName(getSafeStr(dbProj.name || dbProj.title));
      setProjectCategory(getSafeStr(dbProj.category, "Web & Mobile Ecosystem"));
      setProjectScopeNotes(getSafeStr(dbProj.description, "Custom project scope"));
      return;
    }
    const preset = PRESET_PROJECTS.find(p => p.id === presetId);
    if (preset) {
      setProjectName(preset.name);
      setProjectCategory(preset.category);
      setProjectScopeNotes(preset.scope);
    }
  };

  // Handle Database Quotation Selection
  const handleQuotationSelect = (qId: string) => {
    setSelectedQuotationId(qId);
    const q = allDatabaseQuotations.find(item => (item.id || item._id) === qId);
    if (q) {
      setCustomQuotationTitle(getSafeStr(q.title || q.number));
      if (q.planAPrice) setCustomPlanAPrice(Number(q.planAPrice));
      if (q.planBPrice) setCustomPlanBPrice(Number(q.planBPrice));
      if (q.planCPrice) setCustomPlanCPrice(Number(q.planCPrice));
      if (q.selectedPlan) setProposalPlanTier(q.selectedPlan);
      if (Array.isArray(q.serviceItems) && q.serviceItems.length > 0) {
        setQuotationItems(q.serviceItems.map((s: any, idx: number) => ({
          id: s.id || `ITEM-${idx}`,
          description: s.description || "Service Feature",
          qty: Number(s.qty || 1),
          rate: Number(s.rate || 10000)
        })));
      }
      const typeStr = (q.projectType || q.title || "").toLowerCase();
      if (typeStr.includes("website only")) setProposalType("WEBSITE_ONLY");
      else if (typeStr.includes("mobile application only") || typeStr.includes("mobile app only")) setProposalType("MOBILE_APP_ONLY");
      else if (typeStr.includes("website + mobile") || typeStr.includes("ecosystem")) setProposalType("WEBSITE_AND_MOBILE_APP");
      else if (typeStr.includes("saas")) setProposalType("CUSTOM_SAAS");
    }
  };

  // Handle Database Invoice Selection
  const handleInvoiceSelect = (iId: string) => {
    setSelectedInvoiceId(iId);
    const inv = allDatabaseInvoices.find(item => (item.id || item._id) === iId);
    if (inv) {
      setCustomInvoiceTitle(getSafeStr(inv.title || inv.number));
      if (inv.amount) setCustomInvoiceAmount(Number(inv.amount));
      if (inv.status) setInvoicePaymentStatus(inv.status as any);
      if (inv.colorTheme) setInvoiceThemeC1(inv.colorTheme);
      if (inv.colorTheme2) setInvoiceThemeC2(inv.colorTheme2);
      if (Array.isArray(inv.lineItems) && inv.lineItems.length > 0) {
        setInvoiceItems(inv.lineItems.map((l: any, idx: number) => ({
          id: l.id || `INV-ITEM-${idx}`,
          description: l.description || "Billed Service Item",
          qty: Number(l.qty || 1),
          rate: Number(l.rate || 10000)
        })));
      }
    }
  };

  // MEMOIZED FILTERED QUOTATIONS (FAST QUERY COMPUTATION)
  const filteredQuotations = useMemo(() => {
    return allDatabaseQuotations.filter((q: any) => {
      if (!projectName && !selectedPresetId) return true;
      const selProjLower = (projectName || "").toLowerCase().trim();
      const qTitle = getSafeStr(q.title || q.name || q.projectName).toLowerCase();
      const qProjId = getSafeStr(q.projectId).toLowerCase();

      const selectedProjObj = allOurProjects.find(p => (p.id || p._id) === selectedPresetId);
      const selProjId = selectedProjObj ? getSafeStr(selectedProjObj.id).toLowerCase() : "";

      if (selProjId && qProjId && (qProjId.includes(selProjId) || selProjId.includes(qProjId))) return true;
      if (selProjLower && qTitle.includes(selProjLower)) return true;
      if (selProjLower && (qTitle.includes(selProjLower.split(" ")[0]) || selProjLower.includes(qTitle.split(" ")[0]))) return true;
      return false;
    });
  }, [allDatabaseQuotations, projectName, selectedPresetId, allOurProjects]);

  // MEMOIZED FILTERED INVOICES (FAST QUERY COMPUTATION)
  const filteredInvoices = useMemo(() => {
    return allDatabaseInvoices.filter((inv: any) => {
      if (!projectName && !selectedPresetId) return true;
      const selProjLower = (projectName || "").toLowerCase().trim();
      const invTitle = getSafeStr(inv.title || inv.name || inv.projectName).toLowerCase();
      const invProjId = getSafeStr(inv.projectId).toLowerCase();

      const selectedProjObj = allOurProjects.find(p => (p.id || p._id) === selectedPresetId);
      const selProjId = selectedProjObj ? getSafeStr(selectedProjObj.id).toLowerCase() : "";

      if (selProjId && invProjId && (invProjId.includes(selProjId) || selProjId.includes(invProjId))) return true;
      if (selProjLower && invTitle.includes(selProjLower)) return true;
      if (selProjLower && (invTitle.includes(selProjLower.split(" ")[0]) || selProjLower.includes(invTitle.split(" ")[0]))) return true;
      return false;
    });
  }, [allDatabaseInvoices, projectName, selectedPresetId, allOurProjects]);

  // Helper to calculate Quotation Price based on Proposal Type and Tier
  const getQuotationPrice = () => {
    if (customInvoiceAmount && typeof customInvoiceAmount === "number" && customInvoiceAmount > 0) {
      return customInvoiceAmount;
    }
    if (proposalPlanTier === "PLAN_A" && customPlanAPrice && typeof customPlanAPrice === "number" && customPlanAPrice > 0) {
      return customPlanAPrice;
    }
    if (proposalPlanTier === "PLAN_B" && customPlanBPrice && typeof customPlanBPrice === "number" && customPlanBPrice > 0) {
      return customPlanBPrice;
    }
    if (proposalPlanTier === "PLAN_C" && customPlanCPrice && typeof customPlanCPrice === "number" && customPlanCPrice > 0) {
      return customPlanCPrice;
    }

    if (proposalType === "WEBSITE_ONLY") {
      if (proposalPlanTier === "PLAN_A") return 65000;
      if (proposalPlanTier === "PLAN_B") return 95000;
      return 135000;
    }
    if (proposalType === "MOBILE_APP_ONLY") {
      if (proposalPlanTier === "PLAN_A") return 85000;
      if (proposalPlanTier === "PLAN_B") return 125000;
      return 175000;
    }
    if (proposalType === "WEBSITE_AND_MOBILE_APP") {
      if (proposalPlanTier === "PLAN_A") return 140000;
      if (proposalPlanTier === "PLAN_B") return 185000;
      return 250000;
    }
    // CUSTOM_SAAS
    if (proposalPlanTier === "PLAN_A") return 160000;
    if (proposalPlanTier === "PLAN_B") return 220000;
    return 320000;
  };

  // Dispatch Nodemailer Email Handler
  const handleSendNodemailerEmail = async (type: "PROPOSAL" | "INVOICE", projectObj: any) => {
    const rawEmail = getSafeStr(client?.email).trim();
    const cEmail = (rawEmail && rawEmail.includes("@")) ? rawEmail : "naveenkumar970100@gmail.com";
    const cName = getSafeStr(client?.name, "nani");
    const cCompany = getSafeStr(client?.company, "soeshesay");

    setEmailStatusMsg(`Sending ${type} Email to ${cEmail} via Nodemailer...`);

    try {
      const res = await fetch(`${API_URL}/crm/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          clientEmail: cEmail,
          clientName: cName,
          companyName: cCompany,
          projectName: projectObj.name || projectObj.title,
          proposalType: projectObj.proposalType || "Website + Mobile App",
          proposalTier: projectObj.proposalTier || "Plan B (Recommended)",
          amount: projectObj.budget || 185000,
          proposalId: projectObj.proposalId || "PROP-7001",
          invoiceId: projectObj.invoiceId || "INV-7001",
          colorTheme: projectObj.colorTheme || "#c2410c",
          colorTheme2: projectObj.colorTheme2 || "#f97316"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatusMsg(`✅ Nodemailer Dispatched! Sent ${type} Email to ${cEmail}`);
      } else {
        setEmailStatusMsg(`❌ Dispatch Error: ${data.error || "Email delivery failed"}`);
      }
    } catch (err: any) {
      console.error("Send Email Error:", err);
      setEmailStatusMsg(`❌ Network Error: ${err.message || "Failed to reach server"}`);
    }

    setTimeout(() => {
      setEmailStatusMsg(null);
    }, 5000);
  };

  // Handle Wizard Submission: Creates Project, Proposal & Invoice + Sends Nodemailer Mail
  const handleCreateProjectProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert("Please enter project name.");
      return;
    }

    const companyNameStr = getSafeStr(client?.company, "soeshesay");
    const projId = `OPRJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const propId = `PROP-${Math.floor(1000 + Math.random() * 9000)}`;
    const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const calculatedPrice = getQuotationPrice();

    const proposalTypeName = 
      proposalType === "WEBSITE_ONLY" ? "Website Only Proposal" :
      proposalType === "MOBILE_APP_ONLY" ? "Mobile Application Only Proposal" :
      proposalType === "WEBSITE_AND_MOBILE_APP" ? "Website + Mobile App Complete Ecosystem" : "Custom SaaS Architecture";

    const tierName = proposalPlanTier === "PLAN_A" ? "Plan A (Core Essential)" : proposalPlanTier === "PLAN_B" ? "Plan B (Professional Recommended)" : "Plan C (Enterprise)";

    // 1. Create Project
    const newProjObj = {
      id: projId,
      name: projectName.trim(),
      category: projectCategory,
      clientId: client?.id || clientId,
      assignedClientId: client?.id || clientId,
      clientName: companyNameStr,
      clientRepName: clientRepName || getSafeStr(client?.name, "nani"),
      budget: calculatedPrice,
      proposalType: proposalTypeName,
      proposalTier: tierName,
      proposalId: propId,
      invoiceId: invId,
      colorTheme: invoiceThemeC1,
      colorTheme2: invoiceThemeC2,
      targetCompletionDate: targetDate || new Date(Date.now() + 60*24*60*60*1000).toISOString().split("T")[0],
      status: "In Development",
      description: projectScopeNotes || `Custom ${proposalTypeName} project created for ${companyNameStr}`
    };

    // 2. Create Proposal (Client-Scoped Isolation)
    const newPropObj = {
      id: propId,
      number: propId,
      projectId: projId,
      title: customQuotationTitle.trim() || `Proposal for ${projectName.trim()} (${proposalTypeName})`,
      clientName: companyNameStr,
      projectType: proposalTypeName,
      planAPrice: customPlanAPrice || (proposalType === "WEBSITE_ONLY" ? 65000 : proposalType === "MOBILE_APP_ONLY" ? 85000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 140000 : 160000),
      planBPrice: customPlanBPrice || (proposalType === "WEBSITE_ONLY" ? 95000 : proposalType === "MOBILE_APP_ONLY" ? 125000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 185000 : 220000),
      planCPrice: customPlanCPrice || (proposalType === "WEBSITE_ONLY" ? 135000 : proposalType === "MOBILE_APP_ONLY" ? 175000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 250000 : 320000),
      selectedPlan: proposalPlanTier,
      serviceItems: quotationItems,
      status: "APPROVED",
      createdDate: new Date().toISOString().split("T")[0]
    };

    // 3. Create Invoice (Client-Scoped Isolation)
    const newInvObj = {
      id: invId,
      number: invId,
      projectId: projId,
      title: customInvoiceTitle.trim() || `Tax Invoice for ${projectName.trim()}`,
      clientName: companyNameStr,
      amount: calculatedPrice,
      status: invoicePaymentStatus,
      colorTheme: invoiceThemeC1,
      colorTheme2: invoiceThemeC2,
      enableDualGradient: true,
      lineItems: invoiceItems,
      issuedDate: new Date().toISOString().split("T")[0]
    };

    // INSTANT OPTIMISTIC UI UPDATE (ZERO DELAY)
    setClientProjects(prev => [newProjObj, ...prev]);
    setClientProposals(prev => [newPropObj, ...prev]);
    setClientInvoices(prev => [newInvObj, ...prev]);
    setShowNewProjectModal(false);

    // PARALLEL NON-BLOCKING ASYNC PERSISTENCE
    Promise.allSettled([
      fetch(`${API_URL}/crm/our-projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjObj)
      }),
      fetch(`${API_URL}/crm/quotation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPropObj)
      }),
      fetch(`${API_URL}/crm/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvObj)
      })
    ]).catch(err => console.error("Parallel save error:", err));

    // SEND NODEMAILER EMAILS ASYNCHRONOUSLY IN BACKGROUND
    if (sendProposalMailCheck) {
      handleSendNodemailerEmail("PROPOSAL", newProjObj);
    }
    if (sendInvoiceMailCheck) {
      setTimeout(() => {
        handleSendNodemailerEmail("INVOICE", newProjObj);
      }, sendProposalMailCheck ? 1000 : 0);
    }

    setProjectName("");
    setProjectScopeNotes("");
    setSelectedPresetId("");
  };

  // Open Edit Modal for a specific project on Client Page ONLY
  const handleOpenEditModal = (proj: any) => {
    setEditingProject(proj);
    setEditName(proj.name || proj.title || "");
    setEditCategory(proj.category || "");
    setEditPropType(proj.proposalType || "Website + Mobile App Complete Ecosystem");
    setEditPropTier(proj.proposalTier || "Plan B (Professional Recommended)");
    setEditAmount(Number(proj.budget || 185000));
    setEditInvStatus(proj.invoiceStatus || "PAID");
    setEditThemeC1(proj.colorTheme || "#c2410c");
    setEditThemeC2(proj.colorTheme2 || "#f97316");
  };

  // Save Edit on Client Page ONLY
  const handleSaveEditModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const updatedProj = {
      ...editingProject,
      name: editName,
      category: editCategory,
      proposalType: editPropType,
      proposalTier: editPropTier,
      budget: editAmount,
      invoiceStatus: editInvStatus,
      colorTheme: editThemeC1,
      colorTheme2: editThemeC2
    };

    setClientProjects(prev => prev.map(p => (p.id === editingProject.id || p._id === editingProject._id ? updatedProj : p)));
    setEditingProject(null);
    setEmailStatusMsg(`Updated Quotation & Invoice details for ${editName} on Client Page!`);
    setTimeout(() => setEmailStatusMsg(null), 3500);

    // NON-BLOCKING ASYNC PERSISTENCE TO BACKEND
    const targetId = editingProject.id || editingProject._id;
    if (targetId) {
      fetch(`${API_URL}/crm/our-projects/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProj)
      }).catch(err => console.error("Error persisting edit:", err));
    }
  };

  // Handle logging a new call
  const handleLogCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callPurpose.trim()) {
      alert("Please enter call purpose.");
      return;
    }

    const newCall = {
      id: `CALL-${Date.now().toString().slice(-4)}`,
      clientId: client?.id || clientId,
      type: callType,
      duration: callDuration,
      purpose: callPurpose,
      notes: callNotes,
      nextAction: nextAction,
      followUpDate: followUpDate,
      createdDate: new Date().toISOString().split("T")[0]
    };

    // INSTANT OPTIMISTIC UI UPDATE
    setCallLogs(prev => [newCall, ...prev]);
    setShowLogCallModal(false);
    setCallPurpose("");
    setCallNotes("");
    setNextAction("");
    setFollowUpDate("");

    // NON-BLOCKING ASYNC SAVE
    fetch(`${API_URL}/crm/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCall)
    }).catch(err => console.error("Error saving call log:", err));
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-800">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Loading Client Profile Details...</p>
      </div>
    );
  }

  const clientNameStr = getSafeStr(client?.name, "nani");
  const companyNameStr = getSafeStr(client?.company, "soeshesay");

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 space-y-6 font-sans relative">
      
      {/* EMAIL TOAST NOTIFICATION BANNER */}
      {emailStatusMsg && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-orange-200 text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 font-sans text-xs">
          <Send className="w-5 h-5 text-orange-500 animate-pulse" />
          <span className="font-bold">{emailStatusMsg}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/admin/dashboard?tab=clients")}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="h-5 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <User className="text-orange-500 w-5 h-5" />
            <h1 className="font-heading font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <span>Client Profile Details</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 font-bold">
                {getSafeStr(client?.id, clientId)}
              </span>
            </h1>
          </div>
        </div>

        <Button
          onClick={() => router.push("/admin/dashboard?tab=clients")}
          variant="secondary"
          size="sm"
          className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs gap-1.5 border border-slate-200 shadow-xs"
        >
          <ArrowLeft size={14} /> Back to Clients Directory
        </Button>
      </div>

      {/* TOP PROFILE BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl border border-orange-500/20 relative overflow-hidden">
        <div className="flex justify-between items-start flex-wrap gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shrink-0">
              {companyNameStr.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-0.5 rounded-md">
                  {getSafeStr(client?.id, clientId)} &bull; CLIENT PROFILE CARD
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-md uppercase">
                  {getSafeStr(client?.status, "ACTIVE CLIENT")}
                </span>
                <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-md uppercase">
                  {getSafeStr(client?.industry, "Retail Sector")}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
                {companyNameStr}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <User size={13} className="text-orange-400" />
                <span>Primary Representative: <strong>{clientNameStr}</strong> ({getSafeStr(client?.email, "bdbbd@gmail.com")})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setShowNewProjectModal(true)}
              variant="primary"
              size="md"
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 gap-2 py-3 px-5 rounded-2xl border-0"
            >
              <Plus size={16} />
              <span>+ New Project, Proposal & Invoice</span>
            </Button>

            <Button
              onClick={() => setShowLogCallModal(true)}
              variant="secondary"
              size="md"
              className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs gap-2 py-3 px-4 rounded-2xl border border-slate-200 shadow-xs"
            >
              <Phone size={16} />
              <span>Log New Call</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CLIENT SPECIFICATIONS & ASSIGNED PROJECTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CLIENT SPECIFICATIONS & PROJECTS (1 COL) */}
        <div className="space-y-6">
          
          {/* CLIENT SPECIFICATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Client Specifications Overview</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Company / Business Name</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{companyNameStr}</strong>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Primary Representative</span>
                <strong className="text-slate-800 text-xs block mt-0.5">{clientNameStr}</strong>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address (Nodemailer Target)</span>
                <a 
                  href={`mailto:${client?.email}`}
                  className="text-orange-600 font-medium hover:underline flex items-center gap-1 mt-0.5 text-xs"
                >
                  <Mail size={13} />
                  <span>{getSafeStr(client?.email, "bdbbd@gmail.com")}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">WhatsApp / Contact Phone</span>
                <a 
                  href={`https://wa.me/${client?.whatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-600 font-mono font-bold hover:underline flex items-center gap-1 mt-0.5 text-xs"
                >
                  <MessageSquare size={13} />
                  <span>{getSafeStr(client?.whatsapp, "87598558")}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Industry Sector</span>
                <strong className="text-slate-800 block mt-0.5">{getSafeStr(client?.industry, "Retail")}</strong>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Complete Office Address</span>
                <p className="text-slate-600 leading-relaxed mt-0.5">{getSafeStr(client?.address, "hdfb")}</p>
              </div>
            </div>
          </div>

          {/* ASSIGNED CLIENT PROJECTS, PROPOSALS & INVOICES (WITH CLIENT-ONLY EDIT & NODEMAILER BUTTONS) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-orange-600" />
                <span>Assigned Projects & Proposals ({clientProjects.length})</span>
              </h3>
              
              <button 
                onClick={() => setShowNewProjectModal(true)} 
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {clientProjects.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-xs">No Projects Created Yet</h4>
                <p className="text-[11px] text-slate-500">
                  Click "+ New Project, Proposal & Invoice" above to configure proposal types, quotations, and tax invoices.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientProjects.map((proj, idx) => {
                  const pId = proj.id || proj._id || `PROJ-${idx}`;
                  const pName = getSafeStr(proj.name || proj.title, "Custom Project");
                  const pBudget = Number(proj.budget || 185000);
                  const pPropType = getSafeStr(proj.proposalType, "Website + Mobile App Complete Ecosystem");
                  const pTier = getSafeStr(proj.proposalTier, "Plan B (Professional Recommended)");
                  const pPropId = proj.proposalId || `PROP-${pId.slice(-4)}`;
                  const pInvId = proj.invoiceId || `INV-${pId.slice(-4)}`;
                  const pTheme1 = proj.colorTheme || "#c2410c";
                  const pTheme2 = proj.colorTheme2 || "#f97316";

                  return (
                    <div key={pId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs relative overflow-hidden shadow-xs">
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${pTheme1}, ${pTheme2})` }} />

                      <div className="flex justify-between items-start pt-1">
                        <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {pId}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* CLIENT PAGE ONLY EDIT BUTTON */}
                          <button
                            onClick={() => handleOpenEditModal(proj)}
                            className="p-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg text-[10px] flex items-center gap-1 px-2 font-bold hover:border-orange-500 transition-colors shadow-2xs"
                            title="Edit Quotation & Invoice (Client Page Only)"
                          >
                            <Edit3 size={12} className="text-orange-600" />
                            <span>Edit Here</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{pName}</h4>
                        <span className="text-[10px] text-orange-600 font-semibold block mt-0.5">
                          Type: {pPropType}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl space-y-1 text-[11px] border border-slate-200/80">
                        <div className="flex justify-between text-slate-600">
                          <span>Quotation Tier:</span>
                          <span className="font-semibold text-slate-900">{pTier}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Total Amount:</span>
                          <span className="font-extrabold text-orange-600 font-mono">₹{pBudget.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* NODEMAILER DISPATCH ACTION BUTTONS */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                        <button
                          onClick={() => handleSendNodemailerEmail("PROPOSAL", proj)}
                          className="py-1.5 px-2 bg-white hover:bg-orange-50 text-slate-800 border border-slate-200 hover:border-orange-300 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 shadow-2xs transition-all"
                        >
                          <Send size={11} className="text-orange-600" />
                          <span>Send Proposal Mail</span>
                        </button>

                        <button
                          onClick={() => handleSendNodemailerEmail("INVOICE", proj)}
                          className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 shadow-2xs transition-all"
                        >
                          <Send size={11} className="text-emerald-600" />
                          <span>Send Invoice Mail</span>
                        </button>
                      </div>

                      {/* OPEN FULL PAGE STUDIO BUTTONS */}
                      <div className="space-y-1.5 pt-1">
                        <Button
                          onClick={() => router.push(`/admin/our-projects/${pId}/proposals/${pPropId}`)}
                          variant="primary"
                          size="sm"
                          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-[11px] py-2 rounded-xl gap-1 justify-center shadow-xs"
                        >
                          <FileText size={13} />
                          <span>Open PROPOSAL PAGES (8 SECTIONS)</span>
                          <ChevronRight size={12} />
                        </Button>

                        <Button
                          onClick={() => router.push(`/admin/our-projects/${pId}/invoices/${pInvId}`)}
                          variant="secondary"
                          size="sm"
                          className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold text-[11px] py-1.5 rounded-xl gap-1 justify-center border-slate-200 shadow-2xs"
                        >
                          <Maximize2 size={12} className="text-orange-600" />
                          <span>Open FULL PAGE INVOICE STUDIO</span>
                          <ChevronRight size={12} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: CALL LOGS & TIMELINE (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex justify-between items-center flex-wrap gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span>Call Logs & Communication History</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Record of call interactions, discussion notes, and follow-ups for {companyNameStr}.
                </p>
              </div>

              <Button
                onClick={() => setShowLogCallModal(true)}
                variant="primary"
                size="sm"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs gap-1.5 shadow-xs"
              >
                <Plus size={14} /> + Log Call
              </Button>
            </div>

            {callLogs.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                <Phone className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-heading font-bold text-slate-700 text-xs">No Call Logs Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click the "+ Log Call" button above to record notes and set follow-up schedules.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {callLogs.map((log: any, idx: number) => {
                  const logType = log.type || "OUTGOING";
                  const logDuration = log.duration || "10 mins";
                  const logPurpose = getSafeStr(log.purpose, "Requirement discussion");
                  const logNotes = getSafeStr(log.notes, "Discussed project scope.");
                  const logNextAction = getSafeStr(log.nextAction);
                  const logFollowUpDate = getSafeStr(log.followUpDate);
                  const logDate = getSafeStr(log.createdDate, "2026-07-24");

                  return (
                    <div key={log.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-2xs">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            logType === "INCOMING" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold" 
                              : "bg-sky-50 text-sky-700 border-sky-200 font-bold"
                          }`}>
                            {logType} CALL
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            <span>{logDuration}</span>
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400">
                          {logDate}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-slate-900">
                          Purpose: {logPurpose}
                        </h4>
                        {logNotes && (
                          <p className="text-xs text-slate-700 mt-1 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                            "{logNotes}"
                          </p>
                        )}
                      </div>

                      {(logNextAction || logFollowUpDate) && (
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center justify-between flex-wrap gap-2 font-mono">
                          <div>
                            <strong className="text-orange-700">Next Action:</strong> {logNextAction || "Follow-up discussion"}
                          </div>
                          {logFollowUpDate && (
                            <span className="bg-orange-500 text-white px-2 py-0.5 rounded font-extrabold text-[10px]">
                              Follow-up: {logFollowUpDate}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* EDIT QUOTATION & INVOICE MODAL (EXCLUSIVELY FOR CLIENT PAGE) */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 text-slate-900">
            <div className="p-5 bg-slate-50 text-slate-900 flex justify-between items-center border-b border-slate-200">
              <h3 className="font-heading font-extrabold text-sm flex items-center gap-2">
                <Edit3 size={16} className="text-orange-600" />
                <span>Edit Quotation & Invoice (Client Page Only)</span>
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-900 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleSaveEditModalSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name / Title</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proposal Type</label>
                  <input
                    type="text"
                    value={editPropType}
                    onChange={(e) => setEditPropType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quotation Plan Tier</label>
                  <input
                    type="text"
                    value={editPropTier}
                    onChange={(e) => setEditPropTier(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Project Budget (INR)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-extrabold text-orange-600 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tax Invoice Payment Status</label>
                  <select
                    value={editInvStatus}
                    onChange={(e) => setEditInvStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 cursor-pointer"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tax Invoice Gradient Color Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setEditThemeC1(preset.c1);
                        setEditThemeC2(preset.c2);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                        editThemeC1 === preset.c1 && editThemeC2 === preset.c2 ? "border-orange-500 ring-2 ring-orange-500/30 bg-orange-50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full shadow-2xs" style={{ background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})` }} />
                      <span className="text-[10px] font-bold text-slate-800">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button type="button" onClick={() => setEditingProject(null)} variant="secondary" size="sm" className="bg-slate-100 text-slate-700 border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                  Save Changes (Client Page Only)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PROJECT, PROPOSAL & INVOICE WIZARD FULL PAGE SCREEN */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200 font-sans">
          
          {/* FULL PAGE HEADER BAR */}
          <div className="p-4 md:p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Exit Full Page Studio</span>
              </button>
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div>
                <h2 className="font-heading font-extrabold text-sm md:text-base text-slate-900 flex items-center gap-2">
                  <FolderOpen size={18} className="text-orange-600" />
                  <span>Configure Project, Proposal & Invoice Studio</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Full page workspace for client: <strong className="text-slate-800">{companyNameStr}</strong> ({clientNameStr})
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setShowNewProjectModal(false)}
              variant="secondary"
              size="sm"
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border-slate-200 shadow-xs"
            >
              Close Full Screen
            </Button>
          </div>

          {/* FULL PAGE FORM BODY */}
          <form onSubmit={handleCreateProjectProposalSubmit} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
              
              {/* STEP 1: PRESET PROJECT OR CUSTOM NAME */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <span className="font-extrabold text-orange-600 block uppercase text-[10px]">STEP 1: Select Project or Enter Title</span>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Select Project from Our Projects Database *</label>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => handlePresetSelect(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer focus:bg-white focus:border-orange-500"
                  >
                    <option value="">-- Select Available Project from Our Projects --</option>
                    {allOurProjects.map(p => {
                      const pKey = p.id || p._id;
                      const pTitle = getSafeStr(p.name || p.title, "Project");
                      const pCat = getSafeStr(p.category, "Web & Mobile Ecosystem");
                      return (
                        <option key={pKey} value={pKey}>
                          {pTitle} ({pCat})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. LMS (Learning Management System)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* STEP 2: PROPOSAL TYPE SELECTION */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <span className="font-extrabold text-orange-600 block uppercase text-[10px]">STEP 2: Select Proposal Type</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProposalType("WEBSITE_ONLY")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      proposalType === "WEBSITE_ONLY" ? "bg-orange-50 border-orange-500 text-slate-900 ring-2 ring-orange-500/20 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-extrabold text-xs block text-slate-900">🌐 Website Only Proposal</span>
                    <span className="text-[10px] text-slate-500 block">Responsive Web Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProposalType("MOBILE_APP_ONLY")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      proposalType === "MOBILE_APP_ONLY" ? "bg-orange-50 border-orange-500 text-slate-900 ring-2 ring-orange-500/20 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-extrabold text-xs block text-slate-900">📱 Mobile App Only Proposal</span>
                    <span className="text-[10px] text-slate-500 block">iOS & Android App</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProposalType("WEBSITE_AND_MOBILE_APP")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      proposalType === "WEBSITE_AND_MOBILE_APP" ? "bg-orange-50 border-orange-500 text-slate-900 ring-2 ring-orange-500/20 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-extrabold text-xs block text-slate-900">🚀 Website + Mobile App</span>
                    <span className="text-[10px] text-slate-500 block">Complete Ecosystem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProposalType("CUSTOM_SAAS")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      proposalType === "CUSTOM_SAAS" ? "bg-orange-50 border-orange-500 text-slate-900 ring-2 ring-orange-500/20 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-extrabold text-xs block text-slate-900">⚙️ Custom SaaS Platform</span>
                    <span className="text-[10px] text-slate-500 block">Enterprise Architecture</span>
                  </button>
                </div>
              </div>

              {/* STEP 3: QUOTATION PLAN TIER SELECTION */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <span className="font-extrabold text-orange-600 block uppercase text-[10px]">
                  STEP 3: Select Proposal Quotation Plan Tier {projectName ? `(Filtered for ${projectName})` : ""}
                </span>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Select Existing Quotation for {projectName || "Selected Project"} (Optional)</label>
                  <select
                    value={selectedQuotationId}
                    onChange={(e) => handleQuotationSelect(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer mb-2 focus:bg-white focus:border-orange-500"
                  >
                    <option value="">-- Configure New Quotation Tier --</option>
                    {filteredQuotations.map(q => {
                      const qKey = q.id || q._id;
                      const qTitle = getSafeStr(q.title || q.number, "Quotation");
                      return (
                        <option key={qKey} value={qKey}>
                          {qTitle} ({getSafeStr(q.selectedPlan, "Plan B")})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setProposalPlanTier("PLAN_A")}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      proposalPlanTier === "PLAN_A" ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Plan A (Essential)</span>
                    <strong className="text-sm font-mono text-slate-900 block mt-1">
                      ₹{(customPlanAPrice ? customPlanAPrice : (proposalType === "WEBSITE_ONLY" ? 65000 : proposalType === "MOBILE_APP_ONLY" ? 85000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 140000 : 160000)).toLocaleString()}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProposalPlanTier("PLAN_B")}
                    className={`p-3.5 rounded-xl border text-center transition-all relative ${
                      proposalPlanTier === "PLAN_B" ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[8px] font-extrabold uppercase bg-orange-600 text-white px-2 py-0.5 rounded-full absolute -top-2.5 left-1/2 -translate-x-1/2 shadow-2xs">
                      Recommended
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mt-1">Plan B (Pro)</span>
                    <strong className="text-sm font-mono text-orange-600 block mt-1">
                      ₹{(customPlanBPrice ? customPlanBPrice : (proposalType === "WEBSITE_ONLY" ? 95000 : proposalType === "MOBILE_APP_ONLY" ? 125000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 185000 : 220000)).toLocaleString()}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProposalPlanTier("PLAN_C")}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      proposalPlanTier === "PLAN_C" ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Plan C (Enterprise)</span>
                    <strong className="text-sm font-mono text-slate-900 block mt-1">
                      ₹{(customPlanCPrice ? customPlanCPrice : (proposalType === "WEBSITE_ONLY" ? 135000 : proposalType === "MOBILE_APP_ONLY" ? 175000 : proposalType === "WEBSITE_AND_MOBILE_APP" ? 250000 : 320000)).toLocaleString()}
                    </strong>
                  </button>
                </div>

                {/* TOGGLEABLE CLIENT-SCOPED QUOTATION EDIT & LIVE PREVIEW PANEL */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuotationEditPanel(!showQuotationEditPanel)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-orange-600 hover:text-orange-700 font-bold text-xs flex justify-between items-center transition-all shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 size={14} />
                      <span>{showQuotationEditPanel ? "🙈 Hide Quotation Editor & Preview" : "✏️ Edit Quotation Details & Live Document Preview"}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {showQuotationEditPanel ? "Click to Collapse" : "Click to Customize"}
                    </span>
                  </button>

                  {showQuotationEditPanel && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200 shadow-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Quotation Title</label>
                        <input
                          type="text"
                          value={customQuotationTitle}
                          onChange={(e) => setCustomQuotationTitle(e.target.value)}
                          placeholder={`Proposal for ${projectName || "Project"}`}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plan A Price (INR)</label>
                          <input
                            type="number"
                            value={customPlanAPrice}
                            onChange={(e) => setCustomPlanAPrice(e.target.value ? Number(e.target.value) : "")}
                            placeholder="65000"
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plan B Price (INR)</label>
                          <input
                            type="number"
                            value={customPlanBPrice}
                            onChange={(e) => setCustomPlanBPrice(e.target.value ? Number(e.target.value) : "")}
                            placeholder="95000"
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plan C Price (INR)</label>
                          <input
                            type="number"
                            value={customPlanCPrice}
                            onChange={(e) => setCustomPlanCPrice(e.target.value ? Number(e.target.value) : "")}
                            placeholder="135000"
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                          />
                        </div>
                      </div>

                      {/* EDITABLE DELIVERABLE / FEATURE LINE ITEMS LIST */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-700 uppercase">Proposal Feature Deliverables & Line Items</span>
                          <button
                            type="button"
                            onClick={addQuotationItem}
                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs"
                          >
                            <Plus size={11} /> + Add Feature Item
                          </button>
                        </div>

                        <div className="space-y-2">
                          {quotationItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateQuotationItem(item.id, "description", e.target.value)}
                                className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                                placeholder="Feature / Service description"
                              />
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateQuotationItem(item.id, "qty", Number(e.target.value))}
                                className="w-14 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold text-center"
                                placeholder="Qty"
                              />
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateQuotationItem(item.id, "rate", Number(e.target.value))}
                                className="w-24 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-orange-600 font-mono text-xs font-bold"
                                placeholder="Rate (₹)"
                              />
                              <button
                                type="button"
                                onClick={() => removeQuotationItem(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 text-xs font-bold"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RICH LIVE PROPOSAL DOCUMENT PREVIEW CARD */}
                      <div className="mt-3 p-4 bg-white rounded-2xl border border-orange-200 space-y-3 shadow-md">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="font-extrabold text-[11px] text-orange-600 uppercase tracking-wide flex items-center gap-1.5">
                            <FileText size={14} /> 📄 Live Proposal PDF Preview
                          </span>
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200 font-mono text-[10px] font-bold">
                            {proposalPlanTier}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700 border border-slate-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold text-xs">{customQuotationTitle || `Proposal for ${projectName || "Project"}`}</strong>
                              <span className="text-[10px] text-slate-500">Client: {companyNameStr} ({clientNameStr})</span>
                            </div>
                            <strong className="text-sm text-orange-600 font-mono font-extrabold">₹{getQuotationPrice().toLocaleString()}</strong>
                          </div>
                          <div className="pt-2 border-t border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Line Items Breakdown</span>
                            {quotationItems.map((item, idx) => (
                              <div key={item.id || idx} className="flex justify-between text-[11px] text-slate-700">
                                <span>{idx + 1}. {item.description}</span>
                                <span className="font-mono text-slate-500">₹{(item.qty * item.rate).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 4: TAX INVOICE OPTIONS & 2-COLOR GRADIENT */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <span className="font-extrabold text-orange-600 block uppercase text-[10px]">
                  STEP 4: Tax Invoice Options & 2-Color Theme {projectName ? `(Filtered for ${projectName})` : ""}
                </span>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Select Existing Tax Invoice for {projectName || "Selected Project"} (Optional)</label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => handleInvoiceSelect(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer mb-2 focus:bg-white focus:border-orange-500"
                  >
                    <option value="">-- Configure New Tax Invoice --</option>
                    {filteredInvoices.map(inv => {
                      const iKey = inv.id || inv._id;
                      const iTitle = getSafeStr(inv.title || inv.number, "Invoice");
                      return (
                        <option key={iKey} value={iKey}>
                          {iTitle} ({getSafeStr(inv.status, "PAID")})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Payment Status</label>
                    <select
                      value={invoicePaymentStatus}
                      onChange={(e) => setInvoicePaymentStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer focus:bg-white focus:border-orange-500"
                    >
                      <option value="PAID">PAID INVOICE</option>
                      <option value="PARTIAL">PARTIAL INVOICE</option>
                      <option value="PENDING">PENDING INVOICE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Primary Theme Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invoiceThemeC1}
                        onChange={(e) => setInvoiceThemeC1(e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer bg-slate-50"
                      />
                      <input
                        type="text"
                        value={invoiceThemeC1}
                        onChange={(e) => setInvoiceThemeC1(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Secondary Theme Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invoiceThemeC2}
                        onChange={(e) => setInvoiceThemeC2(e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer bg-slate-50"
                      />
                      <input
                        type="text"
                        value={invoiceThemeC2}
                        onChange={(e) => setInvoiceThemeC2(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* TOGGLEABLE CLIENT-SCOPED TAX INVOICE EDIT & LIVE PREVIEW PANEL */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceEditPanel(!showInvoiceEditPanel)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-orange-600 hover:text-orange-700 font-bold text-xs flex justify-between items-center transition-all shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 size={14} />
                      <span>{showInvoiceEditPanel ? "🙈 Hide Invoice Editor & Preview" : "✏️ Edit Tax Invoice Details & Live Document Preview"}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {showInvoiceEditPanel ? "Click to Collapse" : "Click to Customize"}
                    </span>
                  </button>

                  {showInvoiceEditPanel && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200 shadow-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Invoice Title</label>
                        <input
                          type="text"
                          value={customInvoiceTitle}
                          onChange={(e) => setCustomInvoiceTitle(e.target.value)}
                          placeholder={`Tax Invoice for ${projectName || "Project"}`}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Override Billed Amount (INR)</label>
                        <input
                          type="number"
                          value={customInvoiceAmount}
                          onChange={(e) => setCustomInvoiceAmount(e.target.value ? Number(e.target.value) : "")}
                          placeholder="Auto-calculated from quotation"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                        />
                      </div>

                      {/* EDITABLE SERVICE LINE ITEMS LIST */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-700 uppercase">Tax Invoice Service Line Items</span>
                          <button
                            type="button"
                            onClick={addInvoiceItem}
                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs"
                          >
                            <Plus size={11} /> + Add Invoice Item
                          </button>
                        </div>

                        <div className="space-y-2">
                          {invoiceItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateInvoiceItem(item.id, "description", e.target.value)}
                                className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                                placeholder="Service description"
                              />
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateInvoiceItem(item.id, "qty", Number(e.target.value))}
                                className="w-14 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold text-center"
                                placeholder="Qty"
                              />
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateInvoiceItem(item.id, "rate", Number(e.target.value))}
                                className="w-24 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-orange-600 font-mono text-xs font-bold"
                                placeholder="Rate (₹)"
                              />
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 text-xs font-bold"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RICH LIVE GRADIENT TAX INVOICE PREVIEW CARD */}
                      <div className="mt-3 p-4 bg-white rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden shadow-md">
                        <div className="h-1.5 w-full rounded-full" style={{ background: `linear-gradient(90deg, ${invoiceThemeC1}, ${invoiceThemeC2})` }} />
                        <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-700 uppercase tracking-wide">
                          <span className="flex items-center gap-1.5"><FileText size={14} /> 🧾 Live Tax Invoice PDF Preview</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                            invoicePaymentStatus === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            invoicePaymentStatus === "PARTIAL" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {invoicePaymentStatus} INVOICE
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700 border border-slate-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold text-xs">{customInvoiceTitle || `Tax Invoice for ${projectName || "Project"}`}</strong>
                              <span className="text-[10px] text-slate-500">Billed To: {companyNameStr} ({clientNameStr})</span>
                            </div>
                            <strong className="text-sm text-orange-600 font-mono font-extrabold">₹{getQuotationPrice().toLocaleString()}</strong>
                          </div>
                          <div className="pt-2 border-t border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Line Items Breakdown</span>
                            {invoiceItems.map((item, idx) => (
                              <div key={item.id || idx} className="flex justify-between text-[11px] text-slate-700">
                                <span>{idx + 1}. {item.description}</span>
                                <span className="font-mono text-slate-500">₹{(item.qty * item.rate).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 5: SEPARATE NODEMAILER EMAIL DISPATCH OPTIONS */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <span className="font-extrabold text-orange-600 block uppercase text-[10px]">STEP 5: Email Dispatch Options (Nodemailer)</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-orange-300 transition-all">
                    <input
                      type="checkbox"
                      checked={sendProposalMailCheck}
                      onChange={(e) => setSendProposalMailCheck(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Send Proposal Mail</span>
                      <span className="text-[10px] text-slate-500">Dispatch proposal to client</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-orange-300 transition-all">
                    <input
                      type="checkbox"
                      checked={sendInvoiceMailCheck}
                      onChange={(e) => setSendInvoiceMailCheck(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Send Invoice Mail</span>
                      <span className="text-[10px] text-slate-500">Dispatch tax invoice to client</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <Button type="button" onClick={() => setShowNewProjectModal(false)} variant="secondary" size="sm" className="bg-slate-100 text-slate-700 border-slate-200 font-bold">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-2.5 px-5 shadow-lg shadow-orange-500/25">
                  Generate & Send Email to Client
                </Button>
              </div>

            </form>
        </div>
      )}

      {/* LOG CALL MODAL */}
      {showLogCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 text-slate-900">
            <div className="p-5 bg-slate-50 text-slate-900 flex justify-between items-center border-b border-slate-200">
              <h3 className="font-heading font-extrabold text-sm flex items-center gap-2">
                <Phone size={16} className="text-orange-600" />
                <span>Log New Call for {companyNameStr}</span>
              </h3>
              <button onClick={() => setShowLogCallModal(false)} className="text-slate-400 hover:text-slate-900 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleLogCallSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Call Type</label>
                  <select
                    value={callType}
                    onChange={(e) => setCallType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  >
                    <option value="OUTGOING">OUTGOING CALL</option>
                    <option value="INCOMING">INCOMING CALL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Call Duration</label>
                  <input
                    type="text"
                    value={callDuration}
                    onChange={(e) => setCallDuration(e.target.value)}
                    placeholder="e.g. 15 mins"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Call Purpose *</label>
                <input
                  type="text"
                  required
                  value={callPurpose}
                  onChange={(e) => setCallPurpose(e.target.value)}
                  placeholder="e.g. Scope alignment & quotation follow up"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Call Discussion Notes</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Summarize key points discussed during the call..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:bg-white focus:border-orange-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Next Action Required</label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="e.g. Send updated invoice"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button type="button" onClick={() => setShowLogCallModal(false)} variant="secondary" size="sm" className="bg-slate-100 text-slate-700 border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                  Save Call Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
