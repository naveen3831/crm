"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  CreditCard, 
  TicketCheck, 
  LogOut, 
  Activity, 
  BarChart3, 
  Plus, 
  Search,
  CheckCircle,
  X,
  Phone,
  Layers,
  Sparkles,
  CheckSquare,
  FolderOpen,
  DollarSign,
  UserCheck,
  Briefcase,
  Settings,
  Mail,
  Bell,
  Trash2,
  Edit,
  Eye,
  ArrowRight,
  Download,
  Copy,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Clock,
  UserX,
  Loader2,
  Upload,
  FileCode,
  Paperclip,
  Edit3,
  Maximize2
} from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";
import ProjectDetailModal from "../../../components/admin/ProjectDetailModal";
import QuoteReviewModal from "../../../components/admin/QuoteReviewModal";
import HMSPresetSelectionModal from "../../../components/admin/HMSPresetSelectionModal";
import HMSPresetStudioPage from "../../../components/admin/HMSPresetStudioPage";
import { HMS_PRESETS } from "@/lib/HMSPresets";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  industry: string;
  type: string;
  assignedEmployee: string;
  status: "Active" | "Inactive" | "Potential" | "Existing" | "Blocked";
  notes: string;
  createdDate: string;
}

interface Call {
  id: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  calledBy: string;
  type: "Incoming" | "Outgoing" | "Follow-up" | "Sales call" | "Support call" | "Project discussion";
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "Connected" | "Not answered" | "Busy" | "Switched off" | "Call back later" | "Completed";
  purpose: string;
  notes: string;
  followUpDate: string;
  nextAction: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  category: string;
  manager: string;
  teamMembers: string[];
  startDate: string;
  expectedCompletionDate: string;
  budget: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  description: string;
  progress: number;
  status: "Planning" | "Quotation sent" | "Approved" | "In progress" | "On hold" | "Testing" | "Completed" | "Cancelled";
}

interface Quotation {
  number: string;
  clientName: string;
  projectName: string;
  title: string;
  serviceItems: { service: string; qty: number; rate: number }[];
  discount: number;
  tax: number;
  validUntil: string;
  terms: string;
  notes: string;
  createdBy: string;
  createdDate: string;
  status: "Draft" | "Sent" | "Viewed" | "Negotiation" | "Approved" | "Rejected" | "Expired";
}

interface ProjectFeature {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  moduleName: string;
  description: string;
  requirementType: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedDeveloper: string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  progress: number;
  status: "Planned" | "Approved" | "In development" | "Testing" | "Completed" | "Rejected" | "On hold";
  clientApproval: boolean;
  notes: string;
}

interface Innovation {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  proposedBy: string;
  description: string;
  businessBenefit: string;
  technicalBenefit: string;
  estimatedCost: number;
  estimatedDevTime: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  approvalStatus: "Proposed" | "Under review" | "Client approved" | "Admin approved" | "Rejected";
  implementationStatus: "Not started" | "Researching" | "Planned" | "In development" | "Testing" | "Implemented";
  clientFeedback: string;
  adminNotes: string;
}

interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  source: "Website" | "Facebook" | "Instagram" | "Google Ads" | "WhatsApp" | "Phone call" | "Referral" | "Direct enquiry" | "Other";
  interestedService: string;
  expectedBudget: number;
  assignedEmployee: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  leadScore: number;
  nextFollowUpDate: string;
  notes: string;
  status: "New" | "Contacted" | "Follow-up" | "Qualified" | "Proposal sent" | "Negotiation" | "Won" | "Lost";
  createdDate: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // States fetched live from MongoDB
  const [clients, setClients] = useState<Client[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ourProjects, setOurProjects] = useState<any[]>([]);
  const [showOurProjectModal, setShowOurProjectModal] = useState(false);
  const [activeOurProjectQuotation, setActiveOurProjectQuotation] = useState<any>(null);
  const [presetSelectionProject, setPresetSelectionProject] = useState<any>(null);
  const [ourProjectForm, setOurProjectForm] = useState({ name: "", category: "Web Application", clientName: "Internal / Showcase", budget: 0, liveUrl: "", description: "" });
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [reviewingQuote, setReviewingQuote] = useState<any>(null);

  const handleSelectPresetFromModal = async (presetKey: "website" | "website_app" | "app") => {
    if (!presetSelectionProject) return;
    const targetProj = presetSelectionProject;
    setPresetSelectionProject(null);

    const preset = HMS_PRESETS[presetKey];
    if (preset) {
      const projectTypesMap: Record<string, string[]> = {
        website: ["Web Application"],
        website_app: ["Web Application", "Mobile Application (iOS & Android)"],
        app: ["Mobile Application (iOS & Android)"]
      };

      const updatedFields = {
        id: `QT-${targetProj.id || "0001"}`,
        number: `QT-${targetProj.id || "0001"}`,
        projectId: targetProj.id,
        projectName: targetProj.name || targetProj.title,
        clientName: targetProj.clientName || "Enterprise Client",
        projectTypes: projectTypesMap[presetKey],
        projectType: preset.category,
        title: `${targetProj.name || targetProj.title} ${preset.title}`,
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
        companyDetailsDoc: preset.companyDetailsDoc,
        status: "Approved"
      };

      await handleSaveQuotationSection(updatedFields.id, updatedFields);
    }

    setActiveProjectDetail(targetProj);
    setActiveProjectTab("all");
  };
  const [reviewMode, setReviewMode] = useState<"exact-pdf" | "structured">("exact-pdf");
  const [reviewerNotes, setReviewerNotes] = useState<string>("");
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const defaultPlanComparisonDeliverables = [
    { deliverable: "Customer, Merchant & Admin Web Portals", planA: true, planB: true },
    { deliverable: "All Core Marketplace Features", planA: true, planB: true },
    { deliverable: "Secure Payment Gateway (Card / UPI)", planA: true, planB: true },
    { deliverable: "QR Ticket Check-In", planA: true, planB: true },
    { deliverable: "Android & iOS Mobile Apps", planA: false, planB: true },
    { deliverable: "Push Notifications", planA: false, planB: true },
    { deliverable: "App Store / Play Store Publishing", planA: false, planB: true }
  ];

  const isPdfBinaryNoise = (str: string): boolean => {
    if (!str) return true;
    const s = str.trim();
    if (s.startsWith("%PDF") || s.startsWith("%") || s.startsWith("<<") || s.startsWith(">>") || s.includes("obj") || s.includes("endobj")) return true;
    if (/^\/[A-Z][a-zA-Z0-9_]*/.test(s)) return true;
    if (/^\d+\s+\d+\s+obj/i.test(s) || /0\s+obj/i.test(s)) return true;
    if (s.includes("Mozilla/5.0") || s.includes("AppleWebKit") || s.includes("Skia/PDF") || s.includes("CreationDate")) return true;
    return false;
  };

  const sanitizeTextContent = (text: string, defaultFallback: string = ""): string => {
    if (!text || typeof text !== "string") return defaultFallback;

    const hasGarbage = text.includes("\uFFFD") || text.includes("") || text.includes("FlateDecode") || text.includes("endstream") || text.includes("endobj") || text.includes("Mozilla/5.0") || text.includes("AppleWebKit") || /\/Font|\/BBox|\/StructParents|\/MediaBox/.test(text);

    if (!hasGarbage) {
      const trimmed = text.trim();
      return trimmed.length > 0 ? trimmed : defaultFallback;
    }

    const lines = text.split(/\r?\n/);
    const cleanLines = lines.filter(line => {
      const l = line.trim();
      if (!l || l.length < 3) return false;
      if (l.includes("\uFFFD") || l.includes("")) return false;
      if (l.includes("FlateDecode") || l.includes("endstream") || l.includes("endobj") || l.includes("Mozilla/5.0") || l.includes("AppleWebKit")) return false;
      if (/^\/[A-Z][a-zA-Z0-9_]*/.test(l) || /^\d+\s+\d+\s+obj/i.test(l) || l.includes("stream x")) return false;

      const printableCount = (l.match(/[a-zA-Z0-9\s.,:;!?'"()\-/$%#&*+=@]/g) || []).length;
      return (printableCount / l.length) >= 0.75;
    });

    const result = cleanLines.join("\n").trim();
    return result.length > 0 ? result : defaultFallback;
  };

  const extractReadableTextFromFile = (file: File, content: string): string[] => {
    if (!content) return [];
    const fileName = file.name.toLowerCase();

    // 1. JSON file handling
    if (fileName.endsWith(".json")) {
      try {
        const parsed = JSON.parse(content);
        if (typeof parsed === "string") return [parsed];
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === "string" ? item : (item.title || item.name || item.deliverable || item.description || JSON.stringify(item)));
        }
        if (typeof parsed === "object" && parsed !== null) {
          const lines: string[] = [];
          Object.entries(parsed).forEach(([key, val]) => {
            if (typeof val === "string" && val.trim().length > 0) {
              lines.push(`${key}: ${val.trim()}`);
            } else if (Array.isArray(val)) {
              val.forEach(v => {
                if (typeof v === "string") lines.push(v);
                else if (typeof v === "object" && v !== null) {
                  lines.push(v.deliverable || v.title || v.name || v.description || JSON.stringify(v));
                }
              });
            }
          });
          return lines.length > 0 ? lines : [JSON.stringify(parsed)];
        }
      } catch {}
    }

    // 2. DOCX XML tag extraction
    if (fileName.endsWith(".docx") || content.includes("<w:t")) {
      const matches = content.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (matches && matches.length > 0) {
        const extracted = matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        if (extracted.length > 0) return extracted;
      }
    }

    // 3. PDF stream text extraction
    if (fileName.endsWith(".pdf") || content.startsWith("%PDF")) {
      const parenMatches = content.match(/\(([^()\\]|\\[\s\S])*\)/g);
      const pdfTextLines: string[] = [];
      if (parenMatches) {
        parenMatches.forEach(match => {
          const clean = match.slice(1, -1).replace(/\\([()])/g, "$1").trim();
          const printableCount = (clean.match(/[a-zA-Z0-9\s.,:;!?'"()\-/$%#&*+=@]/g) || []).length;
          if (clean.length >= 3 && (printableCount / clean.length) >= 0.75 && !/^\/[A-Z]/.test(clean) && !clean.startsWith("%") && !clean.includes("Skia/PDF") && !clean.includes("Mozilla/5.0")) {
            pdfTextLines.push(clean);
          }
        });
      }
      if (pdfTextLines.length > 0) return pdfTextLines;
    }

    // 4. TXT / CSV / Raw text fallback - strictly filter binary noise
    const rawLines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const printableLines = rawLines.filter(line => {
      if (line.includes("\uFFFD") || line.includes("")) return false;
      const isNoise = line.startsWith("%PDF") || line.startsWith("%") || line.includes("endstream") || line.includes("endobj") || line.includes("Mozilla/5.0") || line.includes("AppleWebKit") || /^\/[A-Z][a-zA-Z0-9_]*/.test(line);
      const printableCount = (line.match(/[a-zA-Z0-9\s.,:;!?'"()\-/$%#&*+=@]/g) || []).length;
      return !isNoise && (printableCount / line.length) >= 0.75;
    });

    return printableLines;
  };

  const getCleanPlanComparisonItems = (items: any[]) => {
    if (!Array.isArray(items) || items.length === 0) return defaultPlanComparisonDeliverables;
    const cleaned = items.filter((it: any) => {
      const name = it.deliverable || it.title || it.name || it.service || "";
      return name && !isPdfBinaryNoise(name);
    }).map((it: any) => ({
      deliverable: it.deliverable || it.title || it.name || it.service || "Deliverable Item",
      planA: it.planA !== undefined ? Boolean(it.planA) : true,
      planB: it.planB !== undefined ? Boolean(it.planB) : true
    }));
    return cleaned.length > 0 ? cleaned : defaultPlanComparisonDeliverables;
  };

  const [quotePlanComparisonItems, setQuotePlanComparisonItems] = useState<any[]>(defaultPlanComparisonDeliverables);
  const [newComparisonDeliverableText, setNewComparisonDeliverableText] = useState("");

  const featureFileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFeatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProjectDetail) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      let extractedFeatures: any[] = [];

      try {
        if (file.name.toLowerCase().endsWith(".json")) {
          const parsed = JSON.parse(content);
          const items = Array.isArray(parsed) ? parsed : (parsed.features || parsed.serviceItems || parsed.deliverables || [parsed]);
          extractedFeatures = items.map((item: any, idx: number) => ({
            id: `FEAT-FILE-${Date.now()}-${idx}`,
            projectId: activeProjectDetail.id,
            projectName: activeProjectDetail.name || activeProjectDetail.title,
            title: item.title || item.feature || item.name || item.description || `Feature ${idx + 1}`,
            moduleName: item.moduleName || item.category || "Uploaded Module",
            description: item.description || item.details || `Extracted from ${file.name}`,
            priority: item.priority || "High",
            assignedDeveloper: item.assignedDeveloper || "File Upload Import",
            progress: item.progress || 100,
            status: item.status || "Completed",
            sourceFile: file.name
          }));
        } else if (file.name.toLowerCase().endsWith(".csv")) {
          const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
          extractedFeatures = lines.map((line, idx) => {
            const parts = line.split(",");
            const titleVal = (parts[0] || `Feature ${idx + 1}`).replace(/^["']|["']$/g, "").trim();
            const moduleVal = (parts[1] || "Uploaded Scope").replace(/^["']|["']$/g, "").trim();
            const descVal = (parts[2] || `Imported line ${idx + 1} from ${file.name}`).replace(/^["']|["']$/g, "").trim();
            return {
              id: `FEAT-FILE-${Date.now()}-${idx}`,
              projectId: activeProjectDetail.id,
              projectName: activeProjectDetail.name || activeProjectDetail.title,
              title: titleVal,
              moduleName: moduleVal,
              description: descVal,
              priority: "High",
              assignedDeveloper: "File Upload Import",
              progress: 100,
              status: "Completed",
              sourceFile: file.name
            };
          });
        } else {
          const lines = extractReadableTextFromFile(file, content);
          extractedFeatures = lines
            .filter(l => {
              const lower = l.toLowerCase();
              return !lower.startsWith("ref:") && !lower.startsWith("date:") && !lower.startsWith("project:") && !lower.startsWith("client:") && !lower.startsWith("valid until:");
            })
            .map((line, idx) => {
              const cleanLine = line.replace(/^[•\-\*\d+\.\>\)]+\s*/, "").trim();
              let title = cleanLine;
              let description = `Imported scope feature from '${file.name}'`;
              
              if (cleanLine.includes(":") || cleanLine.includes(" - ")) {
                const splitChar = cleanLine.includes(":") ? ":" : " - ";
                const parts = cleanLine.split(splitChar);
                title = parts[0].trim();
                description = parts.slice(1).join(splitChar).trim() || description;
              }

              return {
                id: `FEAT-FILE-${Date.now()}-${idx}`,
                projectId: activeProjectDetail.id,
                projectName: activeProjectDetail.name || activeProjectDetail.title,
                title: title.length > 70 ? title.slice(0, 70) + "..." : title,
                moduleName: "Uploaded Scope Module",
                description: description,
                priority: "High",
                assignedDeveloper: "File Upload Import",
                progress: 100,
                status: "Completed",
                sourceFile: file.name
              };
            });
        }

        if (extractedFeatures.length > 0) {
          setFeatures(prev => [...extractedFeatures, ...prev]);

          for (const feat of extractedFeatures) {
            try {
              await fetch(`${API_URL}/crm/feature`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feat)
              });
            } catch (err) {
              console.error("[Save File Feature Error]", err);
            }
          }
          alert(`Successfully imported ${extractedFeatures.length} features from '${file.name}' into ${activeProjectDetail.name || activeProjectDetail.title}!`);
        }
      } catch (err) {
        console.error("[File Parse Error]", err);
        alert("Failed to parse features file. Please ensure it is a valid TXT, JSON, or CSV file.");
      }
      if (e.target) e.target.value = "";
    };
    reader.readAsText(file);
  };

  const universalSectionFileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeSectionToUpload, setActiveSectionToUpload] = useState<string>("overview");

  const handleSaveQuotationSection = async (quoteId: string, updatedFields: any) => {
    if (!activeProjectDetail) return;
    
    const existingQuote = quotations.find(q => 
      q.id === quoteId || 
      (q as any).number === quoteId || 
      q.projectId === activeProjectDetail.id ||
      (activeProjectDetail.name && q.projectName === activeProjectDetail.name)
    ) || {
      id: quoteId,
      number: quoteId,
      projectId: activeProjectDetail.id,
      clientName: activeProjectDetail.clientName || "Enterprise Client",
      projectName: activeProjectDetail.name || activeProjectDetail.title,
      title: `${activeProjectDetail.name || activeProjectDetail.title} Custom Estimation Proposal`
    };

    const targetId = existingQuote.id || quoteId;
    const updatedData: any = {
      ...existingQuote,
      ...updatedFields,
      id: targetId,
      number: targetId,
      projectId: activeProjectDetail.id,
      clientName: existingQuote.clientName || activeProjectDetail.clientName,
      projectName: existingQuote.projectName || activeProjectDetail.name || activeProjectDetail.title
    };

    try {
      const res = await fetch(`${API_URL}/crm/quotation/${encodeURIComponent(targetId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      }).then(r => r.json());

      const finalQuote = res.data || updatedData;
      setQuotations(prev => {
        const exists = prev.some(q => 
          q.id === targetId || 
          (q as any).number === targetId || 
          q.projectId === activeProjectDetail.id ||
          (activeProjectDetail.name && q.projectName === activeProjectDetail.name)
        );
        if (exists) {
          return prev.map(q => (
            q.id === targetId || 
            (q as any).number === targetId || 
            q.projectId === activeProjectDetail.id ||
            (activeProjectDetail.name && q.projectName === activeProjectDetail.name)
          ) ? finalQuote : q);
        } else {
          return [finalQuote, ...prev];
        }
      });
      alert("Section updated & saved to database successfully!");
    } catch (err) {
      console.error("[Save Section Error]", err);
      setQuotations(prev => [updatedData, ...prev.filter(q => q.id !== targetId)]);
      alert("Section updated!");
    }
  };

  const handleUniversalSectionFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, activeQuote: any) => {
    const file = e.target.files?.[0];
    if (!file || !activeProjectDetail) return;

    const currentSection = sectionId || activeProjectTab || "overview";
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = extractReadableTextFromFile(file, content);
      const cleanText = lines.join('\n');
      const qId = activeQuote?.id || activeQuote?.number || `QT-${activeProjectDetail.id}`;

      // Support full JSON quote configuration upload
      if (file.name.toLowerCase().endsWith(".json")) {
        try {
          const jsonParsed = JSON.parse(content);
          if (typeof jsonParsed === "object" && jsonParsed !== null && !Array.isArray(jsonParsed)) {
            await handleSaveQuotationSection(qId, jsonParsed);
            alert(`Uploaded JSON proposal document '${file.name}' and updated fields in database!`);
            if (e.target) e.target.value = "";
            return;
          }
        } catch {}
      }

      if (currentSection === "overview") {
        await handleSaveQuotationSection(qId, { overviewNarrative: cleanText });
      } else if (currentSection === "user-roles") {
        const third = Math.ceil(lines.length / 3);
        const cDesc = lines.slice(0, third).join('\n') || cleanText;
        const mDesc = lines.slice(third, third * 2).join('\n') || cleanText;
        const aDesc = lines.slice(third * 2).join('\n') || cleanText;
        await handleSaveQuotationSection(qId, { customerDesc: cDesc, merchantDesc: mDesc, adminDesc: aDesc });
      } else if (currentSection === "features") {
        await handleFeatureFileUpload(e);
        if (e.target) e.target.value = "";
        return;
      } else if (currentSection === "investment-plans") {
        const nums = cleanText.match(/\d[\d,.]*/g);
        if (nums && nums.length >= 2) {
          const pA = Number(nums[0].replace(/,/g, ''));
          const pB = Number(nums[1].replace(/,/g, ''));
          await handleSaveQuotationSection(qId, { planAPrice: pA, planBPrice: pB, overviewNarrative: cleanText });
        } else {
          await handleSaveQuotationSection(qId, { overviewNarrative: cleanText });
        }
      } else if (currentSection === "plan-comparison") {
        const items = lines.map(line => ({ deliverable: line, planA: true, planB: true }));
        await handleSaveQuotationSection(qId, { planComparisonItems: items });
      } else if (currentSection === "payment-terms") {
        await handleSaveQuotationSection(qId, { paymentTerms: cleanText });
      } else if (currentSection === "terms-conditions") {
        await handleSaveQuotationSection(qId, { termsAndConditions: cleanText });
      } else if (currentSection === "company-details") {
        await handleSaveQuotationSection(qId, { companyDetailsDoc: cleanText });
      } else {
        await handleSaveQuotationSection(qId, { overviewNarrative: cleanText });
      }

      alert(`Uploaded document '${file.name}' and updated section '${currentSection}' successfully!`);
      if (e.target) e.target.value = "";
    };
    reader.readAsText(file);
  };

  const getQuoteFinalVal = (q: any): number => {
    if (!q) return 0;
    let subtotal = 0;
    if (q.serviceItems && Array.isArray(q.serviceItems) && q.serviceItems.length > 0) {
      subtotal = q.serviceItems.reduce((acc: number, item: any) => {
        let r = Number(item.rate || item.amount || 0);
        if (isNaN(r) || r > 10000000) r = 15000;
        let qty = Number(item.qty || 1);
        if (isNaN(qty) || qty > 100) qty = 1;
        return acc + (r * qty);
      }, 0);
    } else {
      let planA = Number(q.planAPrice || q.budget || 50000);
      if (isNaN(planA) || planA > 10000000) planA = 50000;
      subtotal = planA;
    }

    if (isNaN(subtotal) || subtotal > 100000000) subtotal = 50000;

    const discPct = Math.min(100, Math.max(0, Number(q.discount || 0)));
    const afterDiscount = subtotal * (1 - discPct / 100);
    const taxPct = Math.max(0, Number(q.tax || 18));
    const finalVal = Math.round(afterDiscount * (1 + taxPct / 100));
    return (isNaN(finalVal) || finalVal > 100000000) ? 59000 : finalVal;
  };

  const quoteFileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedQuoteFileName, setUploadedQuoteFileName] = useState<string>("");

  const handleQuoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedQuoteFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const projId = activeProjectDetail ? activeProjectDetail.id : `PROJ-${Date.now().toString().slice(-4)}`;
      const projName = activeProjectDetail ? (activeProjectDetail.name || activeProjectDetail.title) : "General Proposal";
      const clientName = activeProjectDetail ? (activeProjectDetail.clientName || "Enterprise Client") : "Enterprise Client";

      let parsedQuoteData: any = null;

      try {
        if (file.name.toLowerCase().endsWith(".json")) {
          const parsed = JSON.parse(content);
          parsedQuoteData = {
            title: parsed.title || `${projName} Custom Quotation Proposal`,
            clientName: parsed.clientName || clientName,
            projectName: parsed.projectName || projName,
            currency: parsed.currency || "Indian Rupees (INR)",
            planAName: parsed.planAName || "PLAN A — Web Only",
            planAPrice: (parsed.planAPrice && Number(parsed.planAPrice) < 10000000) ? Number(parsed.planAPrice) : 60000,
            planBName: parsed.planBName || "PLAN B — Web + Mobile",
            planBPrice: (parsed.planBPrice && Number(parsed.planBPrice) < 10000000) ? Number(parsed.planBPrice) : 110000,
            planComparisonItems: Array.isArray(parsed.planComparisonItems || parsed.planComparison)
              ? (parsed.planComparisonItems || parsed.planComparison).map((it: any) => ({
                  deliverable: it.deliverable || it.title || it.service || "Deliverable Item",
                  planA: it.planA !== undefined ? Boolean(it.planA) : true,
                  planB: it.planB !== undefined ? Boolean(it.planB) : true
                }))
              : [
                  { deliverable: "Customer, Merchant & Admin Web Portals", planA: true, planB: true },
                  { deliverable: "All Core Marketplace Features", planA: true, planB: true },
                  { deliverable: "Secure Payment Gateway (Card / UPI)", planA: true, planB: true },
                  { deliverable: "QR Ticket Check-In", planA: true, planB: true },
                  { deliverable: "Android & iOS Mobile Apps", planA: false, planB: true },
                  { deliverable: "Push Notifications", planA: false, planB: true },
                  { deliverable: "App Store / Play Store Publishing", planA: false, planB: true }
                ],
            discount: parsed.discount || 0,
            tax: parsed.tax || 18,
            validUntil: parsed.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            overviewNarrative: parsed.overviewNarrative || parsed.overview || "",
            customerDesc: parsed.customerDesc || "",
            merchantDesc: parsed.merchantDesc || "",
            adminDesc: parsed.adminDesc || "",
            paymentTerms: parsed.paymentTerms || "",
            termsAndConditions: parsed.termsAndConditions || parsed.terms || "",
            serviceItems: Array.isArray(parsed.serviceItems || parsed.items || parsed.deliverables)
              ? (parsed.serviceItems || parsed.items || parsed.deliverables).map((it: any) => ({
                  description: it.description || it.title || it.service || "Scope Item",
                  qty: (it.qty && Number(it.qty) < 100) ? Number(it.qty) : 1,
                  rate: (it.rate && Number(it.rate) < 10000000) ? Number(it.rate) : 15000
                }))
              : []
          };
        } else {
          const lines = extractReadableTextFromFile(file, content);
          const overviewLine = lines.find(l => l.toLowerCase().includes("overview")) || lines[0] || "";
          const termsLine = lines.find(l => l.toLowerCase().includes("term")) || "";

          const parsedItems = lines
            .slice(0, 15)
            .map((line, idx) => {
              const cleanLine = line.replace(/^[•\-\*\d+\.\>\)]+\s*/, "").trim();
              let title = cleanLine;
              let desc = `Scope item imported from file ${file.name}`;
              let rateNum = 15000;

              if (cleanLine.includes(":") || cleanLine.includes(" - ")) {
                const splitChar = cleanLine.includes(":") ? ":" : " - ";
                const parts = cleanLine.split(splitChar);
                title = parts[0].trim();
                desc = parts.slice(1).join(splitChar).trim() || desc;

                const rateMatch = desc.match(/(?:[\$₹]|INR|USD|Rs\.?)?\s*([0-9,]{4,7})/i);
                if (rateMatch && rateMatch[1]) {
                  const r = Number(rateMatch[1].replace(/,/g, ""));
                  if (!isNaN(r) && r >= 1000 && r <= 5000000) rateNum = r;
                }
              }

              return {
                title: title.length > 70 ? title.slice(0, 70) + "..." : title,
                description: title.length > 70 ? title : `${title}: ${desc}`,
                service: title,
                qty: 1,
                rate: rateNum
              };
            });

          parsedQuoteData = {
            title: `${projName} Custom Quotation Proposal`,
            clientName: clientName,
            projectName: projName,
            currency: "Indian Rupees (INR)",
            planAName: "PLAN A — Web Only",
            planAPrice: 60000,
            planBName: "PLAN B — Web + Mobile",
            planBPrice: 110000,
            planComparisonItems: lines.map(l => ({ deliverable: l, planA: true, planB: true })),
            discount: 0,
            tax: 18,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            overviewNarrative: overviewLine ? overviewLine.replace(/^overview[:\s]*/i, "").trim() : `Imported overview specifications from ${file.name}.`,
            customerDesc: "Customer portal & role access specifications imported from document.",
            merchantDesc: "Merchant & service vendor portal specifications imported from document.",
            adminDesc: "Super Admin panel & governance controls imported from document.",
            paymentTerms: "40% advance on project kick-off\n30% on completion of core module\n30% on final delivery",
            termsAndConditions: termsLine ? termsLine.replace(/^terms[:\s]*/i, "").trim() : `Estimation proposal imported from file ${file.name}. Valid for 30 days.`,
            serviceItems: parsedItems.length > 0 ? parsedItems : [
              { title: `Core Scope Feature`, description: `Core Features from ${file.name}`, service: `Core Scope Feature`, qty: 1, rate: 60000 }
            ]
          };
        }

        const quoteId = `QT-${Date.now().toString().slice(-4)}`;
        const finalQuoteRecord: any = {
          id: quoteId,
          number: quoteId,
          projectId: projId,
          ...parsedQuoteData,
          status: "Approved",
          createdBy: "File Import Operator",
          createdDate: new Date().toISOString().split("T")[0],
          documentRef: `SPW/EST/${projName.toUpperCase().replace(/[^A-Z0-9]/g, '')}/FILE/2026`
        };

        try {
          const res = await fetch(`${API_URL}/crm/quotation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalQuoteRecord)
          }).then(r => r.json());

          const newQuote = res.data || finalQuoteRecord;
          setQuotations(prev => [newQuote, ...prev]);
          alert(`Successfully imported quotation file '${file.name}' and saved proposal to database!`);
        } catch (err) {
          console.error("[Save Quote File Error]", err);
          setQuotations(prev => [finalQuoteRecord, ...prev]);
          alert(`Imported proposal from '${file.name}'!`);
        }
      } catch (err) {
        console.error("[Quote File Error]", err);
        alert("Failed to process file. Please ensure it is a valid TXT, JSON, CSV, DOC, or PDF file.");
      }
      if (e.target) e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleToggleProjectType = (typeKey: string) => {
    if (selectedProjectTypes.includes(typeKey)) {
      setSelectedProjectTypes(prev => prev.filter(t => t !== typeKey));
    } else {
      if (selectedProjectTypes.length >= 2) {
        setSelectedProjectTypes([selectedProjectTypes[1], typeKey]);
      } else {
        setSelectedProjectTypes(prev => [...prev, typeKey]);
      }
    }
  };

  const handleGenerateCombinedQuotation = () => {
    if (!activeProjectDetail || selectedProjectTypes.length === 0) return;

    const projName = activeProjectDetail.name || activeProjectDetail.title || "Project";
    const clientName = activeProjectDetail.clientName || "Client Profile";

    const typeMap: Record<string, { title: string; price: number; features: any[] }> = {
      website: {
        title: "Website / Web Application",
        price: 50000,
        features: [
          { title: "Responsive Web Portal", description: "Modern, high-performance web portal built with Next.js/React & Tailwind CSS." },
          { title: "User Authentication & Roles", description: "Secure OAuth2 / JWT login, passwordless OTP, and role-based access control." },
          { title: "Admin Management Dashboard", description: "Comprehensive management panel for content, users, and platform analytics." },
          { title: "Payment Gateway Integration", description: "Card, UPI, Netbanking integration via Stripe / Razorpay." },
          { title: "SEO & Speed Optimization", description: "Server-side rendering (SSR), dynamic meta tags, and Lighthouse 95+ performance." },
          { title: "SSL & Cloud Deployment", description: "Automated CI/CD pipeline, SSL encryption, and AWS/Vercel deployment." }
        ]
      },
      mobile: {
        title: "Mobile Application (iOS & Android)",
        price: 90000,
        features: [
          { title: "Cross-Platform iOS & Android App", description: "Native-performance mobile application built with React Native / Flutter." },
          { title: "Push Notification Suite", description: "Real-time automated push notifications for updates, alerts, and promotional campaigns." },
          { title: "In-App Camera & QR Scanner", description: "Hardware integration for QR code scanning, image capture, and document upload." },
          { title: "Offline Data Sync & Storage", description: "Local SQLite database synchronization for seamless offline app usage." },
          { title: "In-App Chat & Messaging", description: "Real-time WebSocket chat between users and support/merchants." },
          { title: "App Store & Play Store Publishing", description: "Complete publishing setup, compliance audit, and release management." }
        ]
      },
      marketplace: {
        title: "Web & Mobile Marketplace Platform",
        price: 120000,
        features: [
          { title: "Customer Booking & Service Hiring Portal", description: "Browse, filter, add to cart, and book events or hire service providers." },
          { title: "Merchant / Vendor Dashboard", description: "Vendor onboarding, catalog management, booking management, and payout ledger." },
          { title: "Super Admin Control Panel", description: "Ecosystem governance, commission rates control, refund approvals, and audit logs." },
          { title: "Multi-Vendor Payment Split & Payouts", description: "Automated payment splits, commission retention, and vendor direct bank payouts." },
          { title: "QR Code Entry & Validation", description: "Unique encrypted QR tickets generated upon checkout with instant scanner validation." }
        ]
      },
      erp: {
        title: "Enterprise Cloud ERP & CRM System",
        price: 150000,
        features: [
          { title: "Lead Lifecycle & Sales CRM", description: "Pipeline tracking, automated follow-up scheduling, and deal stage analytics." },
          { title: "Inventory & Stock Control", description: "Multi-warehouse inventory tracking, reorder alerts, and SKU barcode management." },
          { title: "HRMS & Payroll Management", description: "Employee attendance, leaves, automated monthly payroll, and tax deductions." },
          { title: "Invoicing & Financial Accounting", description: "GST invoice generation, expense tracking, profit/loss ledger, and financial reports." }
        ]
      },
      ai: {
        title: "AI / ML Automation Suite",
        price: 180000,
        features: [
          { title: "LLM Content & Data Extraction Engine", description: "Custom AI pipeline powered by OpenAI / Claude / DeepSeek APIs." },
          { title: "Automated Document Processing (OCR)", description: "PDF/Image invoice parsing, structured data extraction, and automatic database sync." },
          { title: "Intelligent AI Chatbot Assistant", description: "Custom RAG knowledge chatbot for automated 24/7 customer support." },
          { title: "Predictive Analytics & Forecasting", description: "Machine learning models for sales forecasting, churn prediction, and trend analysis." }
        ]
      },
      custom: {
        title: "Custom Software Solution",
        price: 100000,
        features: [
          { title: "Custom Architecture & Database", description: "Tailored microservices/monolith architecture engineered for client requirements." },
          { title: "API Integration & Webhooks", description: "Third-party REST/GraphQL API integrations with robust retry mechanisms." },
          { title: "Dedicated Support & SLAs", description: "99.9% uptime SLA, dedicated technical manager, and 24/7 emergency support." }
        ]
      }
    };

    const selectedData = selectedProjectTypes.map(key => typeMap[key]).filter(Boolean);
    if (selectedData.length === 0) return;

    const combinedTitle = selectedData.map(d => d.title).join(" + ") + " Proposal";
    
    // Price 1 (Option 1 base) and Price 2 (Option 1 + Option 2 combined)
    const planAPrice = selectedData[0].price;
    const planBPrice = selectedData.length > 1 
      ? (selectedData[0].price + selectedData[1].price) 
      : Math.round(planAPrice * 1.75);

    let combinedFeatures: any[] = [];
    selectedData.forEach(d => {
      combinedFeatures = [...combinedFeatures, ...d.features];
    });

    const docRef = `SPW/EST/${projName.toUpperCase().replace(/[^A-Z0-9]/g, '')}/${selectedProjectTypes.join('-').toUpperCase()}/2026`;

    const newQuote = {
      id: `QT-${Date.now().toString().slice(-4)}`,
      projectId: activeProjectDetail.id,
      number: `QT-${Date.now().toString().slice(-4)}`,
      title: combinedTitle,
      clientName: clientName,
      projectName: projName,
      projectType: selectedData.map(d => d.title).join(" + "),
      currency: "Indian Rupees (INR)",
      planAPrice: planAPrice,
      planBPrice: planBPrice,
      status: "Approved",
      discount: 0,
      tax: 18,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documentRef: docRef,
      serviceItems: combinedFeatures.map(f => ({ description: `${f.title}: ${f.description}`, qty: 1, rate: Math.round(planAPrice / Math.max(1, combinedFeatures.length)) }))
    };

    setQuotations(prev => [
      newQuote,
      ...prev.filter(q => q.projectId !== activeProjectDetail.id && q.projectName !== projName)
    ]);

    setActiveProjectTab("quotations");
  };

  const triggerDirectPdfDownload = (htmlBody: string, fileName: string) => {
    const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
      });
    };

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    ]).then(async () => {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "790px";
      container.style.zIndex = "-99999";
      container.style.opacity = "0.99";
      container.style.background = "#ffffff";
      container.innerHTML = htmlBody;
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 250));

      try {
        const html2canvas = (window as any).html2canvas;
        const { jsPDF } = (window as any).jspdf;

        const pdf = new jsPDF("p", "mm", "a4");
        const pageElements = container.querySelectorAll(".pdf-page");

        if (pageElements.length > 0) {
          for (let i = 0; i < pageElements.length; i++) {
            const pageEl = pageElements[i] as HTMLElement;
            const canvas = await html2canvas(pageEl, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: "#ffffff"
            });
            const imgData = canvas.toDataURL("image/jpeg", 0.98);
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
          }
        } else {
          const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" });
          const imgData = canvas.toDataURL("image/jpeg", 0.98);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        }

        pdf.save(cleanFileName);
        document.body.removeChild(container);
      } catch (err: any) {
        console.error("PDF generation failed:", err);
        document.body.removeChild(container);
        alert("Failed to render PDF file.");
      }
    }).catch(() => {
      alert("Failed to load PDF export library. Please check your internet connection.");
    });
  };

  const generateSpeshwayEstimationPdfHtml = (project: any, quote: any, projectFeaturesList: any[]) => {
    const projName = project?.name || quote?.projectName || "JoyEvents";
    const clientName = quote?.clientName || project?.clientName || "JoyEvents";
    const docTitle = quote?.title || "Event & Service Marketplace Platform";
    const docRef = quote?.documentRef || `SPW/EST/${projName.toUpperCase().replace(/[^A-Z0-9]/g, '')}/2026`;
    const currencySymbol = (quote?.currency || "").includes("INR") || !(quote?.currency || "").includes("$") ? "₹" : "$";
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const currency = quote?.currency || 'Indian Rupees (INR)';
    const rawType = typeof quote?.projectType === 'string' ? quote.projectType : (typeof project?.category === 'string' ? project.category : 'Web Application');
    const selectedTypes: string[] = Array.isArray(quote?.projectTypes) && quote.projectTypes.length > 0
      ? quote.projectTypes
      : rawType.split(' + ').map((s: string) => s.trim()).filter(Boolean);

    const projectTypeDisplay = selectedTypes.join(' + ');
    const isHybridProposal = selectedTypes.length > 1;

    // Distinct Theme Palettes Per Project Type
    let domainPrimaryColor = "#0f172a";
    let domainSecondaryColor = "#0284c7";
    let defaultPlanA = "PLAN A — Standard Web Application";
    let defaultPlanB = "PLAN B — Enterprise Web Platform + CMS (Recommended)";

    if (isHybridProposal) {
      domainPrimaryColor = "#0f172a";
      domainSecondaryColor = "#ea580c";
      defaultPlanA = "PLAN A — Core Single Domain Build";
      defaultPlanB = `PLAN B — Full Multi-Platform Hybrid Ecosystem (${selectedTypes.join(" + ")})`;
    } else if (selectedTypes.includes("Mobile Application (iOS & Android)")) {
      domainPrimaryColor = "#4c1d95";
      domainSecondaryColor = "#9333ea";
      defaultPlanA = "PLAN A — Single Platform Build (Android or iOS)";
      defaultPlanB = "PLAN B — Dual Platform iOS + Android Launch (Recommended)";
    } else if (selectedTypes.includes("E-Commerce & Digital Marketplace")) {
      domainPrimaryColor = "#064e3b";
      domainSecondaryColor = "#059669";
      defaultPlanA = "PLAN A — Single Storefront E-Commerce";
      defaultPlanB = "PLAN B — Multi-Vendor Marketplace + Vendor Dashboard (Recommended)";
    } else if (selectedTypes.includes("Cloud / DevOps & Microservices")) {
      domainPrimaryColor = "#1e293b";
      domainSecondaryColor = "#d97706";
      defaultPlanA = "PLAN A — Single Cloud Server & CI/CD Setup";
      defaultPlanB = "PLAN B — Multi-Region Kubernetes Cluster & 99.9% SLA (Recommended)";
    } else if (selectedTypes.includes("AI / ML & Intelligent Automation")) {
      domainPrimaryColor = "#881337";
      domainSecondaryColor = "#e11d48";
      defaultPlanA = "PLAN A — Core AI API Integration & Chatbot";
      defaultPlanB = "PLAN B — Full RAG Vector Knowledge Engine + Autonomous AI Agents (Recommended)";
    } else if (selectedTypes.includes("Enterprise ERP & CRM Software")) {
      domainPrimaryColor = "#1e1b4b";
      domainSecondaryColor = "#4f46e5";
      defaultPlanA = "PLAN A — Standard ERP Core Module";
      defaultPlanB = "PLAN B — Multi-Tenant Enterprise ERP Suite + Audit Trail (Recommended)";
    } else if (selectedTypes.includes("Custom Software Development")) {
      domainPrimaryColor = "#7c2d12";
      domainSecondaryColor = "#ea580c";
      defaultPlanA = "PLAN A — Core Custom Software Build";
      defaultPlanB = "PLAN B — Advanced Enterprise Custom Suite (Recommended)";
    }

    const planAName = quote?.planAName || defaultPlanA;
    const planAPrice = quote?.planAPrice || (project?.budget ? Math.round(project.budget * 0.4) : 80000);
    const planBName = quote?.planBName || defaultPlanB;
    const planBPrice = quote?.planBPrice || (project?.budget ? project.budget : 140000);
    const formattedPlanAPrice = typeof planAPrice === 'number' ? planAPrice.toLocaleString() : (Number(planAPrice) || 80000).toLocaleString();
    const formattedPlanBPrice = typeof planBPrice === 'number' ? planBPrice.toLocaleString() : (Number(planBPrice) || 140000).toLocaleString();

    const pdfPrimaryColor = quote?.pdfPrimaryColor || domainPrimaryColor;
    const pdfSecondaryColor = quote?.pdfSecondaryColor || domainSecondaryColor;

    // Cross-Domain Hybrid Synergy Header Block
    let hybridSynergyHtml = '';
    if (isHybridProposal) {
      hybridSynergyHtml = `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; border-left: 4px solid #ea580c; position: relative; z-index: 1;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #fdba74; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
            <span>🔥 HYBRID MULTI-DOMAIN ARCHITECTURE SYNERGY</span>
            <span style="font-size: 8px; background: #ea580c; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: 900;">${selectedTypes.length} DOMAINS INTEGRATED</span>
          </div>
          <p style="font-size: 9.5px; color: #cbd5e1; line-height: 1.5; margin: 0;">
            This hybrid enterprise solution unifies <strong>${selectedTypes.join(" &bull; ")}</strong>. All selected platforms share a single centralized data layer, unified RESTful/GraphQL APIs, and single-sign-on (SSO) authentication.
          </p>
        </div>
      `;
    }

    // Domain Specific Architecture & Technical Specs
    let domainSpecsHtml = '';

    if (selectedTypes.includes('Web Application')) {
      domainSpecsHtml += `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #0369a1; text-transform: uppercase; display: block; margin-bottom: 3px;">🌐 WEB APPLICATION ARCHITECTURE & SCOPE</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">Mobile-responsive HTML5/CSS3 layout, cross-browser compatibility (Chrome/Safari/Firefox/Edge), 90+ Lighthouse performance optimization, SSL security & SEO OpenGraph tags.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('Mobile Application (iOS & Android)')) {
      domainSpecsHtml += `
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #7e22ce; text-transform: uppercase; display: block; margin-bottom: 3px;">📱 MOBILE APPLICATION SPECS (iOS & ANDROID)</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">Cross-platform Flutter/React Native build, Apple App Store & Google Play publishing, Firebase Push Notifications, FaceID biometric security & offline data caching.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('E-Commerce & Digital Marketplace')) {
      domainSpecsHtml += `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #047857; text-transform: uppercase; display: block; margin-bottom: 3px;">🛒 E-COMMERCE & MARKETPLACE INFRASTRUCTURE</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">Multi-variant SKUs, cart checkout flow, PCI-DSS Stripe/Razorpay payment gateways, merchant commission payout ledger & automated cart recovery.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('Cloud / DevOps & Microservices')) {
      domainSpecsHtml += `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #b45309; text-transform: uppercase; display: block; margin-bottom: 3px;">☁️ CLOUD DEVOPS & CONTAINERIZED ARCHITECTURE</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">AWS/GCP Terraform IaC provisioning, Docker containerization, Kubernetes auto-scaling, GitHub Actions zero-downtime CI/CD & 99.9% High Availability SLA.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('AI / ML & Intelligent Automation')) {
      domainSpecsHtml += `
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #be123c; text-transform: uppercase; display: block; margin-bottom: 3px;">🤖 AI / ML & INTELLIGENT AUTOMATION ENGINE</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">OpenAI/Claude LLM APIs, RAG Vector Search (Pinecone/pgvector), customer chatbot escalation agents & strict API rate limiting with zero client data model training.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('Enterprise ERP & CRM Software')) {
      domainSpecsHtml += `
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #3730a3; text-transform: uppercase; display: block; margin-bottom: 3px;">🏢 ENTERPRISE ERP & CRM ARCHITECTURE</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">Multi-tenant Role-Based Access Control (RBAC), custom multi-step workflow approval chains, enterprise audit trail logging & bulk CSV/Excel REST Webhooks.</span>
        </div>
      `;
    }

    if (selectedTypes.includes('Custom Software Development') || domainSpecsHtml === '') {
      domainSpecsHtml += `
        <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px;">
          <strong style="font-size: 10.5px; color: #c2410c; text-transform: uppercase; display: block; margin-bottom: 3px;">⚡ CUSTOM SOFTWARE SPECIFICATION</strong>
          <span style="font-size: 9.5px; color: #334155; line-height: 1.4; display: block;">Tailored domain architecture, custom database schema design, high-performance RESTful APIs with Redis caching & modular enterprise codebase.</span>
        </div>
      `;
    }

    const featItems = (projectFeaturesList && projectFeaturesList.length > 0) ? projectFeaturesList : [
      { title: "Ticketed Events", description: "Buy tickets for concerts, festivals, shows — with tiered pricing (e.g. Silver, Gold, Diamond) and session options (Day/Night)." },
      { title: "Service Hiring", description: "Hire event professionals (decorators, caterers, bands, venues) with custom requirements such as guest count and add-ons." },
      { title: "Secure Payments", description: "Online payments — full or partial advance/deposit — via card or UPI." },
      { title: "QR Ticket Check-In", description: "Each ticket carries a unique QR code, scanned at entry to validate authenticity and prevent fake tickets." },
      { title: "In-App Chat", description: "Direct messaging between customers and merchants for coordination and queries." },
      { title: "Ratings & Reviews", description: "1–5 star rating and review system after a completed booking." },
      { title: "AI Recommendations", description: "Personalized event suggestions based on each customer's past activity." },
      { title: "Promo Codes & Marketing", description: "Merchants can create discount codes and send promotional alerts to boost sales." },
      { title: "Invoices", description: "Downloadable / printable PDF receipt or invoice for every booking." },
      { title: "Cart & Checkout", description: "Add multiple events/services to a cart and complete a single combined checkout & payment." },
      { title: "Cancellation", description: "Customers can cancel a booking, with cancellation fees applied as per platform policy." },
      { title: "Merchant Dashboard", description: "List & sell, manage bookings, collect payments, check in guests, market business, withdraw earnings, track performance." },
      { title: "Admin Panel", description: "Merchant approvals, commission control, refunds & withdrawals, dispute resolution, user management, CMS & analytics dashboard." }
    ];

    const featureRowsHtml = featItems.map((feat: any, idx: number) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'}; border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 10px; font-size: 10px; font-weight: 700; color: #6d28d9;">${idx + 1}</td>
        <td style="padding: 8px 10px; font-size: 10px; font-weight: 700; color: #1e1b4b;">${feat.title}</td>
        <td style="padding: 8px 10px; font-size: 10px; color: #4b5563; line-height: 1.4;">${feat.description || 'Feature requirement details included in scope.'}</td>
      </tr>
    `).join('');

    const defaultOverviewText = `${projName} is a comprehensive digital solution designed to streamline client workflows, automate service bookings, track financial transactions, and optimize administration.`;
    const overviewText = sanitizeTextContent(quote?.overviewNarrative || project?.description, defaultOverviewText);

    const customerDesc = sanitizeTextContent(quote?.customerDesc, "Buys tickets or hires services, adds multiple items to a cart, and checks out together in a single transaction.");
    const merchantDesc = sanitizeTextContent(quote?.merchantDesc, "Sells tickets/services, manages bookings, markets their business, and earns money through the platform.");
    const adminDesc = sanitizeTextContent(quote?.adminDesc, "Owns and controls the platform — approves merchants, earns commission, and keeps the ecosystem safe.");

    const compName = quote?.companyName || "SPESHWAY SOLUTIONS";
    const compTagline = quote?.companyTagline || "Website & App Development Company | Hyderabad, India";
    const compEmail = quote?.companyEmail || "info@speshway.com";
    const compPhone = quote?.companyPhone || "+91 91000 06020";
    const compWebsite = quote?.companyWebsite || "www.speshway.com";
    const compAddress = quote?.companyAddress || "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India";
    const logoUrl = quote?.companyLogoUrl || "";
    const watermarkImg = quote?.companyWatermarkUrl || "";
    const watermarkText = quote?.companyWatermarkText || quote?.companyName || compName;
    const watermarkOpacity = quote?.companyWatermarkOpacity ?? 0.15;
    const watermarkContrast = quote?.companyWatermarkContrast ?? 150;
    const watermarkGrayscale = quote?.companyWatermarkGrayscale !== false;
    const watermarkRotation = quote?.companyWatermarkRotation ?? -25;

    const imgFilterStyle = watermarkGrayscale
      ? `filter: grayscale(100%) contrast(${watermarkContrast}%);`
      : `filter: contrast(${watermarkContrast}%);`;

    const watermarkHtml = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(${watermarkRotation}deg); opacity: ${watermarkOpacity}; pointer-events: none; width: 640px; text-align: center; z-index: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
        ${watermarkImg ? `<img src="${watermarkImg}" style="max-width: 260px; max-height: 200px; object-fit: contain; ${imgFilterStyle} display: block; margin: 0 auto 6px auto;" />` : ''}
        <div style="font-size: 46px; font-weight: 900; color: ${pdfPrimaryColor}; letter-spacing: 3px; text-transform: uppercase; line-height: 1.1; ${imgFilterStyle}">
          ${watermarkText}
        </div>
      </div>
    `;

    const cleanPaymentTerms = sanitizeTextContent(quote?.paymentTerms);
    const paymentTermsListHtml = (cleanPaymentTerms && cleanPaymentTerms.trim()) 
      ? cleanPaymentTerms.split('\n').filter((l: string) => l.trim()).map((l: string) => `<li>${l}</li>`).join('')
      : `
        <li><strong>40% advance</strong> on project kick-off</li>
        <li><strong>30%</strong> on completion of core module development & UAT build</li>
        <li><strong>30%</strong> on final delivery, deployment & go-live</li>
      `;

    const cleanTermsConditions = sanitizeTextContent(quote?.termsAndConditions);
    const termsAndConditionsListHtml = (cleanTermsConditions && cleanTermsConditions.trim())
      ? cleanTermsConditions.split('\n').filter((l: string) => l.trim()).map((l: string) => `<li>${l}</li>`).join('')
      : `
        <li>Estimation is valid for 30 days from the date of this document.</li>
        <li>Timeline: Plan A &mdash; approx. 6&ndash;8 weeks; Plan B &mdash; approx. 10&ndash;12 weeks from kick-off, subject to timely client inputs.</li>
        <li>Cost excludes third-party charges such as payment gateway fees, SMS/email gateway costs, Apple Developer & Google Play publishing fees, and domain/hosting charges.</li>
        <li>Includes 30 days of complimentary post-launch bug-fix support. Ongoing maintenance available under a separate AMC.</li>
        <li>Any change in scope beyond the listed features will be estimated and billed separately.</li>
        <li>Source code and deployment credentials will be handed over upon full and final payment.</li>
      `;

    const userRolesHtml = (quote?.userRoles && quote.userRoles.length > 0)
      ? quote.userRoles.map((r: any) => `
        <div style="background: #fcfaff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 14px;">
          <h4 style="font-size: 13px; font-weight: 800; color: ${pdfPrimaryColor}; margin: 0 0 4px 0;">${r.title || r.roleName}</h4>
          <p style="font-size: 10px; color: #4b5563; line-height: 1.4; margin: 0;">${r.description}</p>
        </div>
      `).join('')
      : `
        <div style="background: #fcfaff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 14px;">
          <h4 style="font-size: 13px; font-weight: 800; color: ${pdfPrimaryColor}; margin: 0 0 4px 0;">Customer</h4>
          <p style="font-size: 10px; color: #4b5563; line-height: 1.4; margin: 0;">${customerDesc}</p>
        </div>
        <div style="background: #fcfaff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 14px;">
          <h4 style="font-size: 13px; font-weight: 800; color: ${pdfPrimaryColor}; margin: 0 0 4px 0;">Merchant</h4>
          <p style="font-size: 10px; color: #4b5563; line-height: 1.4; margin: 0;">${merchantDesc}</p>
        </div>
        <div style="background: #fcfaff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 14px;">
          <h4 style="font-size: 13px; font-weight: 800; color: ${pdfPrimaryColor}; margin: 0 0 4px 0;">Admin</h4>
          <p style="font-size: 10px; color: #4b5563; line-height: 1.4; margin: 0;">${adminDesc}</p>
        </div>
      `;

    return `
      <div style="font-family: 'Poppins', sans-serif;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
        <style>
          * { font-family: 'Poppins', sans-serif !important; }
          .pdf-page { font-family: 'Poppins', sans-serif !important; position: relative; overflow: hidden; }
        </style>

        <!-- PAGE 1 -->
        <div class="pdf-page" style="width: 790px; height: 1115px; background: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          ${watermarkHtml}
          <div style="position: relative; z-index: 1;">
            <div style="background: linear-gradient(135deg, ${pdfPrimaryColor} 0%, ${pdfSecondaryColor} 100%); padding: 22px 28px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${logoUrl ? `<img src="${logoUrl}" style="height: 40px; width: auto; max-width: 120px; object-fit: contain; background: #ffffff; padding: 4px; border-radius: 8px;" />` : `<div style="background: #ffffff; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: ${pdfPrimaryColor}; font-size: 18px;">${compName.charAt(0)}</div>`}
                <div>
                  <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${compName}</div>
                  <div style="font-size: 10px; opacity: 0.9; font-weight: 600; margin-top: 1px;">${compTagline}</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 15px; font-weight: 800; text-transform: uppercase;">PROJECT ESTIMATION</div>
                <div style="font-size: 10px; opacity: 0.9; font-family: monospace; font-weight: 700; margin-top: 2px;">Ref: ${docRef}</div>
                <div style="font-size: 10px; opacity: 0.85; margin-top: 1px;">Date: ${currentDate}</div>
              </div>
            </div>

            <div style="padding: 26px;">
              <h1 style="font-size: 24px; font-weight: 800; color: ${pdfPrimaryColor}; margin: 0 0 4px 0;">${projName} &mdash; ${docTitle}</h1>
              <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 22px;">Project Cost Estimation & Feature Scope Document</div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px 20px; background: #fcfaff; border: 1px solid #ede9fe; padding: 16px 18px; border-radius: 8px; margin-bottom: 24px;">
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Prepared For</span><strong style="font-size: 12px; color: #1e1b4b;">Client &mdash; ${clientName}</strong></div>
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Prepared By</span><strong style="font-size: 12px; color: #1e1b4b;">${compName}</strong></div>
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Selected Project Domains</span><strong style="font-size: 11px; color: #1e1b4b; line-height: 1.3; display: block;">${projectTypeDisplay}</strong></div>
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Currency</span><strong style="font-size: 12px; color: #1e1b4b;">${currency}</strong></div>
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Document Ref</span><strong style="font-size: 11px; font-family: monospace; color: #1e1b4b;">${docRef}</strong></div>
                <div><span style="font-size: 9px; font-weight: 700; color: ${pdfPrimaryColor}; text-transform: uppercase; display: block; margin-bottom: 2px;">Proposal Format</span><strong style="font-size: 12px; color: #1e1b4b;">${isHybridProposal ? `🔥 Hybrid (${selectedTypes.length} Domains)` : '⚡ Specialized Single Domain'}</strong></div>
              </div>

              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 12px; text-transform: uppercase;">1. Project Executive Overview</div>
              <p style="font-size: 11px; line-height: 1.6; color: #374151; margin: 0 0 24px 0; background: #fafafa; padding: 14px; border-radius: 8px; border-left: 4px solid ${pdfSecondaryColor};">${overviewText}</p>

              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 12px; text-transform: uppercase;">2. User Roles</div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                ${userRolesHtml}
              </div>
            </div>
          </div>

          <div style="background: #0f172a; color: #ffffff; padding: 16px 26px; font-size: 8.5px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <div><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">${compName}</strong>${compAddress}</div>
            <div style="text-align: right;"><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">Contact</strong>${compEmail} &bull; ${compPhone} &bull; ${compWebsite} <span style="margin-left: 12px; color: #94a3b8; font-weight: 700;">Page 1 of 4</span></div>
          </div>
        </div>

        <!-- PAGE 2 -->
        <div class="pdf-page" style="width: 790px; height: 1115px; background: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          ${watermarkHtml}
          <div style="position: relative; z-index: 1;">
            <div style="background: linear-gradient(135deg, ${pdfPrimaryColor} 0%, ${pdfSecondaryColor} 100%); padding: 18px 28px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${logoUrl ? `<img src="${logoUrl}" style="height: 34px; width: auto; max-width: 100px; object-fit: contain; background: #ffffff; padding: 3px; border-radius: 6px;" />` : `<div style="background: #ffffff; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: ${pdfPrimaryColor}; font-size: 16px;">${compName.charAt(0)}</div>`}
                <span style="font-size: 16px; font-weight: 800; text-transform: uppercase;">${compName}</span>
              </div>
              <div style="text-align: right; font-size: 12px; font-weight: 800; text-transform: uppercase;">PROJECT ESTIMATION &bull; <span style="font-family: monospace;">${docRef}</span></div>
            </div>

            <div style="padding: 26px;">
              ${hybridSynergyHtml}
              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 12px; text-transform: uppercase;">3. Domain Technical Specifications (${selectedTypes.length} Domain${selectedTypes.length > 1 ? 's' : ''})</div>
              ${domainSpecsHtml}

              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-top: 14px; margin-bottom: 12px; text-transform: uppercase;">4. Feature Scope Matrix</div>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background: ${pdfPrimaryColor}; color: #ffffff;">
                    <th style="padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 800; width: 25px;">#</th>
                    <th style="padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 800; width: 160px;">Feature</th>
                    <th style="padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 800;">Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${featureRowsHtml}
                </tbody>
              </table>
            </div>
          </div>

          <div style="background: #0f172a; color: #ffffff; padding: 16px 26px; font-size: 8.5px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <div><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">${compName}</strong>${compAddress}</div>
            <div style="text-align: right;"><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">Contact</strong>${compEmail} &bull; ${compPhone} &bull; ${compWebsite} <span style="margin-left: 12px; color: #94a3b8; font-weight: 700;">Page 2 of 4</span></div>
          </div>
        </div>

        <!-- PAGE 3 -->
        <div class="pdf-page" style="width: 790px; height: 1115px; background: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          ${watermarkHtml}
          <div style="position: relative; z-index: 1;">
            <div style="background: linear-gradient(135deg, ${pdfPrimaryColor} 0%, ${pdfSecondaryColor} 100%); padding: 18px 28px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${logoUrl ? `<img src="${logoUrl}" style="height: 34px; width: auto; max-width: 100px; object-fit: contain; background: #ffffff; padding: 3px; border-radius: 6px;" />` : `<div style="background: #ffffff; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: ${pdfPrimaryColor}; font-size: 16px;">${compName.charAt(0)}</div>`}
                <span style="font-size: 16px; font-weight: 800; text-transform: uppercase;">${compName}</span>
              </div>
              <div style="text-align: right; font-size: 12px; font-weight: 800; text-transform: uppercase;">PROJECT ESTIMATION &bull; <span style="font-family: monospace;">${docRef}</span></div>
            </div>

            <div style="padding: 26px;">
              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 12px; text-transform: uppercase;">4. Investment Plans</div>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 12px;">Two engagement options are proposed based on platform reach. Both plans deliver the complete feature set listed in Section 3.</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
                <div style="background: ${pdfPrimaryColor}; color: #ffffff; border-radius: 10px; padding: 18px;">
                  <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; opacity: 0.9;">${planAName}</div>
                  <div style="font-size: 28px; font-weight: 900; margin: 8px 0 12px 0; color: #ffffff;">${currencySymbol}${formattedPlanAPrice}</div>
                  <ul style="font-size: 10px; line-height: 1.6; padding-left: 14px; margin: 0; opacity: 0.95;">
                    <li>Responsive web application (Customer, Merchant & Admin portals)</li>
                    <li>All core features from Section 3</li>
                    <li>Secure payment gateway integration (Card / UPI)</li>
                    <li>QR-based ticket check-in (web scanner)</li>
                    <li>Admin & Merchant dashboards</li>
                    <li>Cross-browser, mobile-responsive UI</li>
                    <li>Basic SEO setup & deployment</li>
                  </ul>
                </div>

                <div style="background: linear-gradient(135deg, ${pdfPrimaryColor}, ${pdfSecondaryColor}); color: #ffffff; border-radius: 10px; padding: 18px; border: 2px solid #a855f7; position: relative;">
                  <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; opacity: 0.9;">${planBName} <span style="background: #f59e0b; color: #ffffff; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 8px; margin-left: 4px;">RECOMMENDED</span></div>
                  <div style="font-size: 28px; font-weight: 900; margin: 8px 0 12px 0; color: #ffffff;">${currencySymbol}${formattedPlanBPrice}</div>
                  <ul style="font-size: 10px; line-height: 1.6; padding-left: 14px; margin: 0; opacity: 0.95;">
                    <li><strong>Everything in Plan A, plus:</strong></li>
                    <li>Native/hybrid mobile apps for Customer & Merchant (Android + iOS)</li>
                    <li>Push notifications for promotions & alerts</li>
                    <li>In-app QR scanner for on-site check-in</li>
                    <li>Mobile-optimized chat & booking flow</li>
                    <li>App Store & Play Store submission support</li>
                  </ul>
                </div>
              </div>

              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 14px; text-transform: uppercase;">5. Plan Comparison</div>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background: ${pdfPrimaryColor}; color: #ffffff;">
                    <th style="padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 800;">Deliverable</th>
                    <th style="padding: 8px 10px; text-align: center; font-size: 10px; font-weight: 800; width: 130px;">Plan A &mdash; Web Only</th>
                    <th style="padding: 8px 10px; text-align: center; font-size: 10px; font-weight: 800; width: 130px;">Plan B &mdash; Web + Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  ${((quote?.planComparisonItems && quote.planComparisonItems.length > 0) ? quote.planComparisonItems : [
                    { deliverable: "Customer, Merchant & Admin Web Portals", planA: true, planB: true },
                    { deliverable: "All Core Marketplace Features", planA: true, planB: true },
                    { deliverable: "Secure Payment Gateway (Card / UPI)", planA: true, planB: true },
                    { deliverable: "QR Ticket Check-In", planA: true, planB: true },
                    { deliverable: "Android & iOS Mobile Apps", planA: false, planB: true },
                    { deliverable: "Push Notifications", planA: false, planB: true },
                    { deliverable: "App Store / Play Store Publishing", planA: false, planB: true }
                  ]).map((item: any, idx: number) => `
                    <tr style="border-bottom: 1px solid #f3f4f6; ${idx % 2 === 1 ? 'background: #f9fafb;' : ''}">
                      <td style="padding: 8px 10px; font-size: 10px; font-weight: 600;">${item.deliverable || item.title || item.name}</td>
                      <td style="padding: 8px 10px; text-align: center; color: ${item.planA !== false ? '#16a34a' : '#9ca3af'}; font-weight: 900;">${item.planA !== false ? '&#10004;' : '&mdash;'}</td>
                      <td style="padding: 8px 10px; text-align: center; color: ${item.planB !== false ? '#16a34a' : '#9ca3af'}; font-weight: 900;">${item.planB !== false ? '&#10004;' : '&mdash;'}</td>
                    </tr>
                  `).join('')}
                  <tr style="background: #f5f3ff; font-weight: 800;">
                    <td style="padding: 9px 10px; font-size: 11px; color: ${pdfPrimaryColor};">Total Investment</td>
                    <td style="padding: 9px 10px; text-align: center; font-size: 11px; color: ${pdfSecondaryColor};">${currencySymbol}${formattedPlanAPrice}</td>
                    <td style="padding: 9px 10px; text-align: center; font-size: 11px; color: ${pdfSecondaryColor};">${currencySymbol}${formattedPlanBPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="background: #0f172a; color: #ffffff; padding: 16px 26px; font-size: 8.5px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <div><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">${compName}</strong>${compAddress}</div>
            <div style="text-align: right;"><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">Contact</strong>${compEmail} &bull; ${compPhone} &bull; ${compWebsite} <span style="margin-left: 12px; color: #94a3b8; font-weight: 700;">Page 3 of 4</span></div>
          </div>
        </div>

        <!-- PAGE 4 -->
        <div class="pdf-page" style="width: 790px; height: 1115px; background: #ffffff; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
          ${watermarkHtml}
          <div style="position: relative; z-index: 1;">
            <div style="background: linear-gradient(135deg, ${pdfPrimaryColor} 0%, ${pdfSecondaryColor} 100%); padding: 18px 28px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${logoUrl ? `<img src="${logoUrl}" style="height: 34px; width: auto; max-width: 100px; object-fit: contain; background: #ffffff; padding: 3px; border-radius: 6px;" />` : `<div style="background: #ffffff; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: ${pdfPrimaryColor}; font-size: 16px;">${compName.charAt(0)}</div>`}
                <span style="font-size: 16px; font-weight: 800; text-transform: uppercase;">${compName}</span>
              </div>
              <div style="text-align: right; font-size: 12px; font-weight: 800; text-transform: uppercase;">PROJECT ESTIMATION &bull; <span style="font-family: monospace;">${docRef}</span></div>
            </div>

            <div style="padding: 26px;">
              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 14px; text-transform: uppercase;">6. Payment Terms</div>
              <ul style="font-size: 10px; line-height: 1.7; color: #374151; padding-left: 18px; margin: 0 0 28px 0;">
                ${paymentTermsListHtml}
              </ul>

              <div style="background: ${pdfPrimaryColor}; color: #ffffff; padding: 8px 14px; font-size: 13px; font-weight: 800; border-radius: 6px; margin-bottom: 14px; text-transform: uppercase;">7. Terms & Conditions</div>
              <ul style="font-size: 10px; line-height: 1.6; color: #4b5563; padding-left: 18px; margin: 0 0 32px 0;">
                ${termsAndConditionsListHtml}
              </ul>

              <div style="display: flex; justify-content: space-between; margin-top: 40px; margin-bottom: 24px;">
                <div style="width: 42%;">
                  <div style="font-size: 10px; font-weight: 700; color: #1e1b4b; margin-bottom: 40px;">For <strong>${compName}</strong></div>
                  <div style="border-bottom: 1px dashed #9ca3af; width: 100%;"></div>
                  <div style="font-size: 9px; color: #6b7280; margin-top: 4px;">Authorized Signatory</div>
                </div>
                <div style="width: 42%;">
                  <div style="font-size: 10px; font-weight: 700; color: #1e1b4b; margin-bottom: 40px;">For <strong>${clientName}</strong></div>
                  <div style="border-bottom: 1px dashed #9ca3af; width: 100%;"></div>
                  <div style="font-size: 9px; color: #6b7280; margin-top: 4px;">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>

          <div style="background: #0f172a; color: #ffffff; padding: 16px 26px; font-size: 8.5px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <div><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">${compName}</strong>${compAddress}</div>
            <div style="text-align: right;"><strong style="font-size: 9.5px; color: #a7f3d0; display: block; margin-bottom: 2px;">Contact</strong>${compEmail} &bull; ${compPhone} &bull; ${compWebsite} <span style="margin-left: 12px; color: #94a3b8; font-weight: 700;">Page 4 of 4</span></div>
          </div>
        </div>
      </div>
    `;
  };

  const handleDownloadProjectReport = (project: any) => {
    if (!project) return;
    const projectFeaturesList = features.filter(f => 
      f.projectId === project.id || 
      f.projectId === project.name || 
      f.projectName === project.name
    );
    const mainQuote = quotations.find(q => q.projectId === project.id || q.projectName === project.name || q.clientName === project.clientName);

    const pdfHtml = generateSpeshwayEstimationPdfHtml(project, mainQuote, projectFeaturesList);
    triggerDirectPdfDownload(pdfHtml, `${(project.name || "Project").replace(/[^a-zA-Z0-9]/gi, "_")}_Estimation_Document.pdf`);
  };

  const handleDownloadSingleQuote = (q: any) => {
    const projectFeaturesList = features.filter(f => 
      f.projectId === q.projectId || 
      f.projectName === q.projectName
    );
    const pdfHtml = generateSpeshwayEstimationPdfHtml(null, q, projectFeaturesList);
    triggerDirectPdfDownload(pdfHtml, `${(q.number || q.title || "Quotation").replace(/[^a-zA-Z0-9]/gi, "_")}_Proposal.pdf`);
  };

  // Sidebar link categories mapping
  const sidebarCategories = [
    {
      title: "Overview",
      links: [{ name: "Dashboard Hub", id: "overview", icon: <BarChart3 size={16} /> }]
    },
    {
      title: "CRM Management",
      links: [
        { name: "Clients", id: "clients", icon: <Users size={16} /> },
        { name: "Client Calls", id: "calls", icon: <Phone size={16} /> },
        { name: "Leads Log", id: "leads", icon: <TrendingUp size={16} /> },
        { name: "Follow-ups", id: "followups", icon: <Clock size={16} /> }
      ]
    },
    {
      title: "Projects workspace",
      links: [
        { name: "All Projects", id: "projects", icon: <FolderOpen size={16} /> },
        { name: "Our Projects", id: "our-projects", icon: <Briefcase size={16} /> },
        { name: "Quotations", id: "quotations", icon: <FileText size={16} /> },
        { name: "Project Features", id: "features", icon: <Layers size={16} /> },
        { name: "Innovations Idea", id: "innovations", icon: <Sparkles size={16} /> }
      ]
    },
    {
      title: "Finance & Accounts",
      links: [
        { name: "Invoices", id: "invoices", icon: <FileText size={16} /> },
        { name: "Payments Log", id: "payments", icon: <CreditCard size={16} /> },
        { name: "Expense Ledger", id: "expenses", icon: <DollarSign size={16} /> }
      ]
    },
    {
      title: "Corporate Management",
      links: [
        { name: "System Users", id: "users", icon: <Users size={16} /> },
        { name: "Employees Profile", id: "employees", icon: <Briefcase size={16} /> },
        { name: "Department Teams", id: "teams", icon: <Briefcase size={16} /> }
      ]
    },
    {
      title: "Analytics Reports",
      links: [
        { name: "Sales Reports", id: "reports-sales", icon: <BarChart3 size={16} /> },
        { name: "Lead Reports", id: "reports-leads", icon: <TrendingUp size={16} /> }
      ]
    },
    {
      title: "Configurations",
      links: [
        { name: "General Settings", id: "settings-general", icon: <Settings size={16} /> }
      ]
    }
  ];

  // Fetch all DB states on load
  const loadDatabase = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const types = [
        "client", "call", "lead", "project", "our-projects", "quotation", 
        "feature", "innovation", "invoice", "payment", 
        "expense", "user", "employee", "team"
      ];
      
      const responses = await Promise.all(
        types.map(t => fetch(`${API_URL}/crm/${t}`).then(res => {
          if (!res.ok) throw new Error("Database Sync Failed");
          return res.json();
        }))
      );
      
      responses.forEach((res, index) => {
        if (res.success) {
          const payload = res.data || [];

          switch (types[index]) {
            case "client": setClients(payload); break;
            case "call": setCalls(payload); break;
            case "lead": setLeads(payload); break;
            case "project": setProjects(payload); break;
            case "our-projects": {
              const list = [...payload];
              if (!list.some((p: any) => p.name === "Build Your Thoughts" || p.id === "OPRJ-7001")) {
                list.unshift({
                  id: "OPRJ-7001",
                  name: "Build Your Thoughts",
                  title: "Build Your Thoughts",
                  category: "AI Web Application",
                  clientName: "Build Your Thoughts / Speshway",
                  budget: 45000,
                  status: "Live Production",
                  liveUrl: "https://buildyourthoughts.com",
                  description: "Full-stack AI thought workspace & content generation engine built with Vite, React, Node.js, and TailwindCSS."
                });
              }
              setOurProjects(list);
              break;
            }
            case "quotation": setQuotations(payload); break;
            case "feature": setFeatures(payload); break;
            case "innovation": setInnovations(payload); break;
            case "invoice": setInvoices(payload); break;
            case "payment": setPayments(payload); break;
            case "expense": setExpenses(payload); break;
            case "user": setUsers(payload); break;
            case "employee": setEmployees(payload); break;
            case "team": setTeams(payload); break;
          }
        } else {
          throw new Error("Payload response success is false");
        }
      });
    } catch (e) {
      console.error("Failed to load records from Live DB:", e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      window.location.href = "/auth/login";
      return;
    }
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.role !== "admin") {
        window.location.href = "/customer/dashboard";
        return;
      }
    } catch {
      window.location.href = "/auth/login";
      return;
    }
    loadDatabase();
  }, []);

  const recentActivities = invoices.length > 0 || clients.length > 0 ? [
    ...invoices.map(inv => ({ action: "Invoice Created", detail: `Generated Invoice ${inv.id} for ${inv.clientName}`, time: "Recently", type: "billing" })),
    ...clients.map(c => ({ action: "Client Profile Added", detail: `Registered Client Profile for ${c.company || c.name}`, time: "Recently", type: "success" }))
  ] : [];

  const pipelineStages = [
    { name: "Prospecting", count: leads.filter(l => l.status === "New" || l.status === "Contacted").length, percentage: `${leads.length ? Math.round((leads.filter(l => l.status === "New" || l.status === "Contacted").length / leads.length) * 100) : 0}%`, color: "bg-[#EE4047]" },
    { name: "Proposal Stage", count: leads.filter(l => l.status === "Proposal sent").length, percentage: `${leads.length ? Math.round((leads.filter(l => l.status === "Proposal sent").length / leads.length) * 100) : 0}%`, color: "bg-[#FF9F0A]" },
    { name: "Negotiation", count: leads.filter(l => l.status === "Negotiation").length, percentage: `${leads.length ? Math.round((leads.filter(l => l.status === "Negotiation").length / leads.length) * 100) : 0}%`, color: "bg-orange-600" },
    { name: "Closed Won", count: leads.filter(l => l.status === "Won").length, percentage: `${leads.length ? Math.round((leads.filter(l => l.status === "Won").length / leads.length) * 100) : 0}%`, color: "bg-[#27C15A]" }
  ];

  // ==========================================
  // MODALS & INPUT CONTROL STATES
  // ==========================================

  const [showClientModal, setShowClientModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showInnovationModal, setShowInnovationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const [activeClientDetail, setActiveClientDetail] = useState<Client | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState("overview");

  // Forms dynamic value inputs
  const [clientForm, setClientForm] = useState({
    name: "", company: "", email: "", phone: "", whatsapp: "", address: "", industry: "Retail", notes: ""
  });
  const [callForm, setCallForm] = useState({
    clientId: "", calledBy: "Nisha Rao", type: "Incoming", status: "Connected", purpose: "", notes: "", nextAction: ""
  });
  const [leadForm, setLeadForm] = useState({
    name: "", companyName: "", email: "", phone: "", whatsapp: "", source: "Website", interestedService: "", expectedBudget: 0, priority: "Medium", notes: ""
  });
  const [projectForm, setProjectForm] = useState({
    name: "", clientName: "", category: "", manager: "Nisha Rao", budget: 0, priority: "Medium", description: ""
  });
  const [quoteForm, setQuoteForm] = useState({
    clientName: "", projectName: "", title: "", itemsInput: "", discount: 0, tax: 18, validUntil: "", terms: ""
  });
  const [quoteItems, setQuoteItems] = useState<{ description: string; qty: number; rate: number }[]>([
    { description: "Vite React Animated UI & Shadcn Component Suite", qty: 1, rate: 20000 },
    { description: "Node.js Backend & Content API Server Integration", qty: 1, rate: 18000 },
    { description: "Production Deployment & Domain Binding", qty: 1, rate: 7000 }
  ]);

  const handleAddQuoteItemRow = () => {
    setQuoteItems(prev => [...prev, { description: "", qty: 1, rate: 1000 }]);
  };

  const handleRemoveQuoteItemRow = (index: number) => {
    setQuoteItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleQuoteItemChange = (index: number, field: string, value: any) => {
    setQuoteItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateItemsSubtotal = () => {
    return quoteItems.reduce((sum, item) => sum + ((item.qty || 1) * (item.rate || 0)), 0);
  };
  const [featureForm, setFeatureForm] = useState({
    projectId: "", title: "", moduleName: "", description: "", priority: "Medium", assignedDeveloper: "Karan (Developer)", estimatedHours: 40
  });
  const [innovationForm, setInnovationForm] = useState({
    projectId: "", title: "", proposedBy: "Sophia (Testing)", description: "", businessBenefit: "", technicalBenefit: "", estimatedCost: 1000
  });
  const [invoiceForm, setInvoiceForm] = useState({ clientName: "", amount: 0, dueDate: "" });
  const [paymentForm, setPaymentForm] = useState({ clientName: "", amount: 0, gateway: "Stripe" });
  const [expenseForm, setExpenseForm] = useState({ title: "", value: 0, category: "Infrastructure" });
  const [employeeForm, setEmployeeForm] = useState({ name: "", role: "", dept: "Corporate CRM" });
  const [teamForm, setTeamForm] = useState({ name: "", lead: "", members: "" });

  // ==========================================
  // CRUD OPERATIONS & HANDLERS (LIVE DB FETCH)
  // ==========================================

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
      name: clientForm.name,
      company: clientForm.company,
      email: clientForm.email,
      phone: clientForm.phone,
      whatsapp: clientForm.whatsapp || clientForm.phone,
      address: clientForm.address,
      industry: clientForm.industry,
      type: "Potential",
      assignedEmployee: "Nisha Rao (Sales Lead)",
      status: "Active",
      notes: clientForm.notes,
      createdDate: new Date().toISOString().split("T")[0]
    };

    try {
      const res = await fetch(`${API_URL}/crm/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
      }).then(r => r.json());

      if (res.success) {
        setClients(prev => [...prev, res.data]);
        await loadDatabase();
      }
    } catch (err) {
      console.error(err);
    }

    setShowClientModal(false);
    setClientForm({ name: "", company: "", email: "", phone: "", whatsapp: "", address: "", industry: "Retail", notes: "" });
  };

  const handleDeactivateClient = async (id: string) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const newStatus = client.status === "Active" ? "Inactive" : "Active";

    try {
      const res = await fetch(`${API_URL}/crm/client/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      }).then(r => r.json());

      if (res.success) {
        setClients(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (activeClientDetail?.id === id) {
          setActiveClientDetail(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === callForm.clientId) || clients[0];
    if (!client) return;

    const newCall: Call = {
      id: `CAL-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: callForm.clientId,
      clientName: client.name,
      phoneNumber: client.phone,
      calledBy: callForm.calledBy,
      type: callForm.type as any,
      date: new Date().toISOString().split("T")[0],
      startTime: "12:00 PM",
      endTime: "12:15 PM",
      duration: "15 mins",
      status: callForm.status as any,
      purpose: callForm.purpose,
      notes: callForm.notes,
      followUpDate: new Date(Date.now() + 5*24*60*60*1000).toISOString().split("T")[0],
      nextAction: callForm.nextAction
    };

    try {
      const res = await fetch(`${API_URL}/crm/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCall)
      }).then(r => r.json());

      if (res.success) {
        setCalls(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowCallModal(false);
    setCallForm({ clientId: "", calledBy: "Nisha Rao", type: "Incoming", status: "Connected", purpose: "", notes: "", nextAction: "" });
  };

  const handleDeleteCall = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/crm/call/${id}`, {
        method: "DELETE"
      }).then(r => r.json());

      if (res.success) {
        setCalls(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `LEA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: leadForm.name,
      companyName: leadForm.companyName,
      email: leadForm.email,
      phone: leadForm.phone,
      whatsapp: leadForm.whatsapp || leadForm.phone,
      source: leadForm.source as any,
      interestedService: leadForm.interestedService,
      expectedBudget: Number(leadForm.expectedBudget),
      assignedEmployee: "Nisha Rao",
      priority: leadForm.priority as any,
      leadScore: 50,
      nextFollowUpDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split("T")[0],
      notes: leadForm.notes,
      status: "New",
      createdDate: new Date().toISOString().split("T")[0]
    };

    try {
      const res = await fetch(`${API_URL}/crm/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      }).then(r => r.json());

      if (res.success) {
        setLeads(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowLeadModal(false);
    setLeadForm({ name: "", companyName: "", email: "", phone: "", whatsapp: "", source: "Website", interestedService: "", expectedBudget: 0, priority: "Medium", notes: "" });
  };

  const handleConvertLead = async (lead: Lead) => {
    const newClient: Client = {
      id: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
      name: lead.name,
      company: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      address: "Converted Lead Info Record",
      industry: "Technology",
      type: "Existing",
      assignedEmployee: lead.assignedEmployee + " (Sales)",
      status: "Active",
      notes: `Converted from Lead ID ${lead.id}. Prior notes: ${lead.notes}`,
      createdDate: new Date().toISOString().split("T")[0]
    };

    const newProject: Project = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${lead.interestedService || "Custom Enterprise Integration"}`,
      clientName: lead.companyName,
      category: "Development",
      manager: lead.assignedEmployee,
      teamMembers: ["Karan (Developer)"],
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletionDate: new Date(Date.now() + 60*24*60*60*1000).toISOString().split("T")[0],
      budget: lead.expectedBudget,
      priority: lead.priority,
      description: `Auto-generated Project conversion for customer lead: ${lead.name}`,
      progress: 10,
      status: "Planning"
    };

    try {
      const resClient = await fetch(`${API_URL}/crm/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
      }).then(r => r.json());

      const resProj = await fetch(`${API_URL}/crm/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      }).then(r => r.json());

      const resLead = await fetch(`${API_URL}/crm/lead/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Won" })
      }).then(r => r.json());

      if (resClient.success && resProj.success && resLead.success) {
        setClients(prev => [...prev, resClient.data]);
        setProjects(prev => [...prev, resProj.data]);
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "Won" } : l));
      }
    } catch (err) {
      console.error("Lead conversion failed:", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: any = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: projectForm.name,
      title: projectForm.name,
      clientName: projectForm.clientName,
      category: projectForm.category,
      manager: projectForm.manager,
      teamMembers: ["Karan (Developer)"],
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletionDate: new Date(Date.now() + 45*24*60*60*1000).toISOString().split("T")[0],
      budget: Number(projectForm.budget),
      priority: projectForm.priority as any,
      description: projectForm.description,
      progress: 0,
      status: "Planning"
    };

    try {
      const res = await fetch(`${API_URL}/crm/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj)
      }).then(r => r.json());

      if (res.success) {
        setProjects(prev => [...prev, res.data]);
        await loadDatabase();
      } else {
        alert(res.message || "Failed to save project to database.");
      }
    } catch (err) {
      console.error("[Create Project Error]", err);
      alert("Error saving project to database.");
    }

    setShowProjectModal(false);
    setProjectForm({ name: "", clientName: "", category: "Custom Development", manager: "Devon Miller", budget: 0, priority: "Medium", description: "" });
  };

  const handleCreateOurProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOurProj: any = {
      id: `OPRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: ourProjectForm.name,
      title: ourProjectForm.name,
      clientName: ourProjectForm.clientName || "Internal Enterprise",
      category: ourProjectForm.category || "Web Application",
      budget: Number(ourProjectForm.budget || 0),
      status: "Live Production",
      liveUrl: ourProjectForm.liveUrl || "",
      description: ourProjectForm.description || ""
    };

    try {
      const res = await fetch(`${API_URL}/crm/our-projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOurProj)
      }).then(r => r.json());

      if (res.success) {
        setOurProjects(prev => [res.data, ...prev]);
        await loadDatabase();
      } else {
        setOurProjects(prev => [newOurProj, ...prev]);
      }
    } catch (err) {
      console.error("[Create Our Project Error]", err);
      setOurProjects(prev => [newOurProj, ...prev]);
    }

    setShowOurProjectModal(false);
    setOurProjectForm({ name: "", category: "Web Application", clientName: "Internal / Showcase", budget: 0, liveUrl: "", description: "" });
  };

  const handleDeleteOurProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this company project from the database?")) return;
    try {
      await fetch(`${API_URL}/crm/our-projects/${id}`, { method: "DELETE" });
      setOurProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("[Delete Our Project Error]", err);
      setOurProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateProjectStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`${API_URL}/crm/project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status })
      }).then(r => r.json());

      if (res.success) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        if (activeProjectDetail?.id === id) {
          setActiveProjectDetail(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditQuote = (q: any) => {
    setEditingQuote(q);
    setQuoteForm({
      clientName: q.clientName || "",
      projectName: q.projectName || "",
      title: q.title || "",
      itemsInput: "",
      currency: q.currency || "Indian Rupees (INR)",
      planAPrice: q.planAPrice || 60000,
      planBPrice: q.planBPrice || 110000,
      discount: q.discount || 0,
      tax: q.tax || 18,
      validUntil: q.validUntil || "",
      terms: q.terms || "",
      overviewNarrative: q.overviewNarrative || "",
      customerDesc: q.customerDesc || "",
      merchantDesc: q.merchantDesc || "",
      adminDesc: q.adminDesc || "",
      paymentTerms: q.paymentTerms || "",
      termsAndConditions: q.termsAndConditions || q.terms || ""
    } as any);
    const cleanedCompItems = getCleanPlanComparisonItems(q.planComparisonItems || []);
    setQuotePlanComparisonItems(cleanedCompItems);
    setShowQuoteModal(true);
  };

  const handleDeleteQuote = async (idOrNumber: string) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;
    try {
      await fetch(`${API_URL}/crm/quotation/${idOrNumber}`, { method: "DELETE" });
      setQuotations(prev => prev.filter(q => q.id !== idOrNumber && (q as any).number !== idOrNumber));
    } catch (err) {
      console.error("[Delete Quotation Error]", err);
    }
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCompItems = getCleanPlanComparisonItems(quotePlanComparisonItems);

    const quoteId = editingQuote ? (editingQuote.id || editingQuote.number) : `QT-${Date.now().toString().slice(-4)}`;
    const quoteData: any = {
      id: quoteId,
      number: quoteId,
      projectId: activeProjectDetail?.id,
      clientName: quoteForm.clientName || activeProjectDetail?.clientName || "Client Profile",
      projectName: quoteForm.projectName || activeProjectDetail?.name || activeProjectDetail?.title || "General Service Contract",
      title: quoteForm.title,
      currency: (quoteForm as any).currency || "Indian Rupees (INR)",
      planAPrice: Number((quoteForm as any).planAPrice || 60000),
      planBPrice: Number((quoteForm as any).planBPrice || 110000),
      planComparisonItems: cleanCompItems,
      discount: Number(quoteForm.discount),
      tax: Number(quoteForm.tax),
      validUntil: quoteForm.validUntil || new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0],
      terms: (quoteForm as any).termsAndConditions || quoteForm.terms || "",
      notes: "Invoice terms active upon signature.",
      createdBy: "Admin Operator",
      createdDate: editingQuote?.createdDate || new Date().toISOString().split("T")[0],
      status: editingQuote ? editingQuote.status : "Approved",
      overviewNarrative: (quoteForm as any).overviewNarrative || "",
      customerDesc: (quoteForm as any).customerDesc || "",
      merchantDesc: (quoteForm as any).merchantDesc || "",
      adminDesc: (quoteForm as any).adminDesc || "",
      paymentTerms: (quoteForm as any).paymentTerms || "",
      termsAndConditions: (quoteForm as any).termsAndConditions || quoteForm.terms || ""
    };

    try {
      if (editingQuote) {
        const qId = editingQuote.id || editingQuote.number;
        const res = await fetch(`${API_URL}/crm/quotation/${qId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteData)
        }).then(r => r.json());

        const updated = res.data || quoteData;
        setQuotations(prev => prev.map(q => (q.id === qId || (q as any).number === qId) ? updated : q));
      } else {
        const res = await fetch(`${API_URL}/crm/quotation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteData)
        }).then(r => r.json());

        if (res.success) {
          setQuotations(prev => [res.data, ...prev]);
        } else {
          setQuotations(prev => [quoteData, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      if (!editingQuote) setQuotations(prev => [quoteData, ...prev]);
    }

    setShowQuoteModal(false);
    setEditingQuote(null);
    setQuoteForm({ clientName: "", projectName: "", title: "", itemsInput: "", discount: 0, tax: 18, validUntil: "", terms: "" });
  };

  const handleApproveQuotation = async (number: string) => {
    try {
      const res = await fetch(`${API_URL}/crm/quotation/${number}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" })
      }).then(r => r.json());

      if (res.success) {
        setQuotations(prev => prev.map(q => q.number === number ? { ...q, status: "Approved" } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFeature = (feat: any) => {
    setEditingFeature(feat);
    setFeatureForm({
      projectId: feat.projectId || "",
      title: feat.title || "",
      moduleName: feat.moduleName || "Core Feature",
      description: feat.description || "",
      priority: feat.priority || "High",
      assignedDeveloper: feat.assignedDeveloper || "Development Team",
      estimatedHours: feat.estimatedHours || 40
    });
    setShowFeatureModal(true);
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
    try {
      await fetch(`${API_URL}/crm/feature/${featureId}`, { method: "DELETE" });
      setFeatures(prev => prev.filter(f => f.id !== featureId));
    } catch (err) {
      console.error("[Delete Feature Error]", err);
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    const projId = featureForm.projectId || activeProjectDetail?.id || "OPRJ-7001";
    const projName = activeProjectDetail?.name || activeProjectDetail?.title || "Build Your Thoughts";

    const featData: any = {
      id: editingFeature ? editingFeature.id : `FEAT-${Math.floor(100 + Math.random() * 899)}`,
      projectId: projId,
      projectName: projName,
      title: featureForm.title,
      moduleName: featureForm.moduleName || "Core Feature",
      description: featureForm.description || `Feature requirement: ${featureForm.title}`,
      requirementType: "Functional",
      priority: featureForm.priority || "High",
      assignedDeveloper: featureForm.assignedDeveloper || "Development Team",
      startDate: editingFeature?.startDate || new Date().toISOString().split("T")[0],
      dueDate: editingFeature?.dueDate || new Date(Date.now() + 14*24*60*60*1000).toISOString().split("T")[0],
      estimatedHours: featureForm.estimatedHours || 40,
      progress: editingFeature ? editingFeature.progress : 100,
      status: editingFeature ? editingFeature.status : "Completed",
      clientApproval: true,
      notes: ""
    };

    try {
      if (editingFeature) {
        const res = await fetch(`${API_URL}/crm/feature/${editingFeature.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(featData)
        }).then(r => r.json());

        const updated = res.data || featData;
        setFeatures(prev => prev.map(f => f.id === editingFeature.id ? updated : f));
      } else {
        const res = await fetch(`${API_URL}/crm/feature`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(featData)
        }).then(r => r.json());

        if (res.success) {
          setFeatures(prev => [...prev, res.data]);
        } else {
          setFeatures(prev => [...prev, featData]);
        }
      }
    } catch (err) {
      console.error(err);
      if (!editingFeature) setFeatures(prev => [...prev, featData]);
    }

    setShowFeatureModal(false);
    setEditingFeature(null);
    setFeatureForm({ projectId: "", title: "", moduleName: "", description: "", priority: "High", assignedDeveloper: "Development Team", estimatedHours: 40 });
  };

  const handleCreateInnovation = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === innovationForm.projectId) || projects[0];
    if (!project) return;

    const newInn: Innovation = {
      id: `INN-${Math.floor(100 + Math.random() * 899)}`,
      title: innovationForm.title,
      projectId: innovationForm.projectId,
      projectName: project.name,
      proposedBy: innovationForm.proposedBy,
      description: innovationForm.description,
      businessBenefit: innovationForm.businessBenefit,
      technicalBenefit: innovationForm.technicalBenefit,
      estimatedCost: Number(innovationForm.estimatedCost),
      estimatedDevTime: "2 weeks",
      priority: "Medium",
      approvalStatus: "Proposed",
      implementationStatus: "Not started",
      clientFeedback: "",
      adminNotes: ""
    };

    try {
      const res = await fetch(`${API_URL}/crm/innovation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInn)
      }).then(r => r.json());

      if (res.success) {
        setInnovations(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowInnovationModal(false);
    setInnovationForm({ projectId: "", title: "", proposedBy: "Sophia (Testing)", description: "", businessBenefit: "", technicalBenefit: "", estimatedCost: 1000 });
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: invoiceForm.clientName,
      amount: Number(invoiceForm.amount),
      dueDate: invoiceForm.dueDate || new Date(Date.now() + 15*24*60*60*1000).toISOString().split("T")[0],
      status: "Unpaid"
    };

    try {
      const res = await fetch(`${API_URL}/crm/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInv)
      }).then(r => r.json());

      if (res.success) {
        setInvoices(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowInvoiceModal(false);
    setInvoiceForm({ clientName: "", amount: 0, dueDate: "" });
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPay = {
      id: `TXN-${Math.floor(10000 + Math.random() * 89999)}`,
      clientName: paymentForm.clientName,
      amount: Number(paymentForm.amount),
      gateway: paymentForm.gateway,
      date: new Date().toISOString().split("T")[0]
    };

    try {
      const res = await fetch(`${API_URL}/crm/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPay)
      }).then(r => r.json());

      if (res.success) {
        setPayments(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowPaymentModal(false);
    setPaymentForm({ clientName: "", amount: 0, gateway: "Stripe" });
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExp = {
      id: `EXP-${Math.floor(100 + Math.random() * 899)}`,
      title: expenseForm.title,
      value: Number(expenseForm.value),
      category: expenseForm.category,
      date: new Date().toISOString().split("T")[0]
    };

    try {
      const res = await fetch(`${API_URL}/crm/expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp)
      }).then(r => r.json());

      if (res.success) {
        setExpenses(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowExpenseModal(false);
    setExpenseForm({ title: "", value: 0, category: "Infrastructure" });
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp = {
      id: `EMP-${Math.floor(10 + Math.random() * 89)}`,
      name: employeeForm.name,
      role: employeeForm.role,
      dept: employeeForm.dept,
      status: "Active"
    };

    try {
      const res = await fetch(`${API_URL}/crm/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp)
      }).then(r => r.json());

      if (res.success) {
        setEmployees(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowEmployeeModal(false);
    setEmployeeForm({ name: "", role: "", dept: "Corporate CRM" });
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTeam = {
      id: `TEAM-${Math.floor(10 + Math.random() * 89)}`,
      name: teamForm.name,
      lead: teamForm.lead,
      members: teamForm.members,
      activeProjects: 1
    };

    try {
      const res = await fetch(`${API_URL}/crm/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam)
      }).then(r => r.json());

      if (res.success) {
        setTeams(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowTeamModal(false);
    setTeamForm({ name: "", lead: "", members: "" });
  };

  const handleDeleteUser = async (userKey: string) => {
    if (userKey === "admin@crm.com") {
      alert("Primary Seeded Admin account cannot be deleted.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user account '${userKey}'?`)) return;

    try {
      const response = await fetch(`${API_URL}/crm/user/${encodeURIComponent(userKey)}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(prev => prev.filter(u => u.email !== userKey && u.id !== userKey));
      } else {
        alert(data.message || "Failed to delete user account.");
      }
    } catch (err) {
      console.error("[Delete User Error]", err);
      alert("Error deleting user account from database.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm(`Are you sure you want to delete client record '${id}'?`)) return;

    try {
      const res = await fetch(`${API_URL}/crm/client/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).then(r => r.json());

      if (res.success) {
        setClients(prev => prev.filter(c => c.id !== id));
        await loadDatabase();
      } else {
        alert(res.message || "Failed to delete client record.");
      }
    } catch (err) {
      console.error("[Delete Client Error]", err);
      alert("Error deleting client record from database.");
    }
  };

  const calculateQuoteFinal = (quote: Quotation) => {
    const subtotal = quote.serviceItems.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
    const discVal = subtotal * (quote.discount / 100);
    const taxVal = (subtotal - discVal) * (quote.tax / 100);
    return Math.floor(subtotal - discVal + taxVal);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm(`Are you sure you want to delete project record '${id}'?`)) return;

    try {
      const res = await fetch(`${API_URL}/crm/project/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).then(r => r.json());

      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        await loadDatabase();
      } else {
        alert(res.message || "Failed to delete project record.");
      }
    } catch (err) {
      console.error("[Delete Project Error]", err);
      alert("Error deleting project record from database.");
    }
  };


  const handleDeleteLead = async (id: string) => {
    if (!confirm(`Are you sure you want to delete lead record '${id}'?`)) return;

    try {
      const res = await fetch(`${API_URL}/crm/lead/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).then(r => r.json());

      if (res.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllDemoData = async () => {
    if (!confirm("Are you sure you want to permanently clear all records from MongoDB database to start completely clean?")) return;

    try {
      const res = await fetch(`${API_URL}/crm/clear-database`, {
        method: "DELETE",
      }).then(r => r.json());

      if (res.success) {
        alert("All database records cleared successfully!");
        loadDatabase();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to clear database.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 1. Render Error state if Node.js server cannot be synced
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <GlassCard className="p-10 flex flex-col items-center gap-4 bg-white/70 shadow-elevated border border-red-500/10 text-center max-w-sm">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <span className="font-heading font-extrabold text-[#1a0f00] text-sm tracking-wide">Database Sync Failed</span>
          <p className="text-xs text-gray-500 leading-relaxed">Could not establish connection to the Node.js API server ({API_URL}). Please ensure the backend is active and running.</p>
          <Button onClick={() => loadDatabase()} variant="primary" className="mt-2 w-full text-xs font-semibold">
            Retry Connection
          </Button>
        </GlassCard>
      </div>
    );
  }

  // 2. Render Premium Loader when calling Live DB
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <GlassCard className="p-10 flex flex-col items-center gap-4 bg-white/70 shadow-elevated border border-orange-500/10">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <span className="font-heading font-extrabold text-[#1a0f00] text-sm tracking-wide">Syncing MongoDB Cluster...</span>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1">Connecting Live Node.js APIs</p>
        </GlassCard>
      </div>
    );
  }

  // Derived state for active project detail modal
  const activeQuoteForDetail = activeProjectDetail ? (
    quotations.find(q => 
      q.projectId === activeProjectDetail.id || 
      q.projectName === activeProjectDetail.name || 
      (q.title && activeProjectDetail.name && q.title.toLowerCase().includes(activeProjectDetail.name.toLowerCase())) ||
      q.clientName === activeProjectDetail.clientName
    ) || {
      id: `QT-${activeProjectDetail.id || "0001"}`,
      number: `QT-${activeProjectDetail.id || "0001"}`,
      projectId: activeProjectDetail.id,
      title: `${activeProjectDetail.name || activeProjectDetail.title} Custom Estimation Proposal`,
      clientName: activeProjectDetail.clientName || "Enterprise Client",
      projectName: activeProjectDetail.name || activeProjectDetail.title,
      planAPrice: 60000,
      planBPrice: 110000,
      currency: "Indian Rupees (INR)",
      planComparisonItems: defaultPlanComparisonDeliverables,
      overviewNarrative: activeProjectDetail.description || "",
      customerDesc: "Customer portal & cart checkout.",
      merchantDesc: "Merchant portal & booking management.",
      adminDesc: "Admin panel & ecosystem governance.",
      paymentTerms: "40% advance on project kick-off\n30% on completion of core module\n30% on final delivery",
      termsAndConditions: "Estimation valid for 30 days.\nIncludes 30 days complimentary bug-fix support.\nSource code handed over upon full payment.",
      status: "Approved"
    }
  ) : null;

  const activeCompItems = activeQuoteForDetail ? getCleanPlanComparisonItems(activeQuoteForDetail.planComparisonItems) : [];
  const activeQuote = activeQuoteForDetail;

  // Derived state for reviewing quote modal
  const reviewCompItems = reviewingQuote ? getCleanPlanComparisonItems(reviewingQuote.planComparisonItems || defaultPlanComparisonDeliverables) : [];
  const reviewFeatures = reviewingQuote ? features.filter(f => 
    f.projectId === reviewingQuote.projectId || 
    f.projectId === activeProjectDetail?.id || 
    f.projectName === reviewingQuote.projectName || 
    f.projectName === activeProjectDetail?.name
  ) : [];
  const reviewPdfHtmlContent = reviewingQuote ? generateSpeshwayEstimationPdfHtml(activeProjectDetail, reviewingQuote, reviewFeatures) : "";
  const pdfHtmlContent = reviewPdfHtmlContent;

  // 3. Render Main CRM Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
          {/* 1. BRAND SIDEBAR CONTAINER */}
          <aside className="w-full md:w-64 bg-white text-gray-700 flex flex-col justify-between shrink-0 p-6 shadow-sm border-r border-gray-200">
        <div className="flex flex-col gap-6">
          
          {/* Brand Logo and icon */}
          <div className="flex items-center gap-2 group border-b border-gray-150 pb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo-icon.svg" alt="CRM Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-extrabold text-base text-[#1a0f00] tracking-tight">
              CRM Admin Panel
            </span>
          </div>

          {/* Hierarchical Sidebar Lists */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-1">
            {sidebarCategories.map((category) => (
              <div key={category.title} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-3">
                  {category.title}
                </span>
                <nav className="flex flex-col gap-0.5">
                  {category.links.map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          setActiveTab(link.id);
                          setActiveClientDetail(null);
                          setActiveProjectDetail(null);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-orange-600 text-white shadow-md shadow-orange-500/10"
                            : "text-gray-600 hover:text-[#1a0f00] hover:bg-gray-100"
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info logout */}
        <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-150">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-[#1a0f00] leading-none">Admin Operator</div>
              <div className="text-[9px] text-gray-400 mt-1">Super Admin Account</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Log Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <input 
          type="file" 
          ref={quoteFileInputRef} 
          accept=".txt,.json,.csv,.doc,.docx,.pdf" 
          onChange={handleQuoteFileUpload} 
          className="hidden" 
        />
        {reviewingQuote ? (
          <QuoteReviewModal
            reviewingQuote={reviewingQuote}
            setReviewingQuote={setReviewingQuote}
            reviewMode={reviewMode}
            setReviewMode={setReviewMode}
            reviewerNotes={reviewerNotes}
            setReviewerNotes={setReviewerNotes}
            features={features}
            activeProjectDetail={activeProjectDetail}
            getCleanPlanComparisonItems={getCleanPlanComparisonItems}
            defaultPlanComparisonDeliverables={defaultPlanComparisonDeliverables}
            generateSpeshwayEstimationPdfHtml={generateSpeshwayEstimationPdfHtml}
            triggerDirectPdfDownload={triggerDirectPdfDownload}
            handleSaveQuotationSection={handleSaveQuotationSection}
            handleApproveQuotation={handleApproveQuotation}
          />
        ) : activeProjectDetail ? (
          <ProjectDetailModal
            activeProjectDetail={activeProjectDetail}
            setActiveProjectDetail={setActiveProjectDetail}
            activeProjectTab={activeProjectTab}
            setActiveProjectTab={setActiveProjectTab}
            quotations={quotations}
            setQuotations={setQuotations}
            features={features}
            setFeatures={setFeatures}
            setReviewingQuote={setReviewingQuote}
            API_URL={API_URL}
            loadDatabase={loadDatabase}
            defaultPlanComparisonDeliverables={defaultPlanComparisonDeliverables}
            getCleanPlanComparisonItems={getCleanPlanComparisonItems}
            generateSpeshwayEstimationPdfHtml={generateSpeshwayEstimationPdfHtml}
            triggerDirectPdfDownload={triggerDirectPdfDownload}
            universalSectionFileInputRef={universalSectionFileInputRef}
            activeSectionToUpload={activeSectionToUpload}
            setActiveSectionToUpload={setActiveSectionToUpload}
            handleUniversalSectionFileUpload={handleUniversalSectionFileUpload}
            handleSaveQuotationSection={handleSaveQuotationSection}
          />
        ) : (
          <>
            <HMSPresetSelectionModal
              isOpen={Boolean(presetSelectionProject)}
              onClose={() => setPresetSelectionProject(null)}
              project={presetSelectionProject}
              onSelectPreset={handleSelectPresetFromModal}
            />
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-[#1a0f00] capitalize">
              {activeTab.replace("-", " ")} Workspace
            </h1>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide mt-1 uppercase">Logged User Level: Security Super Admin Session</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Global Search records..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-xs text-[#1a0f00] focus:outline-none focus:border-orange-500"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Tab: Overview (Hub Dashboard) */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Clients</span>
                <span className="text-xl font-extrabold text-[#1a0f00]">{clients.length} Profiles</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Leads</span>
                <span className="text-xl font-extrabold text-[#1a0f00]">{leads.length} Records</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Projects</span>
                <span className="text-xl font-extrabold text-[#1a0f00]">{projects.filter(p => p.status === "In progress").length} Workloads</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quotations Sent</span>
                <span className="text-xl font-extrabold text-[#1a0f00]">{quotations.length} Proposals</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <GlassCard className="lg:col-span-2 p-5 bg-white/50 border border-gray-200 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-sm text-[#1a0f00]">Active Deal pipeline</h3>
                <div className="flex flex-col gap-3">
                  {pipelineStages.map((stage, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">{stage.name}</span>
                        <span>{stage.count} Deals ({stage.percentage})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className={`h-full rounded-full ${stage.color}`} style={{ width: stage.percentage }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-5 bg-white/50 border border-gray-200 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-sm text-[#1a0f00]">System Activity Logs</h3>
                <div className="flex flex-col gap-3">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 border-b border-gray-150 pb-2.5 last:border-b-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        act.type === "success" ? "bg-green-500" :
                        act.type === "support" ? "bg-amber-500" :
                        act.type === "billing" ? "bg-orange-600" : "bg-orange-500"
                      }`}></div>
                      <div className="text-xs">
                        <span className="font-bold text-[#1a0f00]">{act.action}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{act.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Tab: Clients */}
        {activeTab === "clients" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Clients Database Directory</h2>
              <Button onClick={() => setShowClientModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Create Client Profile
              </Button>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Client ID</th>
                    <th className="p-3">Client Details</th>
                    <th className="p-3">WhatsApp / Phone</th>
                    <th className="p-3">Assigned Associate</th>
                    <th className="p-3">Industry</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {clients.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => router.push(`/admin/clients/${c.id}`)}
                      className="border-b border-gray-100 hover:bg-orange-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-orange-600 hover:underline">{c.id}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 hover:text-orange-600">{c.name}</div>
                        <span className="text-[10px] text-gray-500 font-medium">{c.company} &bull; {c.email}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">{c.whatsapp}</td>
                      <td className="p-3">{c.assignedEmployee}</td>
                      <td className="p-3">{c.industry}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          c.status === "Active" ? "bg-green-50 text-green-600" :
                          c.status === "Inactive" ? "bg-gray-100 text-gray-500" :
                          c.status === "Potential" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-600"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-1.5">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/clients/${c.id}`);
                          }} 
                          variant="secondary" 
                          size="sm" 
                          className="px-2 py-1 flex items-center border border-gray-200 hover:bg-orange-50 hover:text-orange-600" 
                          title="View Client Details (Full Screen)"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivateClient(c.id);
                          }} 
                          variant="ghost" 
                          size="sm" 
                          className="px-2 py-1 text-[#78350f] border border-orange-200 hover:bg-orange-50"
                          title="Toggle Status"
                        >
                          {c.status === "Active" ? <UserX size={12} /> : <UserCheck size={12} />}
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(c.id);
                          }} 
                          variant="outline" 
                          size="sm" 
                          className="px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
                          title="Delete Client"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeClientDetail && (
              <div className="fixed inset-0 z-50 flex justify-end bg-[#1a0f00]/40 backdrop-blur-sm">
                <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-orange-600 font-bold">{activeClientDetail.id} &bull; Profile Card</span>
                        <h3 className="font-heading font-extrabold text-[#1a0f00] text-lg mt-1">{activeClientDetail.company}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => router.push(`/admin/clients/${activeClientDetail.id}`)}
                          variant="primary"
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1 py-1.5 px-3 rounded-xl"
                        >
                          <Maximize2 size={12} className="text-orange-400" />
                          <span>Open Full Page</span>
                        </Button>
                        <button onClick={() => setActiveClientDetail(null)} className="text-gray-400 hover:text-[#1a0f00] text-lg font-bold">&times;</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Client Name</span>
                        <strong className="text-[#1a0f00]">{activeClientDetail.name}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Email Address</span>
                        <strong className="text-[#1a0f00]">{activeClientDetail.email}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">WhatsApp Number</span>
                        <strong className="text-[#1a0f00] font-mono">{activeClientDetail.whatsapp}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Industry Sector</span>
                        <strong className="text-[#1a0f00]">{activeClientDetail.industry}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Complete Address</span>
                        <strong className="text-[#1a0f00] font-sans leading-relaxed">{activeClientDetail.address}</strong>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-5 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-heading font-bold text-sm text-[#1a0f00] flex items-center gap-1.5">
                          <Phone size={14} className="text-orange-600" /> Calls Logs
                        </h4>
                        <Button 
                          onClick={() => {
                            setCallForm(prev => ({ ...prev, clientId: activeClientDetail.id }));
                            setShowCallModal(true);
                          }} 
                          variant="primary" 
                          size="sm" 
                          className="text-[10px] py-1"
                        >
                          Log Call
                        </Button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {calls.filter(c => c.clientId === activeClientDetail.id).length === 0 ? (
                          <div className="text-[11px] text-gray-400 text-center py-4 bg-gray-50 rounded-xl">No calls logged for this customer.</div>
                        ) : (
                          calls.filter(c => c.clientId === activeClientDetail.id).map(call => (
                            <div key={call.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  call.type === "Incoming" ? "bg-orange-100 text-orange-700" : "bg-navy-100 text-[#533000]"
                                }`}>
                                  {call.type}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">{call.date} &bull; {call.duration}</span>
                              </div>
                              <p className="text-gray-700 font-semibold leading-relaxed">Purpose: {call.purpose}</p>
                              <p className="text-gray-500 font-sans italic text-[11px]">Notes: "{call.notes}"</p>
                              <div className="text-[10px] text-orange-600 bg-blue-50/50 p-1.5 rounded font-mono">Next Action: {call.nextAction} (Follow-up: {call.followUpDate})</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <Button 
                      onClick={() => router.push(`/admin/clients/${activeClientDetail.id}`)} 
                      variant="primary" 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
                    >
                      <Maximize2 size={14} className="text-orange-400" />
                      <span>Open FULL PAGE CLIENT PROFILE (Full Screen Studio)</span>
                      <ChevronRight size={14} />
                    </Button>
                    <Button onClick={() => setActiveClientDetail(null)} variant="secondary" className="w-full">
                      Close Details View
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Client Calls */}
        {activeTab === "calls" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Call Logs & Outcomes</h2>
              <Button onClick={() => setShowCallModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Log Customer Call
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calls.map(call => (
                <div key={call.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-3 text-xs relative group">
                  <button 
                    onClick={() => handleDeleteCall(call.id)} 
                    className="absolute right-4 top-4 text-gray-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">{call.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      call.type === "Incoming" ? "bg-orange-100 text-orange-700" :
                      call.type === "Outgoing" ? "bg-navy-100 text-[#533000]" : "bg-amber-100 text-amber-600"
                    }`}>{call.type}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a0f00] text-sm mt-1">{call.clientName}</h4>
                    <span className="text-gray-400 font-mono text-[10px] mt-0.5 block">{call.phoneNumber} &bull; Call date: {call.date}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5 text-gray-600">
                    <p className="font-semibold text-[#1a0f00]">Call Purpose: {call.purpose}</p>
                    <p className="text-[11px] leading-relaxed italic text-gray-500">"{call.notes}"</p>
                    <div className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded mt-1 font-mono">Next: {call.nextAction} (Follow-up: {call.followUpDate})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Leads Log */}
        {activeTab === "leads" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Business Leads Ledger</h2>
              <Button onClick={() => setShowLeadModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Create New Lead
              </Button>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Lead ID</th>
                    <th className="p-3">Lead Details</th>
                    <th className="p-3">Service Interest</th>
                    <th className="p-3">Expected Budget</th>
                    <th className="p-3">Lead Source</th>
                    <th className="p-3">Lead Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-mono font-semibold text-orange-600">{lead.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#1a0f00]">{lead.name}</div>
                        <span className="text-[10px] text-gray-400">{lead.companyName} &bull; {lead.phone}</span>
                      </td>
                      <td className="p-3 font-semibold text-[#1a0f00]">{lead.interestedService}</td>
                      <td className="p-3 font-bold text-[#1a0f00]">${lead.expectedBudget.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          lead.status === "Won" ? "bg-green-50 text-green-600" :
                          lead.status === "New" ? "bg-orange-50 text-orange-700" :
                          lead.status === "Qualified" ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end items-center gap-2">
                        {lead.status !== "Won" ? (
                          <Button 
                            onClick={() => handleConvertLead(lead)} 
                            variant="primary" 
                            size="sm" 
                            className="text-[10px] py-1 inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            Convert <ArrowRight size={12} />
                          </Button>
                        ) : (
                          <span className="text-green-600 font-bold uppercase text-[10px] pr-2">Converted</span>
                        )}
                        <Button
                          onClick={() => handleDeleteLead(lead.id)}
                          variant="outline"
                          size="sm"
                          className="px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
                          title="Delete Lead"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Follow-ups */}
        {activeTab === "followups" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Follow-up Schedules</h2>
            <div className="flex flex-col gap-3">
              {leads.filter(l => l.status === "Follow-up" || l.status === "New").map(l => (
                <div key={l.id} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-orange-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#1a0f00]">{l.name} &bull; {l.companyName}</h4>
                      <span className="text-[10px] text-gray-500 mt-1 block">Expected Budget: **${l.expectedBudget.toLocaleString()}** &bull; Service: {l.interestedService}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Scheduled Date</span>
                    <span className="font-mono text-orange-600 font-bold">{l.nextFollowUpDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: All Projects */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Project Portfolio</h2>
              <Button onClick={() => setShowProjectModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Create Client Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 bg-white border border-dashed border-gray-200 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                <FolderOpen className="w-10 h-10 text-gray-300" />
                <h4 className="font-heading font-bold text-gray-700 text-sm">No Client Projects Found</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">There are no active or completed projects in the database. Click <strong>+ Create Client Project</strong> to add your first project.</p>
                <Button onClick={() => setShowProjectModal(true)} variant="primary" size="sm" className="mt-1 gap-1">
                  <Plus size={14} /> Create Client Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">{p.id}</span>
                        <h3 className="font-heading font-bold text-sm text-[#1a0f00] mt-1.5">{p.name || p.title}</h3>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Client: {p.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          p.status === "Completed" ? "bg-green-50 text-green-600" :
                          p.status === "Planning" ? "bg-orange-50 text-orange-700" : "bg-amber-50 text-amber-600"
                        }`}>
                          {p.status}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="text-gray-300 hover:text-red-600 transition-colors p-1"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <div className="flex justify-between font-semibold">
                        <span>Project Completion:</span>
                        <span className="text-[#1a0f00] font-bold">{p.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-orange-600" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1a0f00]">${(p.budget || 0).toLocaleString()}.00</span>
                      <Button onClick={() => { setActiveProjectDetail(p); setActiveProjectTab("overview"); }} variant="secondary" size="sm">
                        Details Tab Suite
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Proposal Presets Studio */}
        {activeTab === "proposal-presets" && (
          <HMSPresetStudioPage
            ourProjects={ourProjects}
            onApplyPresetToProject={(proj, presetData) => {
              handleSelectPresetFromModal(presetData.variantKey);
              setActiveProjectDetail(proj);
              setActiveProjectTab("all");
            }}
          />
        )}

        {/* Tab: Our Projects */}
        {activeTab === "our-projects" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-heading font-bold text-base text-[#1a0f00]">Company Showcase & Our Projects</h2>
                <span className="text-xs text-gray-400">Internal software products, portfolio systems, and production showcases.</span>
              </div>
              <Button onClick={() => setShowOurProjectModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Create Our Project
              </Button>
            </div>

            {ourProjects.length === 0 ? (
              <div className="p-12 bg-white border border-dashed border-gray-200 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                <Briefcase className="w-10 h-10 text-gray-300" />
                <h4 className="font-heading font-bold text-gray-700 text-sm">No Company Showcase Projects Found</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  There are no internal or showcase projects stored in the database. Click <strong>+ Create Our Project</strong> to add your first company project.
                </p>
                <Button onClick={() => setShowOurProjectModal(true)} variant="primary" size="sm" className="mt-1 gap-1">
                  <Plus size={14} /> Create Our Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ourProjects.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => router.push(`/admin/our-projects/${p.id}/proposals`)}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">{p.id}</span>
                          <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{p.category || "Web App"}</span>
                        </div>
                        <h3 className="font-heading font-bold text-sm text-[#1a0f00] mt-2 group-hover:text-orange-600 transition-colors">
                          {p.name || p.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Showcase Client: {p.clientName || "Internal Enterprise"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] bg-green-50 text-green-600">
                          {p.status || "Live Production"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOurProject(p.id);
                          }}
                          className="text-gray-300 hover:text-red-600 transition-colors p-1"
                          title="Delete Our Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed italic">{p.description || "No description provided."}</p>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs gap-2">
                      <span className="font-bold text-[#1a0f00]">${(p.budget || 0).toLocaleString()}.00</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/our-projects/${p.id}/proposals`);
                          }} 
                          variant="secondary" 
                          size="sm"
                          className="text-[10px] py-1 px-2.5 flex items-center gap-1"
                        >
                          <Layers size={12} className="text-orange-600" />
                          <span>Details Suite</span>
                        </Button>

                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/our-projects/${p.id}/proposals`);
                          }} 
                          variant="secondary" 
                          size="sm"
                          className="text-[10px] py-1 px-2.5 flex items-center gap-1"
                        >
                          <FileText size={12} className="text-orange-600" />
                          <span>Proposals CRUD</span>
                        </Button>

                        {p.liveUrl && (
                          <a 
                            href={p.liveUrl.startsWith("http") ? p.liveUrl : `https://${p.liveUrl}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="text-orange-600 hover:underline font-semibold text-[11px] flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg"
                          >
                            <span>Live Demo</span>
                            <ArrowRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Quotations */}
        {activeTab === "quotations" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="font-heading font-bold text-base text-[#1a0f00]">Quotations Ledger</h2>
                <p className="text-[10px] text-gray-400">Manage, create, and upload custom estimation files to generate tailored proposals.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  type="button"
                  onClick={() => quoteFileInputRef.current?.click()} 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5 border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold"
                >
                  <Upload size={14} className="text-purple-600" />
                  <span>Upload Quotation File</span>
                </Button>
                <Button onClick={() => { setEditingQuote(null); setShowQuoteModal(true); }} variant="primary" size="sm" className="gap-1">
                  <Plus size={14} /> Create Quotation
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {quotations.map(quote => {
                const totalVal = getQuoteFinalVal(quote);
                return (
                  <div key={quote.number} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold max-w-fit">{quote.number}</span>
                      <h4 className="font-heading font-bold text-sm text-[#1a0f00] mt-1.5">{quote.title}</h4>
                      <p className="text-gray-400 text-[10px] mt-0.5">Project: {quote.projectName} &bull; Client: {quote.clientName}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 uppercase block">Total Amount</span>
                        <strong className="text-[#1a0f00] text-sm font-heading">${totalVal.toLocaleString()}</strong>
                      </div>
                      {quote.status !== "Approved" ? (
                        <Button onClick={() => handleApproveQuotation(quote.number)} variant="primary" size="sm">
                          Approve
                        </Button>
                      ) : (
                        <span className="px-3 py-1 rounded bg-green-50 border border-green-200 text-green-600 font-bold uppercase text-[9px]">Approved</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Project Features */}
        {activeTab === "features" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Logged Features</h2>
              <Button onClick={() => setShowFeatureModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Add Project Feature
              </Button>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Feature ID</th>
                    <th className="p-3">Feature Detail</th>
                    <th className="p-3">Requirement Module</th>
                    <th className="p-3">Developer</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {features.map(f => (
                    <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-mono font-semibold text-orange-600">{f.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#1a0f00]">{f.title}</div>
                        <span className="text-[10px] text-gray-400">{f.projectName}</span>
                      </td>
                      <td className="p-3 font-semibold text-[#1a0f00]">{f.moduleName}</td>
                      <td className="p-3">{f.assignedDeveloper}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          f.priority === "Critical" ? "bg-red-100 text-red-600" :
                          f.priority === "High" ? "bg-amber-100 text-amber-600" : "bg-orange-100 text-orange-700"
                        }`}>{f.priority}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] bg-orange-50 text-orange-600">{f.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Innovations */}
        {activeTab === "innovations" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Advanced Solutions Proposed</h2>
              <Button onClick={() => setShowInnovationModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Propose Solution
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {innovations.map(inn => (
                <div key={inn.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-3 text-xs relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">{inn.id}</span>
                      <h4 className="font-heading font-bold text-sm text-[#1a0f00] mt-1">{inn.title}</h4>
                      <p className="text-gray-400 text-[10px] mt-0.5">Project: {inn.projectName} &bull; Proposed by: {inn.proposedBy}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] bg-orange-50 text-orange-600">{inn.approvalStatus}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex flex-col gap-1 text-gray-600">
                    <p className="font-medium text-gray-700">{inn.description}</p>
                    <p className="text-orange-600 mt-1 font-semibold">Business Benefit: {inn.businessBenefit}</p>
                    <p className="text-green-600 font-semibold">Technical Benefit: {inn.technicalBenefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Invoices */}
        {activeTab === "invoices" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Billing Invoices</h2>
              <Button onClick={() => setShowInvoiceModal(true)} variant="primary" className="text-xs px-3.5 py-2">
                + Generate Invoice
              </Button>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No invoices in database. Click + Generate Invoice to create one.</td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-semibold text-orange-600">{inv.id}</td>
                        <td className="p-3 font-bold text-[#1a0f00]">{inv.clientName}</td>
                        <td className="p-3">{inv.due || inv.dueDate}</td>
                        <td className="p-3 font-bold">${(inv.value || inv.amount || 0).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            inv.status === "Paid" || inv.status === "paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Payments Log */}
        {activeTab === "payments" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Receipt Payments Log</h2>
              <Button onClick={() => setShowPaymentModal(true)} variant="primary" className="text-xs px-3.5 py-2">
                + Log Payment
              </Button>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Txn ID</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Receipt Value</th>
                    <th className="p-3">Gateway</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No payment logs in database. Click + Log Payment to record one.</td>
                    </tr>
                  ) : (
                    payments.map(pay => (
                      <tr key={pay.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-semibold text-green-600">{pay.id}</td>
                        <td className="p-3 font-bold text-[#1a0f00]">{pay.clientName}</td>
                        <td className="p-3 font-bold">${pay.amount.toLocaleString()}</td>
                        <td className="p-3">{pay.gateway}</td>
                        <td className="p-3">{pay.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Expense Ledger */}
        {activeTab === "expenses" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Corporate Expenses</h2>
              <Button onClick={() => setShowExpenseModal(true)} variant="primary" className="text-xs px-3.5 py-2">
                + Add Expense
              </Button>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Exp ID</th>
                    <th className="p-3">Title Description</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No expenses recorded. Click + Add Expense to create one.</td>
                    </tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-semibold text-red-600">{exp.id}</td>
                        <td className="p-3 font-semibold text-[#1a0f00]">{exp.title}</td>
                        <td className="p-3 font-bold text-red-600">${exp.value}</td>
                        <td className="p-3">{exp.category}</td>
                        <td className="p-3">{exp.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Corporate Users */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">System Users & Accounts</h2>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">User</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role Authorization</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {users.map(u => (
                    <tr key={u.email || u.id} className="border-b border-gray-100 hover:bg-orange-50/20 transition-colors">
                      <td className="p-3 font-bold text-[#1a0f00]">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded font-bold text-[9px] uppercase">
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.email !== "admin@crm.com" && (
                          <button
                            onClick={() => handleDeleteUser(u.email || u.id)}
                            className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Delete User</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Employees Profile */}
        {activeTab === "employees" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Employee Roster</h2>
              <Button onClick={() => setShowEmployeeModal(true)} variant="primary" className="text-xs px-3.5 py-2">
                + Add Employee Profile
              </Button>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Corporate Role</th>
                    <th className="p-3">Department</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">No employees listed. Click + Add Employee Profile to create one.</td>
                    </tr>
                  ) : (
                    employees.map(e => (
                      <tr key={e.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-semibold text-orange-600">{e.id}</td>
                        <td className="p-3 font-bold text-[#1a0f00]">{e.name}</td>
                        <td className="p-3">{e.role}</td>
                        <td className="p-3">{e.dept}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Department Teams */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Department Teams</h2>
              <Button onClick={() => setShowTeamModal(true)} variant="primary" className="text-xs px-3.5 py-2">
                + Create Department Team
              </Button>
            </div>
            {teams.length === 0 ? (
              <div className="p-8 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
                No department teams found. Click + Create Department Team to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(team => (
                  <div key={team.name} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-2 text-xs">
                    <h4 className="font-heading font-bold text-sm text-[#1a0f00]">{team.name}</h4>
                    <span className="text-gray-400 text-[10px]">Leader: {team.lead}</span>
                    <div className="border-t border-gray-100 pt-2 text-gray-600 mt-2">
                      <p>Members: <strong className="text-gray-800">{team.members}</strong></p>
                      <p className="mt-1">Active Projects: <strong className="text-gray-800">{team.activeProjects}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Sales Reports */}
        {activeTab === "reports-sales" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Sales Performance</h2>
            <GlassCard className="p-6 bg-white border border-gray-200 flex flex-col gap-4 text-xs">
              <h3 className="font-heading font-bold text-[#1a0f00] text-sm">Monthly Revenue Audit</h3>
              <p className="text-gray-500">Gross income generated by client database.</p>
              <div className="flex gap-4 items-end mt-4 h-32 border-b border-gray-200 pb-2">
                <div className="w-1/4 bg-orange-500 rounded-t h-[40%] flex items-center justify-center text-[10px] text-white font-bold">April ($35K)</div>
                <div className="w-1/4 bg-orange-500 rounded-t h-[60%] flex items-center justify-center text-[10px] text-white font-bold">May ($55K)</div>
                <div className="w-1/4 bg-orange-500 rounded-t h-[80%] flex items-center justify-center text-[10px] text-white font-bold">June ($75K)</div>
                <div className="w-1/4 bg-orange-600 rounded-t h-[100%] flex items-center justify-center text-[10px] text-white font-bold">July ($98K)</div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab: Lead Reports */}
        {activeTab === "reports-leads" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Lead Generation Reports</h2>
            <GlassCard className="p-6 bg-white border border-gray-200 flex flex-col gap-4 text-xs">
              <h3 className="font-heading font-bold text-[#1a0f00] text-sm">Lead Conversion Ratios</h3>
              <p className="text-gray-500">Overall lead acquisition split by sources.</p>
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex justify-between items-center">
                  <span>Google Ads</span>
                  <strong className="text-[#1a0f00]">40%</strong>
                </div>
                <div className="w-full h-2 rounded bg-gray-150 overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "40%" }}></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Direct Website Forms</span>
                  <strong className="text-[#1a0f00]">35%</strong>
                </div>
                <div className="w-full h-2 rounded bg-gray-150 overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: "35%" }}></div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === "settings-general" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">General System Settings</h2>
            <GlassCard className="p-6 bg-white border border-gray-200 text-xs flex flex-col gap-4 max-w-xl">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Registered Name</label>
                <input 
                  type="text" 
                  defaultValue="CRM Enterprise Solutions Ltd"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admin Contact Email</label>
                <input 
                  type="text" 
                  defaultValue="support@crm.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none"
                />
              </div>
              <div className="flex gap-2.5 items-center mt-3">
                <input type="checkbox" defaultChecked id="gst-switch" className="rounded border-gray-300 text-orange-600 focus:ring-blue-500" />
                <label htmlFor="gst-switch" className="font-semibold text-[#1a0f00]">Enable automatic invoice taxes calculations (18% GST)</label>
              </div>
              <Button variant="primary" className="w-fit mt-3">Save Configurations</Button>

              <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Danger Zone</span>
                <p className="text-gray-500 text-[11px]">Wipe all old demo records from MongoDB to start with a completely empty database.</p>
                <Button 
                  type="button" 
                  onClick={handleClearAllDemoData} 
                  variant="outline" 
                  className="w-fit border-red-200 text-red-600 hover:bg-red-50 font-bold"
                >
                  <Trash2 size={14} className="mr-1.5" /> Clear All Records From MongoDB
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
          </>
        )}
      </main>

      {/* ==========================================
          CRUD MODALS FOR DYNAMIC INPUTS
          ========================================== */}

      {/* 0. Modal: Create Our Project */}
      {showOurProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Create Our Project Profile</h3>
              <button onClick={() => setShowOurProjectModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>

            <form onSubmit={handleCreateOurProject} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud ERP, Mobile CRM Portal"
                  value={ourProjectForm.name}
                  onChange={e => setOurProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client / Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Internal / Logistics"
                    value={ourProjectForm.clientName}
                    onChange={e => setOurProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Contract / Valuation ($)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={ourProjectForm.budget}
                    onChange={e => setOurProjectForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Live URL / Website</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={ourProjectForm.liveUrl}
                    onChange={e => setOurProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Summary & Details</label>
                <textarea
                  rows={3}
                  placeholder="Outline key project features, stack, and business value..."
                  value={ourProjectForm.description}
                  onChange={e => setOurProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" onClick={() => setShowOurProjectModal(false)} variant="secondary" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Save Our Project</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Modal: Our Project Quotation View */}
      {activeOurProjectQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl flex flex-col p-6 overflow-hidden animate-in fade-in zoom-in duration-200 gap-5">
            <div className="flex justify-between items-center border-b border-gray-150 pb-3 shrink-0">
              <div>
                <span className="text-[9px] font-mono text-orange-600 font-bold uppercase tracking-wider">OFFICIAL PROJECT QUOTATION & ESTIMATE</span>
                <h3 className="font-heading font-extrabold text-[#1a0f00] text-lg mt-1">{activeOurProjectQuotation.name || activeOurProjectQuotation.title}</h3>
                <span className="text-xs text-gray-400 block mt-0.5">Client / Sponsor: {activeOurProjectQuotation.clientName || "Build Your Thoughts / Speshway"}</span>
              </div>
              <button onClick={() => setActiveOurProjectQuotation(null)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>

            <div className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-150">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Quote ID</span>
                  <span className="font-mono font-bold text-orange-600">QT-7001</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Status</span>
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px]">Approved & Verified</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Date</span>
                  <span className="font-semibold text-gray-600">2026-07-22</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase border-b border-gray-200">
                    <tr>
                      <th className="p-3">Service Deliverable / Scope</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    <tr>
                      <td className="p-3 font-semibold text-[#1a0f00]">Vite React Animated UI & Shadcn Component Suite</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right font-mono font-bold">$20,000.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a0f00]">Node.js Backend REST API & Content AI Integration</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right font-mono font-bold">$18,000.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#1a0f00]">Production Deployment, Domain Binding & Security Setup</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right font-mono font-bold">$7,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center p-4 bg-orange-50/60 rounded-xl border border-orange-150">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-[#1a0f00]">Total Project Valuation</span>
                  <span className="text-[10px] text-gray-500">Includes 18% Tax & 10% Enterprise Discount</span>
                </div>
                <span className="font-mono text-xl font-extrabold text-orange-600">${(activeOurProjectQuotation.budget || 45000).toLocaleString()}.00</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end shrink-0">
              <Button onClick={() => setActiveOurProjectQuotation(null)} variant="secondary" size="sm">
                Close Quotation View
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 1. Modal: Create Client */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Create Client Profile</h3>
              <button onClick={() => setShowClientModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateClient} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Name *</label>
                  <input 
                    type="text" required
                    placeholder="Enter name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Company Name *</label>
                  <input 
                    type="text" required
                    placeholder="Enter company"
                    value={clientForm.company}
                    onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Address *</label>
                  <input 
                    type="email" required
                    placeholder="client@mail.com"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp Number *</label>
                  <input 
                    type="text" required
                    placeholder="+91 98..."
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Complete Address</label>
                <input 
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Additional context notes..."
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Add Client to Directory
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 2. Modal: Log Call */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Log Client Call</h3>
              <button onClick={() => setShowCallModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleLogCall} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Client *</label>
                <select 
                  required
                  value={callForm.clientId}
                  onChange={(e) => setCallForm({ ...callForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Choose Client Profile --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Call Type *</label>
                  <select 
                    value={callForm.type}
                    onChange={(e) => setCallForm({ ...callForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Sales call">Sales call</option>
                    <option value="Support call">Support call</option>
                    <option value="Project discussion">Project discussion</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Call Status *</label>
                  <select 
                    value={callForm.status}
                    onChange={(e) => setCallForm({ ...callForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Connected">Connected</option>
                    <option value="Not answered">Not answered</option>
                    <option value="Busy">Busy</option>
                    <option value="Switched off">Switched off</option>
                    <option value="Call back later">Call back later</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Call Purpose *</label>
                <input 
                  type="text" required
                  placeholder="e.g. negotiation review, pricing audit"
                  value={callForm.purpose}
                  onChange={(e) => setCallForm({ ...callForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Discussion Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Summary of notes discussed..."
                  value={callForm.notes}
                  onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Next Action Required</label>
                <input 
                  type="text"
                  placeholder="e.g. send proposal details"
                  value={callForm.nextAction}
                  onChange={(e) => setCallForm({ ...callForm, nextAction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Log Call Outcomes
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 3. Modal: Create Lead */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Add Business Lead</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateLead} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lead Name *</label>
                  <input 
                    type="text" required
                    placeholder="Prospect client name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Company Name *</label>
                  <input 
                    type="text" required
                    placeholder="Prospect company"
                    value={leadForm.companyName}
                    onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email"
                    placeholder="prospect@mail.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp Phone *</label>
                  <input 
                    type="text" required
                    placeholder="WhatsApp contact"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lead Source *</label>
                  <select 
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Website">Website</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone call">Phone call</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Interested Service *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. ERP integration setup"
                    value={leadForm.interestedService}
                    onChange={(e) => setLeadForm({ ...leadForm, interestedService: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Expected Budget (USD) *</label>
                  <input 
                    type="number" required
                    value={leadForm.expectedBudget}
                    onChange={(e) => setLeadForm({ ...leadForm, expectedBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Priority Level *</label>
                  <select 
                    value={leadForm.priority}
                    onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Add Lead Record
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 4. Modal: Create Project */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Setup Client Project</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Name *</label>
                <input 
                  type="text" required
                  placeholder="Enter project workflow name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Client *</label>
                  <select 
                    required
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choose Client Profile --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Category *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Cloud security setup"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Assigned Budget (USD) *</label>
                  <input 
                    type="number" required
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Priority Level *</label>
                  <select 
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Scope Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Outline feature specifications and timeline conditions..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Initialize Client Project
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 5. Modal: Create / Edit Quotation Proposal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 shrink-0">
              <div>
                <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">
                  {editingQuote ? "Edit Proposal Document & Plan Comparison" : "Generate Quotation Proposal"}
                </h3>
                <span className="text-[10px] text-purple-700 font-medium block">Configure document overview narrative, user roles, plan comparison matrix & terms.</span>
              </div>
              <button onClick={() => { setShowQuoteModal(false); setEditingQuote(null); }} className="text-gray-400 hover:text-[#1a0f00] text-lg font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleCreateQuotation} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quotation Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. JoyEvents Custom Quotation Proposal"
                  value={quoteForm.title}
                  onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Name / Sponsor *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. JoyEvents / Speshway"
                    value={quoteForm.clientName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. JoyEvents"
                    value={quoteForm.projectName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, projectName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* 5. PLAN COMPARISON MATRIX DELIVERABLES */}
              <div className="flex flex-col gap-2.5 border-t border-purple-200 pt-3 bg-purple-50/40 p-3.5 rounded-2xl border">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1">
                    <span>5. Plan Comparison Matrix Deliverables *</span>
                  </span>
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">PDF Page 3</span>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add new deliverable item (e.g. Multi-Currency Support)..."
                    value={newComparisonDeliverableText}
                    onChange={e => setNewComparisonDeliverableText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newComparisonDeliverableText.trim()) {
                          setQuotePlanComparisonItems(prev => [
                            ...prev, 
                            { deliverable: newComparisonDeliverableText.trim(), planA: true, planB: true }
                          ]);
                          setNewComparisonDeliverableText("");
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (newComparisonDeliverableText.trim()) {
                        setQuotePlanComparisonItems(prev => [
                          ...prev, 
                          { deliverable: newComparisonDeliverableText.trim(), planA: true, planB: true }
                        ]);
                        setNewComparisonDeliverableText("");
                      }
                    }} 
                    variant="secondary" 
                    size="sm" 
                    className="text-[10px] py-1.5 px-3 flex items-center gap-1 border border-purple-200 text-purple-800 bg-purple-100 font-bold shrink-0"
                  >
                    <Plus size={12} /> Add Deliverable
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {quotePlanComparisonItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-purple-150 text-xs shadow-xs">
                      <input 
                        type="text" 
                        value={item.deliverable} 
                        onChange={e => {
                          const val = e.target.value;
                          setQuotePlanComparisonItems(prev => prev.map((it, i) => i === idx ? { ...it, deliverable: val } : it));
                        }}
                        className="flex-1 font-semibold text-gray-800 border-b border-dashed border-gray-300 focus:outline-none focus:border-purple-600 px-1 py-0.5 text-xs bg-transparent"
                      />
                      <div className="flex items-center gap-4 shrink-0">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.planA !== false} 
                            onChange={e => {
                              const checked = e.target.checked;
                              setQuotePlanComparisonItems(prev => prev.map((it, i) => i === idx ? { ...it, planA: checked } : it));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>Plan A (Web)</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-purple-800 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.planB !== false} 
                            onChange={e => {
                              const checked = e.target.checked;
                              setQuotePlanComparisonItems(prev => prev.map((it, i) => i === idx ? { ...it, planB: checked } : it));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>Plan B (Web+App)</span>
                        </label>
                        {quotePlanComparisonItems.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setQuotePlanComparisonItems(prev => prev.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Currency *</label>
                  <select 
                    value={(quoteForm as any).currency || "Indian Rupees (INR)"}
                    onChange={(e) => setQuoteForm({ ...quoteForm, currency: e.target.value } as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-semibold"
                  >
                    <option value="Indian Rupees (INR)">Indian Rupees (INR ₹)</option>
                    <option value="US Dollars (USD $)">US Dollars (USD $)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Plan A Valuation (Web Only) *</label>
                  <input 
                    type="number" required
                    placeholder="e.g. 60000"
                    value={(quoteForm as any).planAPrice || 60000}
                    onChange={(e) => setQuoteForm({ ...quoteForm, planAPrice: Number(e.target.value) } as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Plan B Valuation (Web + App) *</label>
                  <input 
                    type="number" required
                    placeholder="e.g. 110000"
                    value={(quoteForm as any).planBPrice || 110000}
                    onChange={(e) => setQuoteForm({ ...quoteForm, planBPrice: Number(e.target.value) } as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono font-semibold text-purple-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Discount (%)</label>
                  <input 
                    type="number"
                    value={quoteForm.discount}
                    onChange={(e) => setQuoteForm({ ...quoteForm, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tax GST (%)</label>
                  <input 
                    type="number"
                    value={quoteForm.tax}
                    onChange={(e) => setQuoteForm({ ...quoteForm, tax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Valid Until</label>
                  <input 
                    type="date"
                    value={quoteForm.validUntil}
                    onChange={(e) => setQuoteForm({ ...quoteForm, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF REPORT SECTION 1: PROJECT OVERVIEW NARRATIVE */}
              <div className="flex flex-col gap-2 border-t border-purple-200 pt-3 bg-purple-50/40 p-3.5 rounded-2xl border">
                <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1">
                  <span>1. Project Overview Narrative (PDF Page 1)</span>
                </span>
                <div className="flex flex-col gap-1">
                  <textarea
                    rows={3}
                    placeholder="Outline comprehensive project overview narrative for PDF proposal..."
                    value={(quoteForm as any).overviewNarrative || ""}
                    onChange={e => setQuoteForm({ ...quoteForm, overviewNarrative: e.target.value } as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>
              </div>

              {/* PDF REPORT SECTION 2: USER ROLES & ACCESS SCOPE */}
              <div className="flex flex-col gap-2 border-t border-purple-200 pt-3 bg-purple-50/40 p-3.5 rounded-2xl border">
                <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1">
                  <span>2. User Roles & Access Scope (PDF Page 1)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Customer / Buyer Role</label>
                    <textarea
                      rows={2}
                      placeholder="Customer role specifications..."
                      value={(quoteForm as any).customerDesc || ""}
                      onChange={e => setQuoteForm({ ...quoteForm, customerDesc: e.target.value } as any)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Merchant / Vendor Role</label>
                    <textarea
                      rows={2}
                      placeholder="Merchant role specifications..."
                      value={(quoteForm as any).merchantDesc || ""}
                      onChange={e => setQuoteForm({ ...quoteForm, merchantDesc: e.target.value } as any)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Admin Governance Role</label>
                    <textarea
                      rows={2}
                      placeholder="Admin governance specifications..."
                      value={(quoteForm as any).adminDesc || ""}
                      onChange={e => setQuoteForm({ ...quoteForm, adminDesc: e.target.value } as any)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* PDF REPORT SECTION 6 & 7: PAYMENT TERMS & TERMS AND CONDITIONS */}
              <div className="flex flex-col gap-2 border-t border-purple-200 pt-3 bg-purple-50/40 p-3.5 rounded-2xl border">
                <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1">
                  <span>6 & 7. Payment Terms & Terms & Conditions (PDF Page 4)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">6. Payment Terms</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 40% advance on project kick-off&#10;30% on completion of core module&#10;30% on final delivery"
                      value={(quoteForm as any).paymentTerms || ""}
                      onChange={e => setQuoteForm({ ...quoteForm, paymentTerms: e.target.value } as any)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500 font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">7. Terms & Conditions</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Estimation is valid for 30 days.&#10;Includes 30 days complimentary bug-fix support.&#10;Source code handed over upon full payment."
                      value={(quoteForm as any).termsAndConditions || ""}
                      onChange={e => setQuoteForm({ ...quoteForm, termsAndConditions: e.target.value } as any)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl resize-none text-xs focus:outline-none focus:border-purple-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-2 shrink-0">
                <Button type="submit" variant="primary" className="w-full py-2.5 shadow-md bg-purple-900 text-white font-bold hover:bg-purple-950">
                  {editingQuote ? "Save & Update Proposal Settings" : "Save & Add Proposal Settings"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 6. Modal: Add / Edit Project Feature */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">
                {editingFeature ? "Edit Project Feature" : "Add Project Feature"}
              </h3>
              <button onClick={() => { setShowFeatureModal(false); setEditingFeature(null); }} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateFeature} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Feature Title / Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. AI Content Generation Engine"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-semibold text-xs text-[#1a0f00]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Feature Description & Scope</label>
                <textarea 
                  rows={3}
                  placeholder="Outline feature specifications, description and scope details..."
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-xs text-gray-700 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" onClick={() => { setShowFeatureModal(false); setEditingFeature(null); }} variant="secondary" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingFeature ? "Update Feature" : "Add Feature"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 7. Modal: Propose Innovation */}
      {showInnovationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Propose Project Innovation</h3>
              <button onClick={() => setShowInnovationModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateInnovation} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Innovation Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. AI-assisted shipping automation"
                  value={innovationForm.title}
                  onChange={(e) => setInnovationForm({ ...innovationForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Business Benefit *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Cuts workflow lag by 40%"
                    value={innovationForm.businessBenefit}
                    onChange={(e) => setInnovationForm({ ...innovationForm, businessBenefit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Technical Benefit *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Redundant server cleanup"
                    value={innovationForm.technicalBenefit}
                    onChange={(e) => setInnovationForm({ ...innovationForm, technicalBenefit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Estimated Cost (USD) *</label>
                <input 
                  type="number" required
                  value={innovationForm.estimatedCost}
                  onChange={(e) => setInnovationForm({ ...innovationForm, estimatedCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Description of Idea</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Outline solution benefits and technical scopes..."
                  value={innovationForm.description}
                  onChange={(e) => setInnovationForm({ ...innovationForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Log Proposal
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 8. Modal: Create Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Generate New Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Vanguard Retail Inc"
                  value={invoiceForm.clientName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Invoice Amount ($) *</label>
                  <input 
                    type="number" required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Generate Invoice & Save to DB
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 9. Modal: Log Payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Log Payment Record</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreatePayment} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. AeroSpace Logistics"
                  value={paymentForm.clientName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Payment Amount ($) *</label>
                  <input 
                    type="number" required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Gateway / Method</label>
                  <select 
                    value={paymentForm.gateway}
                    onChange={(e) => setPaymentForm({ ...paymentForm, gateway: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Log Payment & Save to DB
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 10. Modal: Add Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Add Expense Item</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Expense Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. AWS Cloud Server Hosting"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Value ($) *</label>
                  <input 
                    type="number" required
                    value={expenseForm.value}
                    onChange={(e) => setExpenseForm({ ...expenseForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Software Retainer">Software Retainer</option>
                    <option value="Marketing & Outreach">Marketing & Outreach</option>
                    <option value="Office Operations">Office Operations</option>
                  </select>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Add Expense Item
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 11. Modal: Add Employee Profile */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Add Employee Profile</h3>
              <button onClick={() => setShowEmployeeModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateEmployee} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Nisha Rao"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Job Role *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Sales Executive Lead"
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Department</label>
                  <input 
                    type="text"
                    placeholder="e.g. Corporate CRM"
                    value={employeeForm.dept}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, dept: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Add Employee Profile
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 12. Modal: Create Department Team */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Create Department Team</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Team Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Enterprise Delivery Team"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Team Lead Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Nisha Rao"
                  value={teamForm.lead}
                  onChange={(e) => setTeamForm({ ...teamForm, lead: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Team Members List</label>
                <input 
                  type="text"
                  placeholder="e.g. Nisha R, Karan J, Sophia W"
                  value={teamForm.members}
                  onChange={(e) => setTeamForm({ ...teamForm, members: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Create Team & Save to DB
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
}

