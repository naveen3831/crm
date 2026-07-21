"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Loader2
} from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // States fetched live from MongoDB
  const [clients, setClients] = useState<Client[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

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
        "client", "call", "lead", "project", "quotation", 
        "feature", "innovation", "invoice", "payment", 
        "expense", "user", "employee", "team"
      ];
      
      const responses = await Promise.all(
        types.map(t => fetch(`http://localhost:5000/api/v1/crm/${t}`).then(res => {
          if (!res.ok) throw new Error("Database Sync Failed");
          return res.json();
        }))
      );
      
      responses.forEach((res, index) => {
        if (res.success) {
          const payload = res.data;
          switch (types[index]) {
            case "client": setClients(payload); break;
            case "call": setCalls(payload); break;
            case "lead": setLeads(payload); break;
            case "project": setProjects(payload); break;
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
    loadDatabase();
  }, []);

  const recentActivities = [
    { action: "Invoice Created", detail: "Generated Invoice #1024 for Acme Corporation", time: "10 mins ago", type: "billing" },
    { action: "Payment Cleared", detail: "Stripe payment of $1,200.00 cleared for AeroSpace Logistics", time: "1 hour ago", type: "success" },
    { action: "Ticket Resolved", detail: "Admin marked Card Payment dispute as Resolved for Vanguard", time: "3 hours ago", type: "support" },
    { action: "Account Suspended", detail: "Suspended Cyber Systems user profile for policy breach", time: "5 hours ago", type: "lead" }
  ];

  const pipelineStages = [
    { name: "Prospecting", count: 12, percentage: "25%", color: "bg-[#EE4047]" },
    { name: "Proposal Stage", count: 18, percentage: "37.5%", color: "bg-[#FF9F0A]" },
    { name: "Negotiation", count: 10, percentage: "20.8%", color: "bg-orange-600" },
    { name: "Closed Won", count: 8, percentage: "16.7%", color: "bg-[#27C15A]" }
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
  const [featureForm, setFeatureForm] = useState({
    projectId: "", title: "", moduleName: "", description: "", priority: "Medium", assignedDeveloper: "Karan (Developer)", estimatedHours: 40
  });
  const [innovationForm, setInnovationForm] = useState({
    projectId: "", title: "", proposedBy: "Sophia (Testing)", description: "", businessBenefit: "", technicalBenefit: "", estimatedCost: 1000
  });

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
      const res = await fetch("http://localhost:5000/api/v1/crm/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
      }).then(r => r.json());

      if (res.success) {
        setClients(prev => [...prev, res.data]);
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
      const res = await fetch(`http://localhost:5000/api/v1/crm/client/${id}`, {
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
      const res = await fetch("http://localhost:5000/api/v1/crm/call", {
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
      const res = await fetch(`http://localhost:5000/api/v1/crm/call/${id}`, {
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
      const res = await fetch("http://localhost:5000/api/v1/crm/lead", {
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
      const resClient = await fetch("http://localhost:5000/api/v1/crm/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient)
      }).then(r => r.json());

      const resProj = await fetch("http://localhost:5000/api/v1/crm/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      }).then(r => r.json());

      const resLead = await fetch(`http://localhost:5000/api/v1/crm/lead/${lead.id}`, {
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
    const newProj: Project = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: projectForm.name,
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
      const res = await fetch("http://localhost:5000/api/v1/crm/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj)
      }).then(r => r.json());

      if (res.success) {
        setProjects(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowProjectModal(false);
    setProjectForm({ name: "", clientName: "", category: "", manager: "Nisha Rao", budget: 0, priority: "Medium", description: "" });
  };

  const handleUpdateProjectStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/crm/project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
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

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = quoteForm.itemsInput.split("\n").map(l => {
      const parts = l.split("-");
      return {
        service: parts[0]?.trim() || "Consulting & Delivery",
        qty: 1,
        rate: Number(parts[1]?.trim()) || 1000
      };
    });

    const newQuote: Quotation = {
      number: `QT-2026-00${Math.floor(10 + Math.random() * 89)}`,
      clientName: quoteForm.clientName,
      projectName: quoteForm.projectName || "General Service Contract",
      title: quoteForm.title,
      serviceItems: lines,
      discount: Number(quoteForm.discount),
      tax: Number(quoteForm.tax),
      validUntil: quoteForm.validUntil || new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0],
      terms: quoteForm.terms,
      notes: "Invoice terms active upon signature.",
      createdBy: "Nisha Rao",
      createdDate: new Date().toISOString().split("T")[0],
      status: "Draft"
    };

    try {
      const res = await fetch("http://localhost:5000/api/v1/crm/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote)
      }).then(r => r.json());

      if (res.success) {
        setQuotations(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowQuoteModal(false);
    setQuoteForm({ clientName: "", projectName: "", title: "", itemsInput: "", discount: 0, tax: 18, validUntil: "", terms: "" });
  };

  const handleApproveQuotation = async (number: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/crm/quotation/${number}`, {
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

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === featureForm.projectId) || projects[0];
    if (!project) return;

    const newFeat: ProjectFeature = {
      id: `FEAT-${Math.floor(100 + Math.random() * 899)}`,
      projectId: featureForm.projectId,
      projectName: project.name,
      title: featureForm.title,
      moduleName: featureForm.moduleName,
      description: featureForm.description,
      requirementType: "Functional",
      priority: featureForm.priority as any,
      assignedDeveloper: featureForm.assignedDeveloper,
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split("T")[0],
      estimatedHours: Number(featureForm.estimatedHours),
      progress: 0,
      status: "Planned",
      clientApproval: false,
      notes: ""
    };

    try {
      const res = await fetch("http://localhost:5000/api/v1/crm/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeat)
      }).then(r => r.json());

      if (res.success) {
        setFeatures(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }

    setShowFeatureModal(false);
    setFeatureForm({ projectId: "", title: "", moduleName: "", description: "", priority: "Medium", assignedDeveloper: "Karan (Developer)", estimatedHours: 40 });
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
      const res = await fetch("http://localhost:5000/api/v1/crm/innovation", {
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

  const calculateQuoteFinal = (quote: Quotation) => {
    const subtotal = quote.serviceItems.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
    const discVal = subtotal * (quote.discount / 100);
    const taxVal = (subtotal - discVal) * (quote.tax / 100);
    return Math.floor(subtotal - discVal + taxVal);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Render Error state if Node.js server cannot be synced
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <GlassCard className="p-10 flex flex-col items-center gap-4 bg-white/70 shadow-elevated border border-red-500/10 text-center max-w-sm">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <span className="font-heading font-extrabold text-[#1a0f00] text-sm tracking-wide">Database Sync Failed</span>
          <p className="text-xs text-gray-500 leading-relaxed">Could not establish connection to the Node.js API server on port 5000. Please ensure the backend is active and running.</p>
          <Button onClick={() => loadDatabase()} variant="primary" className="mt-2 w-full text-xs font-semibold">
            Retry Connection
          </Button>
        </GlassCard>
      </div>
    );
  }

  // Render Premium Loader when calling Live DB
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* 1. BRAND SIDEBAR CONTAINER */}
      <aside className="w-full md:w-64 bg-white text-gray-700 flex flex-col justify-between shrink-0 p-6 shadow-sm border-r border-gray-200">
        <div className="flex flex-col gap-6">
          
          {/* Brand Logo and icon */}
          <div className="flex items-center gap-2 group border-b border-gray-150 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700/10 to-blue-500/5 border border-orange-500/10 flex items-center justify-center p-1.5 text-[#1a0f00]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full text-[#1a0f00]">
                <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
                <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
                <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
                <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
                <ellipse cx="100" cy="100" rx="48" ry="29" stroke="currentColor" strokeWidth="10" transform="rotate(-15, 100, 100)" />
                <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
                <path d="M 75,122 L 35,167" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
              </svg>
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
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-mono font-semibold text-orange-600">{c.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#1a0f00]">{c.name}</div>
                        <span className="text-[10px] text-gray-400">{c.company} &bull; {c.email}</span>
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
                      <td className="p-3 text-right flex justify-end gap-2">
                        <Button onClick={() => setActiveClientDetail(c)} variant="secondary" size="sm" className="px-2 py-1 flex items-center">
                          <Eye size={12} />
                        </Button>
                        <Button 
                          onClick={() => handleDeactivateClient(c.id)} 
                          variant="ghost" 
                          size="sm" 
                          className="px-2 py-1 text-red-600 border-red-55 hover:bg-red-50"
                        >
                          {c.status === "Active" ? <UserX size={12} /> : <UserCheck size={12} />}
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
                      <button onClick={() => setActiveClientDetail(null)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
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
                  <Button onClick={() => setActiveClientDetail(null)} variant="secondary" className="w-full mt-6">
                    Close Details View
                  </Button>
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
                      <td className="p-3 text-right">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">{p.id}</span>
                      <h3 className="font-heading font-bold text-sm text-[#1a0f00] mt-1.5">{p.name}</h3>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Client: {p.clientName}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      p.status === "Completed" ? "bg-green-50 text-green-600" :
                      p.status === "Planning" ? "bg-orange-50 text-orange-700" : "bg-amber-50 text-amber-600"
                    }`}>
                      {p.status}
                    </span>
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
                    <span className="text-xs font-bold text-[#1a0f00]">${p.budget.toLocaleString()}.00</span>
                    <Button onClick={() => { setActiveProjectDetail(p); setActiveProjectTab("overview"); }} variant="secondary" size="sm">
                      Details Tab Suite
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {activeProjectDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
                <GlassCard className="w-full max-w-4xl bg-white h-[85vh] border border-gray-200 shadow-2xl flex flex-col p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center border-b border-gray-150 pb-3 shrink-0">
                    <div>
                      <span className="text-[9px] font-mono text-orange-600 font-bold">{activeProjectDetail.id} &bull; Workspace</span>
                      <h3 className="font-heading font-extrabold text-[#1a0f00] text-lg mt-1">{activeProjectDetail.name}</h3>
                    </div>
                    <button onClick={() => setActiveProjectDetail(null)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
                  </div>

                  <div className="flex gap-1.5 border-b border-gray-150 overflow-x-auto py-2 shrink-0 text-xs">
                    {["overview", "quotations", "features", "innovations", "tasks"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveProjectTab(tab)}
                        className={`px-4 py-2 font-bold uppercase text-[9px] rounded-lg tracking-wider transition-colors ${
                          activeProjectTab === tab ? "bg-orange-50 text-orange-700" : "text-gray-500 hover:text-[#1a0f00] hover:bg-gray-50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto py-5 text-xs text-gray-700">
                    
                    {activeProjectTab === "overview" && (
                      <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase">Project Manager</span>
                            <strong className="text-[#1a0f00] mt-1 block">{activeProjectDetail.manager}</strong>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase">Assigned Budget</span>
                            <strong className="text-[#1a0f00] mt-1 block">${activeProjectDetail.budget.toLocaleString()}</strong>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase">Priority Level</span>
                            <strong className="text-[#1a0f00] mt-1 block">{activeProjectDetail.priority}</strong>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase">Target Date</span>
                            <strong className="text-[#1a0f00] mt-1 block">{activeProjectDetail.expectedCompletionDate}</strong>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <h4 className="font-heading font-bold text-[#1a0f00] text-sm">Description</h4>
                          <p className="leading-relaxed text-gray-600 font-sans">{activeProjectDetail.description}</p>
                        </div>

                        <div className="flex gap-2 items-center mt-3 border-t border-gray-100 pt-3">
                          <span className="font-bold text-[#1a0f00]">Change Status:</span>
                          {["Planning", "Quotation sent", "Approved", "In progress", "Testing", "Completed", "Cancelled"].map(st => (
                            <button
                              key={st}
                              onClick={() => handleUpdateProjectStatus(activeProjectDetail.id, st as any)}
                              className={`px-2.5 py-1 rounded text-[9px] font-semibold transition-all ${
                                activeProjectDetail.status === st ? "bg-orange-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeProjectTab === "quotations" && (
                      <div className="flex flex-col gap-4">
                        {quotations.filter(q => q.projectName === activeProjectDetail.name).length === 0 ? (
                          <div className="text-center py-8 text-gray-400">No quotation proposals created for this project yet.</div>
                        ) : (
                          quotations.filter(q => q.projectName === activeProjectDetail.name).map(q => (
                            <div key={q.number} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center">
                              <div>
                                <span className="font-mono font-bold text-orange-600">{q.number} &bull; {q.title}</span>
                                <span className="text-[10px] text-gray-400 mt-1 block">Final Value: **${calculateQuoteFinal(q).toLocaleString()}**</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                q.status === "Approved" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                              }`}>{q.status}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeProjectTab === "features" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-heading font-bold text-[#1a0f00]">Features Checklist</h4>
                          <Button onClick={() => {
                            setFeatureForm(prev => ({ ...prev, projectId: activeProjectDetail.id }));
                            setShowFeatureModal(true);
                          }} variant="primary" size="sm" className="text-[10px] py-1">Add Feature</Button>
                        </div>
                        {features.filter(f => f.projectId === activeProjectDetail.id).length === 0 ? (
                          <div className="text-center py-8 text-gray-400">No software features logged.</div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {features.filter(f => f.projectId === activeProjectDetail.id).map(feat => (
                              <div key={feat.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center">
                                <div>
                                  <h5 className="font-bold text-[#1a0f00]">{feat.title}</h5>
                                  <p className="text-[10px] text-gray-500 mt-0.5">Assigned Developer: {feat.assignedDeveloper} &bull; Progress: {feat.progress}%</p>
                                </div>
                                <span className="text-[9px] font-bold uppercase bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{feat.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeProjectTab === "innovations" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-heading font-bold text-[#1a0f00]">Proposed Innovations</h4>
                          <Button onClick={() => {
                            setInnovationForm(prev => ({ ...prev, projectId: activeProjectDetail.id }));
                            setShowInnovationModal(true);
                          }} variant="primary" size="sm" className="text-[10px] py-1">Propose Innovation</Button>
                        </div>
                        {innovations.filter(i => i.projectId === activeProjectDetail.id).length === 0 ? (
                          <div className="text-center py-8 text-gray-400">No innovation solutions proposed for this project.</div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {innovations.filter(i => i.projectId === activeProjectDetail.id).map(inn => (
                              <div key={inn.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-bold text-[#1a0f00]">{inn.title}</h5>
                                  <span className="text-[9px] font-bold uppercase bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{inn.approvalStatus}</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-sans">{inn.description}</p>
                                <div className="text-[10px] text-orange-600 mt-1">Benefit: {inn.businessBenefit}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeProjectTab === "tasks" && (
                      <div className="flex flex-col gap-3">
                        <h4 className="font-heading font-bold text-[#1a0f00]">Development Milestones</h4>
                        <div className="p-3.5 rounded-xl bg-white border border-gray-150 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <CheckSquare size={16} className="text-green-600" />
                            <span className="font-semibold text-[#1a0f00]">Sprint 1: Schema Setup & Configurations</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase bg-green-50 text-green-600 px-2 py-0.5 rounded">Completed</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white border border-gray-150 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-amber-500" />
                            <span className="font-semibold text-[#1a0f00]">Sprint 2: Stripe gateway API bindings</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-600 px-2 py-0.5 rounded">Active</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 shrink-0">
                    <Button onClick={() => setActiveProjectDetail(null)} variant="secondary" className="w-full">
                      Close Details Drawer
                    </Button>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        )}

        {/* Tab: Quotations */}
        {activeTab === "quotations" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-base text-[#1a0f00]">Quotations Ledger</h2>
              <Button onClick={() => setShowQuoteModal(true)} variant="primary" size="sm" className="gap-1">
                <Plus size={14} /> Create Quotation
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {quotations.map(quote => {
                const totalVal = calculateQuoteFinal(quote);
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
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Billing Invoices</h2>
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
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-100">
                      <td className="p-3 font-mono font-semibold text-orange-600">{inv.id}</td>
                      <td className="p-3 font-bold text-[#1a0f00]">{inv.clientName}</td>
                      <td className="p-3">{inv.due}</td>
                      <td className="p-3 font-bold">${inv.value.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          inv.status === "Paid" ? "bg-green-50 text-green-600" : "bg-pipeline-red-100 text-pipeline-red-500"
                        }`}>{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Payments Log */}
        {activeTab === "payments" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Receipt Payments Log</h2>
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
                  {payments.map(pay => (
                    <tr key={pay.id} className="border-b border-gray-100">
                      <td className="p-3 font-mono font-semibold text-green-600">{pay.id}</td>
                      <td className="p-3 font-bold text-[#1a0f00]">{pay.clientName}</td>
                      <td className="p-3 font-bold">${pay.amount.toLocaleString()}</td>
                      <td className="p-3">{pay.gateway}</td>
                      <td className="p-3">{pay.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Expense Ledger */}
        {activeTab === "expenses" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Corporate Expenses</h2>
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
                  {expenses.map(exp => (
                    <tr key={exp.id} className="border-b border-gray-100">
                      <td className="p-3 font-mono font-semibold text-red-600">{exp.id}</td>
                      <td className="p-3 font-semibold text-[#1a0f00]">{exp.title}</td>
                      <td className="p-3 font-bold text-red-600">${exp.value}</td>
                      <td className="p-3">{exp.category}</td>
                      <td className="p-3">{exp.date}</td>
                    </tr>
                  ))}
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
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700">
                  {users.map(u => (
                    <tr key={u.email} className="border-b border-gray-100">
                      <td className="p-3 font-bold text-[#1a0f00]">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded font-bold text-[9px]">ACTIVE</span>
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
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Employee Roster</h2>
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
                  {employees.map(e => (
                    <tr key={e.id} className="border-b border-gray-100">
                      <td className="p-3 font-mono font-semibold text-orange-600">{e.id}</td>
                      <td className="p-3 font-bold text-[#1a0f00]">{e.name}</td>
                      <td className="p-3">{e.role}</td>
                      <td className="p-3">{e.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Department Teams */}
        {activeTab === "teams" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="font-heading font-bold text-base text-[#1a0f00]">Department Teams</h2>
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
            </GlassCard>
          </div>
        )}

      </main>

      {/* ==========================================
          CRUD MODALS FOR DYNAMIC INPUTS
          ========================================== */}

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

      {/* 5. Modal: Create Quotation */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Generate Quotation Proposal</h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateQuotation} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quotation Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Migration setup proposals"
                  value={quoteForm.title}
                  onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Client Profile *</label>
                  <select 
                    required
                    value={quoteForm.clientName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Connect to Project *</label>
                  <select 
                    required
                    value={quoteForm.projectName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, projectName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Service Items & Rates * (One item per line. Format: Service Name - Rate)</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="e.g. Migration extraction - 1500&#10;Consulting Support - 1000"
                  value={quoteForm.itemsInput}
                  onChange={(e) => setQuoteForm({ ...quoteForm, itemsInput: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-[11px] resize-none focus:outline-none focus:border-orange-500"
                />
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

              <Button type="submit" variant="primary" className="w-full mt-2">
                Generate proposal Invoice
              </Button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 6. Modal: Add Project Feature */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f00]/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 bg-white border border-gray-200 shadow-elevated flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Add Project Feature Requirement</h3>
              <button onClick={() => setShowFeatureModal(false)} className="text-gray-400 hover:text-[#1a0f00] text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleCreateFeature} className="flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Feature Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Live tracking dashboard modules"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Requirement Module *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Front-end panels"
                    value={featureForm.moduleName}
                    onChange={(e) => setFeatureForm({ ...featureForm, moduleName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Priority *</label>
                  <select 
                    value={featureForm.priority}
                    onChange={(e) => setFeatureForm({ ...featureForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Assigned Developer</label>
                  <input 
                    type="text"
                    value={featureForm.assignedDeveloper}
                    onChange={(e) => setFeatureForm({ ...featureForm, assignedDeveloper: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Estimated Hours *</label>
                  <input 
                    type="number" required
                    value={featureForm.estimatedHours}
                    onChange={(e) => setFeatureForm({ ...featureForm, estimatedHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Feature Scope Description</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Outline development requirements details..."
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2">
                Add Feature Spec
              </Button>
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

    </div>
  );
}

