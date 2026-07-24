"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Edit3, 
  ArrowLeft, 
  Save, 
  FileText,
  Building2,
  CheckCircle,
  X
} from "lucide-react";
import Button from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "OPRJ-6561";
  const proposalId = (params?.proposalId as string) || "QT-OPRJ-6561";

  const [project, setProject] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [status, setStatus] = useState("Approved");
  const [planAPrice, setPlanAPrice] = useState<number>(60000);
  const [planBPrice, setPlanBPrice] = useState<number>(110000);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch project
        const projRes = await fetch(`${API_URL}/crm/our-projects`);
        const projData = await projRes.json();
        let currentProj = null;
        if (projData.success && Array.isArray(projData.data)) {
          currentProj = projData.data.find((p: any) => p.id === projectId || (p.name && p.name.toLowerCase() === projectId.toLowerCase()));
        }
        if (!currentProj) {
          currentProj = { id: projectId, name: projectId, title: projectId };
        }
        setProject(currentProj);

        // Fetch proposal
        const quoteRes = await fetch(`${API_URL}/crm/quotation`);
        const quoteData = await quoteRes.json();
        let targetQuote = null;
        if (quoteData.success && Array.isArray(quoteData.data)) {
          targetQuote = quoteData.data.find((q: any) => q.id === proposalId || q.number === proposalId);
        }

        if (targetQuote) {
          setProposal(targetQuote);
          setTitle(targetQuote.title || "");
          setClientName(targetQuote.clientName || currentProj.clientName || "Enterprise Client");
          setProjectType(targetQuote.projectType || "Web & Mobile Ecosystem");
          setStatus(targetQuote.status || "Approved");
          setPlanAPrice(targetQuote.planAPrice || 60000);
          setPlanBPrice(targetQuote.planBPrice || 110000);
        }
      } catch (err) {
        console.error("Error loading proposal edit data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, proposalId]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const updatedPayload = {
      ...proposal,
      title: title.trim(),
      clientName: clientName.trim(),
      projectType,
      status,
      planAPrice,
      planBPrice
    };

    try {
      await fetch(`${API_URL}/crm/quotation/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
      });
    } catch (err) {
      console.error("Error updating proposal:", err);
    } finally {
      router.push(`/admin/our-projects/${projectId}/proposals`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500">Loading Proposal Edit Page...</p>
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
          <span className="text-gray-700 font-mono">{proposalId}</span>
          <span>/</span>
          <span className="text-orange-600">Edit Proposal Name</span>
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
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
              {proposalId} &bull; EDIT PROPOSAL NAME PAGE
            </span>
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-white">
              Edit Proposal &bull; {title || proposalId}
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              Update proposal title, client specifications, and pricing tiers below.
            </p>
          </div>
        </div>
      </div>

      {/* EDIT FORM CANVAS PAGE */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <form onSubmit={handleEditSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Proposal Title Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category Scope
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Plan A Price (Web App)
              </label>
              <input
                type="number"
                value={planAPrice}
                onChange={(e) => setPlanAPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Plan B Price (Hybrid Web + App)
              </label>
              <input
                type="number"
                value={planBPrice}
                onChange={(e) => setPlanBPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-[#1a0f00] bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
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
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Saving Changes..." : "Save Proposal Changes"}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
