"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { ArrowLeft, Download, FileText, CheckCircle } from "lucide-react";

interface QuoteReviewModalProps {
  reviewingQuote: any;
  setReviewingQuote: (val: any) => void;
  reviewMode: "exact-pdf" | "live-editor";
  setReviewMode: (val: "exact-pdf" | "live-editor") => void;
  reviewerNotes: string;
  setReviewerNotes: (val: string) => void;
  features: any[];
  activeProjectDetail: any;
  getCleanPlanComparisonItems: (items: any) => any[];
  defaultPlanComparisonDeliverables: any[];
  generateSpeshwayEstimationPdfHtml: (proj: any, quote: any, feats: any) => string;
  triggerDirectPdfDownload: (html: string, filename: string) => void;
  handleSaveQuotationSection: (quoteId: string, updatedFields: any) => Promise<void>;
  handleApproveQuotation: (number: string) => Promise<void>;
}

export default function QuoteReviewModal({
  reviewingQuote,
  setReviewingQuote,
  reviewMode,
  setReviewMode,
  reviewerNotes,
  setReviewerNotes,
  features,
  activeProjectDetail,
  getCleanPlanComparisonItems,
  defaultPlanComparisonDeliverables,
  generateSpeshwayEstimationPdfHtml,
  triggerDirectPdfDownload,
  handleSaveQuotationSection,
  handleApproveQuotation
}: QuoteReviewModalProps) {
  if (!reviewingQuote) return null;

  const reviewCompItems = getCleanPlanComparisonItems(reviewingQuote.planComparisonItems || defaultPlanComparisonDeliverables);
  const reviewFeatures = features.filter(f => 
    f.projectId === reviewingQuote.projectId || 
    f.projectId === activeProjectDetail?.id || 
    f.projectName === reviewingQuote.projectName || 
    f.projectName === activeProjectDetail?.name
  );
  const pdfHtmlContent = generateSpeshwayEstimationPdfHtml(activeProjectDetail, reviewingQuote, reviewFeatures);

  return (
    <div className="w-full flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[85vh] animate-in fade-in duration-200">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 shrink-0 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => setReviewingQuote(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors mr-2"
            >
              <ArrowLeft size={14} /> Close Proposal Review
            </button>
            <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 uppercase">
              PDF PROPOSAL DOCUMENT REVIEW
            </span>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
              reviewingQuote.status === "Approved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}>
              Status: {reviewingQuote.status || "Approved"}
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-[#1a0f00] text-xl mt-1.5">
            {reviewingQuote.title || `${reviewingQuote.projectName || "Project"} Proposal Review`}
          </h3>
          <span className="text-xs text-gray-500 block">Sponsor: {reviewingQuote.clientName || "Enterprise Sponsor"} &bull; Document ID: {reviewingQuote.id || reviewingQuote.number}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
            <button
              onClick={() => setReviewMode("exact-pdf")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reviewMode === "exact-pdf" ? "bg-orange-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📄 Live PDF Preview
            </button>
            <button
              onClick={() => setReviewMode("live-editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reviewMode === "live-editor" ? "bg-orange-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📝 Review Notes & Scope
            </button>
          </div>

          <Button
            onClick={() => {
              triggerDirectPdfDownload(pdfHtmlContent, `${(reviewingQuote.number || reviewingQuote.id || "Proposal").replace(/[^a-zA-Z0-9]/gi, "_")}.pdf`);
            }}
            variant="primary" size="sm" className="font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded-xl shadow-sm gap-1.5"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* REVIEW BODY */}
      {reviewMode === "exact-pdf" ? (
        <div className="flex-1 my-4 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative shadow-inner min-h-[600px]">
          <iframe
            srcDoc={pdfHtmlContent}
            className="w-full h-full border-0 bg-white min-h-[600px]"
            title="Quotation PDF Live Document Preview"
          />
        </div>
      ) : (
        <div className="flex-1 my-4 overflow-y-auto space-y-6 pr-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-gray-200">
            <h4 className="font-extrabold text-[#1a0f00] text-xs uppercase mb-2">Reviewer Feedback & Approval Notes</h4>
            <textarea
              rows={6}
              placeholder="Enter internal review notes or client feedback..."
              value={reviewerNotes}
              onChange={e => setReviewerNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-white text-gray-800 focus:outline-none focus:border-orange-500"
            />
            <div className="mt-3 flex justify-end">
              <Button 
                onClick={() => {
                  handleSaveQuotationSection(reviewingQuote.id || reviewingQuote.number, { reviewerNotes, notes: reviewerNotes });
                  alert("Reviewer notes saved successfully!");
                }} 
                variant="primary" size="sm" className="text-xs font-bold py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-sm"
              >
                Save Review Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <div className="pt-3 border-t border-gray-200 shrink-0 flex justify-between items-center">
        <span className="text-[10px] text-gray-500 font-mono">Quotation Proposal Studio &bull; Speshway PDF Generation System</span>
        <Button onClick={() => setReviewingQuote(null)} variant="secondary" className="font-bold py-1.5 px-5 rounded-xl border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs">
          Close Proposal Review
        </Button>
      </div>
    </div>
  );
}
