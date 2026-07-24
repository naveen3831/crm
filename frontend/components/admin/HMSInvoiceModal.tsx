"use client";

import React, { useState } from "react";
import { X, Printer, Download, Plus, Trash2, CheckCircle, FileText, Send, Building2, ShieldCheck, DollarSign } from "lucide-react";
import Button from "../ui/Button";

interface HMSInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: any;
  activeQuotation?: any;
  onSaveInvoice: (invoiceData: any) => Promise<void>;
  triggerDirectPdfDownload: (html: string, filename: string) => void;
}

export default function HMSInvoiceModal({
  isOpen,
  onClose,
  activeProject,
  activeQuotation,
  onSaveInvoice,
  triggerDirectPdfDownload
}: HMSInvoiceModalProps) {
  if (!isOpen) return null;

  const projName = activeProject?.name || activeProject?.title || "HMS Hospital Management System";
  const clientName = activeProject?.clientName || "Healthcare Showcase Client";

  const defaultLineItems = activeQuotation?.serviceItems && activeQuotation.serviceItems.length > 0
    ? activeQuotation.serviceItems.map((item: any) => ({
        description: item.description || item.title || "HMS Module Integration",
        qty: item.qty || 1,
        rate: item.rate || item.price || 25000
      }))
    : [
        { description: "HMS Core Web Portal & Admin Control Workstation", qty: 1, rate: 55000 },
        { description: "Patient iOS & Android Cross-Platform Mobile Application", qty: 1, rate: 45000 },
        { description: "Doctor Ward Rounds Mobile Workstation & EMR Module", qty: 1, rate: 35000 },
        { description: "AWS High-Availability Cloud Server & SSL Setup", qty: 1, rate: 15000 }
      ];

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-HMS-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"Draft" | "Sent" | "Paid" | "Partial" | "Overdue">("Sent");
  const [taxRate, setTaxRate] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(5000);
  const [lineItems, setLineItems] = useState<any[]>(defaultLineItems);
  const [notes, setNotes] = useState(
    "Thank you for partnering with Speshway Solutions. Please remit payment by the due date to ensure continuous cloud service & updates."
  );
  const [isSaving, setIsSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState<"editor" | "pdf_preview">("editor");

  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.qty || 1) * Number(item.rate || 0), 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round((taxableAmount * taxRate) / 100);
  const grandTotal = taxableAmount + taxAmount;

  const handleAddItem = () => {
    setLineItems(prev => [...prev, { description: "New HMS Feature / Module", qty: 1, rate: 10000 }]);
  };

  const handleRemoveItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setLineItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const generateInvoiceHtml = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>TAX INVOICE - ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 40px; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative; overflow: hidden; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
    .brand-title { font-size: 24px; font-weight: 800; color: #1a0f00; letter-spacing: -0.5px; }
    .brand-tagline { font-size: 11px; color: #64748b; font-weight: 500; }
    .invoice-title { font-size: 28px; font-weight: 800; color: #ea580c; text-transform: uppercase; text-align: right; }
    .meta-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
    .meta-box { width: 48%; vertical-align: top; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 4px; }
    .meta-value { font-size: 13px; font-weight: 600; color: #0f172a; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #1a0f00; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 12px; text-align: left; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; }
    .items-table tr:nth-child(even) { background: #f8fafc; }
    .summary-table { width: 50%; margin-left: auto; border-collapse: collapse; }
    .summary-table td { padding: 8px 12px; font-size: 13px; }
    .summary-table .grand-total { background: #fff7ed; border-top: 2px solid #ea580c; font-size: 16px; font-weight: 800; color: #c2410c; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
    .watermark { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 80px; font-weight: 900; color: rgba(234, 88, 12, 0.04); pointer-events: none; text-transform: uppercase; white-space: nowrap; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="watermark">SPESHWAY OFFICIAL</div>
    <div class="header">
      <div>
        <div class="brand-title">SPESHWAY SOLUTIONS</div>
        <div class="brand-tagline">Website & App Development Company | Hyderabad, India</div>
        <div style="font-size: 11px; color: #475569; margin-top: 6px;">
          T-Hub, Knowledge City Rd, Raidurgam, Serilingampalle, Hyderabad 500032<br/>
          GSTIN: 36ABCDE1234F1Z5 | GST Registered Entity
        </div>
      </div>
      <div>
        <div class="invoice-title">OFFICIAL INVOICE</div>
        <div style="text-align: right; margin-top: 6px;">
          <span class="badge">${status}</span>
        </div>
      </div>
    </div>

    <table class="meta-table">
      <tr>
        <td class="meta-box">
          <div class="meta-label">Billed To</div>
          <div class="meta-value">${clientName}</div>
          <div style="font-size: 12px; color: #475569; margin-top: 4px;">
            Project Target: <strong>${projName}</strong><br/>
            Contact: billing@${projName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
          </div>
        </td>
        <td style="width: 4%;"></td>
        <td class="meta-box">
          <div class="meta-label">Invoice Details</div>
          <div style="font-size: 12px; color: #334155;">
            <strong>Invoice No:</strong> ${invoiceNumber}<br/>
            <strong>Issue Date:</strong> ${issueDate}<br/>
            <strong>Due Date:</strong> ${dueDate}<br/>
            <strong>Payment Mode:</strong> Bank Transfer / UPI / Razorpay
          </div>
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Service / Module Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Rate (₹)</th>
          <th style="text-align: right;">Total Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${lineItems.map(item => `
          <tr>
            <td><strong>${item.description}</strong></td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right;">₹${Number(item.rate).toLocaleString('en-IN')}</td>
            <td style="text-align: right;">₹${(Number(item.qty) * Number(item.rate)).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <table class="summary-table">
      <tr>
        <td>Subtotal Amount:</td>
        <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</td>
      </tr>
      ${discount > 0 ? `
      <tr>
        <td style="color: #059669;">Special Discount:</td>
        <td style="text-align: right; color: #059669; font-weight: 600;">- ₹${discount.toLocaleString('en-IN')}</td>
      </tr>
      ` : ''}
      <tr>
        <td>GST Tax (${taxRate}%):</td>
        <td style="text-align: right; font-weight: 600;">+ ₹${taxAmount.toLocaleString('en-IN')}</td>
      </tr>
      <tr class="grand-total">
        <td>Total Payable (INR):</td>
        <td style="text-align: right;">₹${grandTotal.toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <div style="margin-top: 30px; background: #fafafa; border: 1px solid #f1f5f9; border-radius: 8px; padding: 16px;">
      <div style="font-size: 11px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">Bank & Payment Instructions</div>
      <div style="font-size: 11px; color: #475569;">
        Bank Name: <strong>ICICI Bank / HDFC Bank</strong> | Account Name: <strong>Speshway Solutions Pvt Ltd</strong><br/>
        Account No: <strong>50200012345678</strong> | IFSC Code: <strong>HDFC0001234</strong> | UPI ID: <strong>speshway@icici</strong>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">${notes}</p>
      <p style="margin: 0; font-weight: 700;">Speshway Solutions &bull; Official Digital Tax Invoice</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handleSaveAndGenerate = async () => {
    setIsSaving(true);
    try {
      const invoiceData = {
        number: invoiceNumber,
        title: `${projName} Official Tax Invoice`,
        projectId: activeProject.id || activeProject._id,
        projectName: projName,
        clientName: clientName,
        issueDate,
        dueDate,
        status,
        currency: "INR",
        subtotal,
        taxRate,
        taxAmount,
        discount,
        totalAmount: grandTotal,
        lineItems,
        notes,
        paymentTerms: "Net 15 Days"
      };

      await onSaveInvoice(invoiceData);
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error("Error saving HMS invoice:", err);
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    const html = generateInvoiceHtml();
    triggerDirectPdfDownload(html, `${invoiceNumber}_${projName.replace(/[^a-zA-Z0-9]/g, '_')}_Invoice.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-gray-900 to-orange-950 text-white flex items-center justify-between border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 rounded-xl border border-orange-500/30 text-orange-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HMS Global Tax Invoice Studio
                <span className="text-xs bg-orange-500/20 text-orange-300 font-mono px-2 py-0.5 rounded-full border border-orange-500/30">
                  {invoiceNumber}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Project Target: <strong className="text-orange-300">{projName}</strong> &bull; Client: {clientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/10 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setPreviewTab("editor")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewTab === "editor" ? "bg-orange-500 text-white shadow-sm" : "text-gray-300 hover:text-white"}`}
              >
                Line Items & Setup
              </button>
              <button
                onClick={() => setPreviewTab("pdf_preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${previewTab === "pdf_preview" ? "bg-orange-500 text-white shadow-sm" : "text-gray-300 hover:text-white"}`}
              >
                Live Invoice Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {previewTab === "editor" ? (
            <div className="space-y-6">
              
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial Payment</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    HMS Itemized Services & Modules
                  </h3>
                  <button
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Service Line
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Service description"
                          className="w-full px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, "qty", Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-2 py-1.5 text-xs text-center border border-gray-300 rounded-md focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-mono">₹</span>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                            placeholder="Rate"
                            className="w-full pl-6 pr-2 py-1.5 text-xs font-mono border border-gray-300 rounded-md focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="w-32 text-right font-mono text-xs font-bold text-gray-800">
                        ₹{(Number(item.qty || 1) * Number(item.rate || 0)).toLocaleString("en-IN")}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Tax Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Invoice Notes & Payment Instructions</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Subtotal Amount:</span>
                    <span className="font-mono text-sm text-gray-900 font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span className="font-semibold text-emerald-700">Special Discount (₹):</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-32 px-2 py-1 text-xs font-mono text-right border border-gray-300 rounded-md focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span className="font-semibold">GST Rate (%):</span>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs font-mono text-right border border-gray-300 rounded-md focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <span>GST Tax Amount ({taxRate}%):</span>
                    <span className="font-mono font-bold text-gray-800">+ ₹{taxAmount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-orange-500 text-sm font-extrabold text-orange-950">
                    <span>Grand Total Payable:</span>
                    <span className="font-mono text-lg text-orange-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-inner">
              <iframe
                srcDoc={generateInvoiceHtml()}
                className="w-full h-[650px] border-0 rounded-lg"
                title="HMS Live Invoice PDF Preview"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Speshway CRM Invoice Generator &bull; Auto-Syncs with Client Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF Invoice
            </button>

            <button
              onClick={handleSaveAndGenerate}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isSaving ? "Saving Invoice..." : "Save & Sync Global Invoice"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
