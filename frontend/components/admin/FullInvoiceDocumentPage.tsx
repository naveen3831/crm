"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Edit3, 
  Sliders, 
  Palette, 
  RotateCw, 
  Upload, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Building2, 
  CheckCircle, 
  Eye, 
  FileText, 
  Receipt,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Button from "../ui/Button";
import { numberToIndianWords, triggerDirectPdfDownload } from "@/lib/proposalUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// 2-Color Gradient Presets
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

// Background paper options
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

interface FullInvoiceDocumentPageProps {
  projectId: string;
  invoiceId: string;
}

export default function FullInvoiceDocumentPage({ projectId, invoiceId }: FullInvoiceDocumentPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewZoom, setPreviewZoom] = useState<number>(0.95);
  const [showControlsDrawer, setShowControlsDrawer] = useState(true);

  // Live Customizable Settings
  const [invColorTheme, setInvColorTheme] = useState<string>("#c2410c");
  const [invColorTheme2, setInvColorTheme2] = useState<string>("#f97316");
  const [invEnableDualGradient, setInvEnableDualGradient] = useState<boolean>(true);
  const [invCompanyLogo, setInvCompanyLogo] = useState<string>("");
  const [invBgTheme, setInvBgTheme] = useState<string>("clean-white");
  const [invFooterCompanyName, setInvFooterCompanyName] = useState<string>("Speshway Solutions Private Limited");
  const [invFooterAddress, setInvFooterAddress] = useState<string>("T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
  const [invFooterColor, setInvFooterColor] = useState<string>("#334155");
  const [invWatermarkType, setInvWatermarkType] = useState<"both" | "logo" | "text" | "none">("both");
  const [invWatermarkText, setInvWatermarkText] = useState<string>("SPESHWAY SOLUTIONS PRIVATE LIMITED");
  const [invWatermarkOpacity, setInvWatermarkOpacity] = useState<number>(0.25);
  const [invWatermarkRotation, setInvWatermarkRotation] = useState<number>(-25);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Load project info
      try {
        const projRes = await fetch(`${API_URL}/crm/our-projects`);
        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.data)) {
          const currentProj = projData.data.find((p: any) => p && (p.id === projectId || getSafeStr(p.name).toLowerCase() === String(projectId).toLowerCase()));
          if (currentProj) setProject(currentProj);
        }
      } catch (err) {
        console.error("Error loading project info:", err);
      }

      // 2. Load Invoice info
      let foundInv = null;
      try {
        const invRes = await fetch(`${API_URL}/crm/invoice/${invoiceId}`);
        const invData = await invRes.json();
        if (invData.success && invData.data) {
          foundInv = invData.data;
        }
      } catch (err) {
        console.error("Error loading invoice by id:", err);
      }

      if (!foundInv) {
        // Fallback fetch all invoices
        try {
          const invRes = await fetch(`${API_URL}/crm/invoice`);
          const invData = await invRes.json();
          if (invData.success && Array.isArray(invData.data)) {
            foundInv = invData.data.find((i: any) => i && (i.id === invoiceId || i.number === invoiceId));
          }
        } catch (err) {
          console.error("Error loading all invoices:", err);
        }
      }

      if (!foundInv) {
        // Construct fallback default invoice
        foundInv = {
          id: invoiceId,
          number: invoiceId,
          projectId: projectId,
          projectName: project?.name || "HMS System",
          productName: project?.name || "HMS System",
          clientName: "Hyper Mobility Services",
          billedByCompany: "Speshway Solutions Private Limited",
          billedBySub: "Software Development Company",
          title: `Tax Invoice for ${project?.name || "HMS System"}`,
          projectType: "Web & Mobile Ecosystem",
          amount: 170000,
          taxRate: 18,
          issuedDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          colorTheme: "#c2410c",
          colorTheme2: "#f97316",
          enableDualGradient: true,
          watermarkType: "both",
          watermarkText: "SPESHWAY SOLUTIONS PRIVATE LIMITED",
          watermarkOpacity: 0.25,
          watermarkRotation: -25,
          footerCompanyName: "Speshway Solutions Private Limited",
          footerAddress: "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com",
          footerColor: "#334155",
          serviceItems: [
            { description: "Full Web & Mobile Application Development Scope Deliverables", qty: 1, rate: 170000 }
          ]
        };
      }

      setInvoice(foundInv);

      // Populate Live Controls
      setInvColorTheme(getSafeStr(foundInv.colorTheme, "#c2410c"));
      setInvColorTheme2(getSafeStr(foundInv.colorTheme2, "#f97316"));
      setInvEnableDualGradient(foundInv.enableDualGradient !== false);
      setInvCompanyLogo(getSafeStr(foundInv.companyLogoUrl || foundInv.logoUrl));
      setInvBgTheme(getSafeStr(foundInv.bgTheme, "clean-white"));
      setInvFooterCompanyName(getSafeStr(foundInv.footerCompanyName, foundInv.billedByCompany || "Speshway Solutions Private Limited"));
      setInvFooterAddress(getSafeStr(foundInv.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com"));
      setInvFooterColor(getSafeStr(foundInv.footerColor, "#334155"));
      setInvWatermarkType((foundInv.watermarkType || "both") as any);
      setInvWatermarkText(getSafeStr(foundInv.watermarkText, foundInv.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED"));
      setInvWatermarkOpacity(foundInv.watermarkOpacity !== undefined ? Number(foundInv.watermarkOpacity) : 0.25);
      setInvWatermarkRotation(foundInv.watermarkRotation !== undefined ? Number(foundInv.watermarkRotation) : -25);

    } catch (err) {
      console.error("Error initializing invoice full page:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, invoiceId]);

  // Persist Changes live to DB
  const handleSaveLiveChanges = async () => {
    if (!invoice) return;

    const updatedPayload = {
      ...invoice,
      colorTheme: invColorTheme,
      colorTheme2: invColorTheme2,
      enableDualGradient: invEnableDualGradient,
      companyLogoUrl: invCompanyLogo,
      logoUrl: invCompanyLogo,
      bgTheme: invBgTheme,
      footerCompanyName: invFooterCompanyName,
      footerAddress: invFooterAddress,
      footerColor: invFooterColor,
      watermarkType: invWatermarkType,
      watermarkText: invWatermarkText,
      watermarkOpacity: invWatermarkOpacity,
      watermarkRotation: invWatermarkRotation
    };

    try {
      const endpoint = `${API_URL}/crm/invoice/${encodeURIComponent(invoiceId)}`;
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
      });
      setInvoice(updatedPayload);
      alert("Invoice document customization saved successfully to database!");
    } catch (err) {
      console.error("Error saving live changes:", err);
      setInvoice(updatedPayload);
      alert("Changes updated locally!");
    }
  };

  // PDF Exporter
  const handleDownloadPdf = () => {
    if (!invoice) return;
    const currentDraft = {
      ...invoice,
      colorTheme: invColorTheme,
      colorTheme2: invColorTheme2,
      enableDualGradient: invEnableDualGradient,
      companyLogoUrl: invCompanyLogo,
      logoUrl: invCompanyLogo,
      bgTheme: invBgTheme,
      footerCompanyName: invFooterCompanyName,
      footerAddress: invFooterAddress,
      footerColor: invFooterColor,
      watermarkType: invWatermarkType,
      watermarkText: invWatermarkText,
      watermarkOpacity: invWatermarkOpacity,
      watermarkRotation: invWatermarkRotation
    };

    const themeColor1 = getSafeStr(currentDraft.colorTheme, "#c2410c");
    const themeColor2 = getSafeStr(currentDraft.colorTheme2, "#f97316");
    const isDual = currentDraft.enableDualGradient !== false && Boolean(themeColor2);
    const headerBgStyle = isDual ? `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)` : themeColor1;

    const logoUrl = getSafeStr(currentDraft.companyLogoUrl || currentDraft.logoUrl);
    const footerCompanyNameStr = getSafeStr(currentDraft.footerCompanyName, currentDraft.billedByCompany || "Speshway Solutions Private Limited");
    const footerAddressStr = getSafeStr(currentDraft.footerAddress, "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, panmaktha, Hyderabad, Serilingampalle (M), Telangana 500032 www.speshway.com • info@speshway.com");
    const footerTextColor = getSafeStr(currentDraft.footerColor, "#334155");

    const watermarkType = currentDraft.watermarkType || "both";
    const watermarkText = getSafeStr(currentDraft.watermarkText, currentDraft.billedByCompany || "SPESHWAY SOLUTIONS PRIVATE LIMITED");
    const watermarkOpacity = currentDraft.watermarkOpacity !== undefined ? Number(currentDraft.watermarkOpacity) : 0.25;
    const watermarkRotation = currentDraft.watermarkRotation !== undefined ? Number(currentDraft.watermarkRotation) : -25;

    const selectedBgObj = INVOICE_BG_THEMES.find(t => t.id === currentDraft.bgTheme) || INVOICE_BG_THEMES[0];
    const bgCss = selectedBgObj.bgCss;
    
    const items = Array.isArray(currentDraft.serviceItems) && currentDraft.serviceItems.length > 0 ? currentDraft.serviceItems : [
      { 
        description: getSafeStr(currentDraft.title, "Scope Deliverables"),
        qty: 1, 
        rate: Number(currentDraft.amount || 170000)
      }
    ];
    
    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) * Number(item.rate || 0)), 0);
    const taxRate = currentDraft.taxRate !== undefined ? Number(currentDraft.taxRate) : 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalDue = subtotal + taxAmount;
    const amountInWords = numberToIndianWords(totalDue);
    const invNumber = getSafeStr(currentDraft.number || currentDraft.id, invoiceId);
    const invDateStr = currentDraft.issuedDate ? new Date(currentDraft.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "09 July, 2026";
    const clientName = getSafeStr(currentDraft.clientName || project?.clientName, "Hyper Mobility Services");
    const productName = getSafeStr(currentDraft.productName || project?.name, "HMS System");

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
        ${renderWatermarkHtml()}
        <div style="position: relative; z-index: 1;">
          <div style="background: ${headerBgStyle}; color: #ffffff; padding: 22px 35px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 16px;">
              ${logoHtml}
              <div style="margin-left: 4px;">
                <h1 style="margin: 0; font-size: 16px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #ffffff; line-height: 1.3;">
                  ${getSafeStr(currentDraft.billedByCompany, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}
                </h1>
                <p style="margin: 3px 0 0 0; font-size: 10.5px; color: rgba(255, 255, 255, 0.90); font-weight: 500; letter-spacing: 0.3px;">
                  ${getSafeStr(currentDraft.billedBySub, 'Software Development Company • IT Solutions')}
                </p>
              </div>
            </div>
          </div>

          <div style="padding: 28px 35px 35px 35px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
              <div>
                <h2 style="margin: 0; font-size: 22px; color: ${themeColor1}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">TAX INVOICE</h2>
              </div>
              <div style="text-align: right; font-size: 12px; line-height: 1.6;">
                <div style="color: #64748b;">Invoice No: <strong style="color: #0f172a; font-weight: 700;">${invNumber}</strong></div>
                <div style="color: #64748b;">Date: <strong style="color: #0f172a; font-weight: 700;">${invDateStr}</strong></div>
              </div>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
              <div style="flex: 1; background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 14px 18px;">
                <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">BILLED BY</span>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${getSafeStr(currentDraft.billedByCompany, 'Speshway Solutions Private Limited')}</h4>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #475569;">${getSafeStr(currentDraft.billedBySub, 'Software Development Company')}</p>
              </div>
              <div style="flex: 1; background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 14px 18px;">
                <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">BILLED TO</span>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${clientName}</h4>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #475569;">Product: ${productName}</p>
              </div>
            </div>

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

            <div style="background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-left: 4px solid ${themeColor1}; padding: 12px 16px; border-radius: 4px; font-size: 11px; margin-bottom: 25px; color: #334155;">
              <strong>Amount in Words:</strong> ${amountInWords}
            </div>

            <div style="background: #ffffff; border: 1px solid ${selectedBgObj.borderCss}; border-radius: 8px; padding: 16px 20px; font-size: 11px;">
              <span style="font-size: 10px; font-weight: 800; color: ${themeColor1}; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">BANK DETAILS FOR PAYMENT</span>
              <div style="display: flex; gap: 40px;">
                <div style="flex: 1.2;">
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">ACCOUNT NAME</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px; margin-bottom: 10px;">${getSafeStr(currentDraft.bankAccName, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}</div>
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">ACCOUNT NUMBER</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${getSafeStr(currentDraft.bankAccNo, '018326900000850')}</div>
                </div>
                <div style="flex: 1;">
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">BRANCH</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px; margin-bottom: 10px;">${getSafeStr(currentDraft.bankBranch, 'HITECH CITY')}</div>
                  <div style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">IFSC CODE</div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${getSafeStr(currentDraft.bankIfsc, 'YESB0000183')}</div>
                </div>
              </div>
            </div>

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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400">Loading Full Page Standalone Invoice Workspace...</p>
      </div>
    );
  }

  const selectedBgObj = INVOICE_BG_THEMES.find(t => t.id === invBgTheme) || INVOICE_BG_THEMES[0];
  const pBgCss = selectedBgObj.bgCss;
  const pIsDual = invEnableDualGradient && Boolean(invColorTheme2);
  const pHeaderBgStyle = pIsDual ? `linear-gradient(135deg, ${invColorTheme} 0%, ${invColorTheme2} 100%)` : invColorTheme;

  const invNumber = getSafeStr(invoice?.number || invoice?.id, invoiceId);
  const invDateStr = invoice?.issuedDate ? new Date(invoice.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "09 July, 2026";
  const clientName = getSafeStr(invoice?.clientName || project?.clientName, "Hyper Mobility Services");
  const productName = getSafeStr(invoice?.productName || project?.name, "HMS System");

  const items = Array.isArray(invoice?.serviceItems) && invoice.serviceItems.length > 0 ? invoice.serviceItems : [
    { description: getSafeStr(invoice?.title, "Scope Deliverables"), qty: 1, rate: Number(invoice?.amount || 170000) }
  ];

  const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) * Number(item.rate || 0)), 0);
  const taxRate = invoice?.taxRate !== undefined ? Number(invoice.taxRate) : 18;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalDue = subtotal + taxAmount;
  const amountInWords = numberToIndianWords(totalDue);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* FULL PAGE NAVIGATION BAR */}
      <div className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0 z-30 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/our-projects/${projectId}/proposals`)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Back to Workspace</span>
          </button>
          
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Receipt className="text-orange-500 w-5 h-5" />
            <h1 className="font-heading font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
              <span>Full Page Invoice Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {invNumber}
              </span>
            </h1>
          </div>
        </div>

        {/* TOP TOOLBAR & ZOOM ACTIONS */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowControlsDrawer(!showControlsDrawer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              showControlsDrawer 
                ? "bg-orange-600 text-white border-orange-500 shadow-md" 
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Sliders size={14} />
            <span>{showControlsDrawer ? "Hide Customizer Panel" : "Show Customizer Panel"}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPreviewZoom(prev => Math.max(0.4, Number((prev - 0.08).toFixed(2))))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-orange-400 font-mono font-bold text-xs px-1 min-w-10 text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              onClick={() => setPreviewZoom(prev => Math.min(1.5, Number((prev + 0.08).toFixed(2))))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <Button
            onClick={handleSaveLiveChanges}
            variant="secondary"
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs gap-1.5 py-2 border-slate-700"
          >
            <CheckCircle size={14} className="text-green-400" /> Save Config
          </Button>

          <Button
            onClick={handleDownloadPdf}
            variant="primary"
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs gap-1.5 py-2 shadow-lg shadow-orange-500/20"
          >
            <Download size={14} /> Download PDF
          </Button>
        </div>
      </div>

      {/* MAIN VIEWPORT BODY (SPLIT CUSTOMIZER PANEL & FULL A4 CANVAS) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT COMPREHENSIVE CUSTOMIZER PANEL */}
        {showControlsDrawer && (
          <div className="w-80 md:w-96 bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto shrink-0 space-y-5 text-xs z-20 shadow-2xl animate-in slide-in-from-left duration-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="font-heading font-extrabold text-white text-sm flex items-center gap-2">
                <Palette size={16} className="text-orange-500" />
                <span>Document Customizer Panel</span>
              </span>
              <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">
                Live Real-Time
              </span>
            </div>

            {/* 1. DUAL COLOR GRADIENT PRESETS */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                2-Color Dual Gradient Themes
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DUAL_COLOR_PRESETS.map((preset) => {
                  const isSelected = invEnableDualGradient && invColorTheme === preset.c1 && invColorTheme2 === preset.c2;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setInvColorTheme(preset.c1);
                        setInvColorTheme2(preset.c2);
                        setInvEnableDualGradient(true);
                      }}
                      className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                        isSelected ? "border-orange-500 bg-slate-800 shadow-md ring-1 ring-orange-500" : "border-slate-800 bg-slate-950/60 hover:bg-slate-800"
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

              {/* CUSTOM 2 COLOR PICKERS */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <input
                    type="color"
                    value={invColorTheme}
                    onChange={(e) => setInvColorTheme(e.target.value)}
                    className="w-5 h-5 cursor-pointer rounded border-0 p-0"
                  />
                  <div className="truncate">
                    <span className="block text-[9px] font-bold text-slate-400">Color 1</span>
                    <span className="font-mono text-[10px] font-bold text-white">{invColorTheme}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <input
                    type="color"
                    value={invColorTheme2}
                    onChange={(e) => setInvColorTheme2(e.target.value)}
                    className="w-5 h-5 cursor-pointer rounded border-0 p-0"
                  />
                  <div className="truncate">
                    <span className="block text-[9px] font-bold text-slate-400">Color 2</span>
                    <span className="font-mono text-[10px] font-bold text-white">{invColorTheme2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LOGO UPLOAD & PAPER THEME */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Upload size={14} className="text-orange-500" />
                <span>Company Logo & Paper Theme</span>
              </label>

              <div>
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                  <Upload size={14} className="text-orange-500" />
                  <span>{invCompanyLogo ? "Change Logo File" : "Upload Company Logo"}</span>
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
                  <div className="flex items-center justify-between mt-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <img src={invCompanyLogo} alt="Logo" className="h-6 max-w-[100px] object-contain" />
                    <button onClick={() => setInvCompanyLogo("")} className="text-[10px] text-red-400 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Paper Theme</label>
                <select
                  value={invBgTheme}
                  onChange={(e) => setInvBgTheme(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
                >
                  {INVOICE_BG_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. WATERMARK CONTROLS */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-orange-500" />
                <span>Watermark, Opacity & Rotation</span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setInvWatermarkType("both")}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                    invWatermarkType === "both" ? "bg-orange-600 text-white border-orange-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🏢+📝 Logo & Name
                </button>
                <button
                  onClick={() => setInvWatermarkType("logo")}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                    invWatermarkType === "logo" ? "bg-orange-600 text-white border-orange-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🏢 Logo Only
                </button>
                <button
                  onClick={() => setInvWatermarkType("text")}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                    invWatermarkType === "text" ? "bg-orange-600 text-white border-orange-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  📝 Name Only
                </button>
                <button
                  onClick={() => setInvWatermarkType("none")}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                    invWatermarkType === "none" ? "bg-red-600 text-white border-red-500" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  🚫 None
                </button>
              </div>

              {invWatermarkType !== "none" && (
                <>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Contrast Opacity</span>
                      <span className="text-orange-400 font-mono">{Math.round(invWatermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.90"
                      step="0.01"
                      value={invWatermarkOpacity}
                      onChange={(e) => setInvWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Rotation Angle</span>
                      <span className="text-orange-400 font-mono">{invWatermarkRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="5"
                      value={invWatermarkRotation}
                      onChange={(e) => setInvWatermarkRotation(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            {/* 4. FOOTER BRAND NAME & ADDRESS */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-orange-500" />
                <span>Footer Brand & Color</span>
              </label>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Footer Brand Name</label>
                <input
                  type="text"
                  value={invFooterCompanyName}
                  onChange={(e) => setInvFooterCompanyName(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Footer Text Color</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {FOOTER_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setInvFooterColor(preset.hex)}
                      className={`w-5 h-5 rounded-md border ${invFooterColor === preset.hex ? "ring-2 ring-orange-400 scale-110 border-white" : "border-slate-800"}`}
                      style={{ backgroundColor: preset.hex }}
                    />
                  ))}
                  <input
                    type="color"
                    value={invFooterColor}
                    onChange={(e) => setInvFooterColor(e.target.value)}
                    className="w-5 h-5 cursor-pointer rounded border-0 p-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Footer Address Text</label>
                <textarea
                  rows={2}
                  value={invFooterAddress}
                  onChange={(e) => setInvFooterAddress(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-medium text-white outline-none leading-relaxed"
                />
              </div>
            </div>

          </div>
        )}

        {/* RIGHT MAIN FULL A4 DOCUMENT CANVAS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-950 flex justify-center items-start">
          <div 
            className="w-full max-w-[800px] rounded-xl shadow-2xl border overflow-hidden text-slate-800 text-xs transition-all duration-200 relative shrink-0"
            style={{ 
              background: pBgCss.includes('gradient') ? pBgCss : pBgCss,
              borderColor: selectedBgObj.borderCss,
              transform: `scale(${previewZoom})`,
              transformOrigin: "top center",
              marginBottom: previewZoom < 1 ? `-${(1 - previewZoom) * 950}px` : "20px"
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
                        className="max-w-[280px] max-h-[280px] object-contain drop-shadow-md"
                      />
                    ) : (
                      <div style={{ opacity: invWatermarkOpacity, color: invColorTheme }} className="text-[130px] font-extrabold">
                        🏢
                      </div>
                    )}
                    <div 
                      style={{ opacity: invWatermarkOpacity, color: invColorTheme }}
                      className="text-xl md:text-2xl font-black uppercase tracking-widest max-w-[580px]"
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
                      className="max-w-[400px] max-h-[400px] object-contain select-none drop-shadow-md"
                    />
                  ) : (
                    <div 
                      style={{ opacity: invWatermarkOpacity, color: invColorTheme, transform: `rotate(${invWatermarkRotation}deg)` }}
                      className="text-[160px] font-extrabold select-none"
                    >
                      🏢
                    </div>
                  )
                ) : (
                  <div 
                    style={{ opacity: invWatermarkOpacity, color: invColorTheme, transform: `rotate(${invWatermarkRotation}deg)` }}
                    className="text-2xl md:text-3xl font-black text-center uppercase tracking-widest max-w-[650px] select-none p-4"
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
                      className="h-11 max-w-[130px] object-contain rounded-lg bg-white p-1 shadow-md"
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-2.5 flex items-center justify-center shadow-md">
                      <Building2 className="w-6 h-6" style={{ color: invColorTheme }} />
                    </div>
                  )}
                  <div>
                    <h1 className="font-extrabold text-base uppercase tracking-wider text-white leading-tight">
                      {getSafeStr(invoice?.billedByCompany, "SPESHWAY SOLUTIONS PRIVATE LIMITED")}
                    </h1>
                    <p className="text-[10px] text-white/90 font-medium mt-1 tracking-wide">
                      {getSafeStr(invoice?.billedBySub, "Software Development Company • IT Solutions")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">

                {/* TITLE & INVOICE NO / DATE */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="font-extrabold text-2xl uppercase tracking-tight" style={{ color: invColorTheme }}>
                      TAX INVOICE
                    </h2>
                  </div>
                  <div className="text-right text-gray-500 leading-relaxed text-xs">
                    <div>Invoice No: <strong className="text-slate-900 font-mono font-bold">{invNumber}</strong></div>
                    <div>Date: <strong className="text-slate-900 font-bold">{invDateStr}</strong></div>
                  </div>
                </div>

                {/* BILLED BY & BILLED TO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: invColorTheme }}>
                      BILLED BY
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {getSafeStr(invoice?.billedByCompany, "Speshway Solutions Private Limited")}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {getSafeStr(invoice?.billedBySub, "Software Development Company")}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: invColorTheme }}>
                      BILLED TO
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {clientName}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Product: {productName}
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
                      {items.map((it: any, idx: number) => {
                        const lineRate = Number(it.rate || 0);
                        const lineAmount = Number(it.qty || 1) * lineRate;
                        const titleStr = getSafeStr(it.title || it.description, `${productName} Scope Deliverables`);
                        const descStr = getSafeStr(it.details || it.description, `Custom software development for ${clientName}`);
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
                      <span className="font-mono font-bold text-slate-900">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-200">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-mono font-bold text-slate-900">₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm pt-1" style={{ color: invColorTheme }}>
                      <span>Total Due</span>
                      <span className="font-mono">₹ {totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* AMOUNT IN WORDS BANNER */}
                <div className="bg-white border border-gray-200 border-l-4 p-3.5 rounded-lg text-xs text-slate-700 shadow-xs" style={{ borderLeftColor: invColorTheme }}>
                  <strong className="text-slate-900">Amount in Words:</strong> {amountInWords}
                </div>

                {/* BANK DETAILS BOX */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: invColorTheme }}>
                    BANK DETAILS FOR PAYMENT
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">ACCOUNT NAME</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(invoice?.bankAccName, 'SPESHWAY SOLUTIONS PRIVATE LIMITED')}</div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase mt-2">ACCOUNT NUMBER</div>
                      <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(invoice?.bankAccNo, '018326900000850')}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">BRANCH</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{getSafeStr(invoice?.bankBranch, 'HITECH CITY')}</div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase mt-2">IFSC CODE</div>
                      <div className="font-mono font-extrabold text-slate-900 mt-0.5">{getSafeStr(invoice?.bankIfsc, 'YESB0000183')}</div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC FOOTER BRAND NAME, ADDRESS & CUSTOM FOOTER COLOR */}
                <div className="pt-6 border-t border-gray-200 text-center text-[10px] leading-relaxed" style={{ color: invFooterColor }}>
                  <strong className="font-extrabold text-[11px]" style={{ color: invFooterColor }}>{invFooterCompanyName}</strong><br/>
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
