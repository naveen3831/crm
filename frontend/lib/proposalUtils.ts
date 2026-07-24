"use client";

import { HMS_PRESETS } from "./HMSPresets";
import { HRMS_PRESETS } from "./HRMSPresets";

export const DEFAULT_PLAN_COMPARISON_DELIVERABLES = [
  { deliverable: "Customer, Merchant & Admin Web Portals", planA: true, planB: true },
  { deliverable: "All Core Marketplace Features", planA: true, planB: true },
  { deliverable: "Secure Payment Gateway (Card / UPI)", planA: true, planB: true },
  { deliverable: "QR Ticket Check-In", planA: true, planB: true },
  { deliverable: "Android & iOS Mobile Apps", planA: false, planB: true },
  { deliverable: "Push Notifications", planA: false, planB: true },
  { deliverable: "App Store / Play Store Publishing", planA: false, planB: true }
];

export const isPdfBinaryNoise = (str: string): boolean => {
  if (!str) return true;
  const s = str.trim();
  if (s.startsWith("%PDF") || s.startsWith("%") || s.startsWith("<<") || s.startsWith(">>") || s.includes("obj") || s.includes("endobj")) return true;
  if (/^\/[A-Z][a-zA-Z0-9_]*/.test(s)) return true;
  if (/^\d+\s+\d+\s+obj/i.test(s) || /0\s+obj/i.test(s)) return true;
  if (s.includes("Mozilla/5.0") || s.includes("AppleWebKit") || s.includes("Skia/PDF") || s.includes("CreationDate")) return true;
  return false;
};

export const sanitizeTextContent = (text: string, defaultFallback: string = ""): string => {
  if (!text || typeof text !== "string") return defaultFallback;
  const hasGarbage = text.includes("\uFFFD") || text.includes("FlateDecode") || text.includes("endstream") || text.includes("endobj") || text.includes("Mozilla/5.0") || text.includes("AppleWebKit") || /\/Font|\/BBox|\/StructParents|\/MediaBox/.test(text);
  if (hasGarbage || isPdfBinaryNoise(text)) return defaultFallback;
  return text.trim();
};

export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return "Indian Rupees Zero Only";
  const num = Math.round(Math.abs(amount));

  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertTwoDigits(n: number): string {
    if (n < 20) return singleDigits[n];
    const ten = Math.floor(n / 10);
    const rest = n % 10;
    return `${tens[ten]} ${singleDigits[rest]}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (hundred > 0) res += `${singleDigits[hundred]} Hundred `;
    if (rest > 0) res += convertTwoDigits(rest);
    return res.trim();
  }

  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  let words = "";
  if (crore > 0) words += `${convertTwoDigits(crore)} Crore `;
  if (lakh > 0) words += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand > 0) words += `${convertTwoDigits(thousand)} Thousand `;
  if (remainder > 0) words += convertThreeDigits(remainder);

  return `Indian Rupees ${words.trim()} Only`;
}

export const getCleanPlanComparisonItems = (items: any): any[] => {
  if (!Array.isArray(items) || items.length === 0) return DEFAULT_PLAN_COMPARISON_DELIVERABLES;
  const cleaned = items.filter((item: any) => {
    if (!item) return false;
    const title = typeof item === "string" ? item : (item.deliverable || item.name || item.title || "");
    return title && !isPdfBinaryNoise(title);
  }).map((item: any) => {
    if (typeof item === "string") {
      return { deliverable: item, planA: true, planB: true };
    }
    return {
      deliverable: item.deliverable || item.name || item.title || "Feature Deliverable",
      planA: item.planA !== undefined ? Boolean(item.planA) : true,
      planB: item.planB !== undefined ? Boolean(item.planB) : true
    };
  });
  return cleaned.length > 0 ? cleaned : DEFAULT_PLAN_COMPARISON_DELIVERABLES;
};

export function getProjectTailoredPreset(project: any, variantKey: "website" | "website_app" | "app") {
  const projName = project?.name || project?.title || "Project Workspace";
  const cat = project?.category || "Web Application";
  const desc = project?.description || `End-to-end custom development of the ${projName} enterprise platform.`;

  const isHRMS = projName.toLowerCase().includes("hrms") || projName.toLowerCase().includes("human resource");
  const isHMS = projName.toLowerCase().includes("hms") || projName.toLowerCase().includes("hospital");

  if (isHRMS && HRMS_PRESETS[variantKey]) return HRMS_PRESETS[variantKey];
  if (isHMS && HMS_PRESETS[variantKey]) return HMS_PRESETS[variantKey];

  const isApp = variantKey === "app";
  const isHybrid = variantKey === "website_app";
  const categoryName = isApp ? "Mobile Application" : (isHybrid ? "Web & Mobile Ecosystem" : cat);

  let overviewNarrative = `This proposal outlines the end-to-end technical scope, architecture, and commercial investment for ${projName}. Designed specifically for modern operations, this platform provides centralized management, automated workflows, secure user access, and real-time reporting. ${desc}`;

  let userRoles = [
    { role: `${projName} Primary User`, count: "Unlimited", description: `Primary end-user portal access for ${projName}.`, permissions: "End-User Access" },
    { role: `${projName} Operator / Manager`, count: "2 - 10", description: `Operational control workstation for ${projName} management.`, permissions: "Operations Control" },
    { role: "Super Admin", count: "1 - 3", description: `Full system governance, audit logs, and global configuration for ${projName}.`, permissions: "Super Admin Governance" }
  ];

  let serviceItems = [
    { description: `${projName} Core Web Portal & Admin Control Workstation`, qty: 1, rate: 55000 },
    { description: `${projName} User Operations & Workflow Engine`, qty: 1, rate: 35000 },
    { description: "AWS High-Availability Cloud Server, Security & SSL Binding", qty: 1, rate: 15000 }
  ];

  if (projName.toLowerCase().includes("event") || cat.toLowerCase().includes("event")) {
    overviewNarrative = `This proposal covers the complete end-to-end development of the ${projName} Event Management Suite. Tailored for event organizers, ticketing agencies, and attendees, this platform features digital event publishing, live ticket booking, QR code entry check-in, organizer commission ledgers, automated email/SMS notifications, and real-time attendance analytics.`;
    userRoles = [
      { role: "Event Attendee / Customer", count: "Unlimited", description: "Browse upcoming events, purchase tickets online, download QR pass, and manage bookings.", permissions: "Customer Access" },
      { role: "Event Organizer / Host", count: "10 - 50+", description: "Create events, configure ticket tiers, track real-time sales, and scan QR tickets at venues.", permissions: "Organizer Workstation" },
      { role: "Super Admin Governance", count: "1 - 3", description: "Global platform administration, commission split settings, payout approvals, and audit logs.", permissions: "Super Admin Control" }
    ];
    serviceItems = [
      { description: `${projName} Event Portal & Online Ticket Booking Engine`, qty: 1, rate: 50000 },
      { description: `${projName} Organizer Dashboard & QR Code Ticket Scanner Engine`, qty: 1, rate: 35000 },
      { description: "Payment Gateway Integration (Razorpay / Stripe / UPI)", qty: 1, rate: 15000 },
      { description: "AWS Cloud Infrastructure & Email/SMS Ticket Dispatch Setup", qty: 1, rate: 10000 }
    ];
  } else if (isApp) {
    serviceItems = [
      { description: `${projName} Native Mobile Application Suite (iOS & Android)`, qty: 1, rate: 55000 },
      { description: `${projName} Real-Time Push Alerts & Mobile REST API Backend`, qty: 1, rate: 20000 },
      { description: "Apple App Store & Google Play Store Publishing & SLA Setup", qty: 1, rate: 15000 }
    ];
  } else if (isHybrid) {
    serviceItems = [
      { description: `${projName} High-Performance Web Portal & Admin Workstation`, qty: 1, rate: 55000 },
      { description: `${projName} iOS & Android Cross-Platform Mobile Applications`, qty: 1, rate: 45000 },
      { description: `${projName} Real-Time Analytics & Cloud REST API Backend`, qty: 1, rate: 25000 },
      { description: "AWS Cloud Infrastructure, SSL Setup & Store Deployment", qty: 1, rate: 15000 }
    ];
  }

  const paymentTerms = `### 💳 ${projName} Payment Milestones
- **Milestone 1 (30%)**: Project Kickoff, System Architecture Blueprint & DB Schema Setup.
- **Milestone 2 (30%)**: Delivery of Core Modules (${projName} Portal & Primary Workstations).
- **Milestone 3 (30%)**: Delivery of Advanced Features & Payment / Notification Gateways.
- **Milestone 4 (10%)**: Final User Acceptance Testing (UAT), Staff Training & Cloud Production Launch.`;

  return {
    category: categoryName,
    overviewNarrative,
    rolesMatrix: userRoles,
    serviceItems,
    paymentTerms,
    customerDesc: `### 🌐 ${projName} Primary User Portal\n- End-user portal & dashboard.\n- Real-time interaction & booking engine.\n- Secure checkout & digital document vault.`,
    merchantDesc: `### 🩺 ${projName} Operational Workstation\n- Operations manager control panel.\n- Workflow automation & status tracking.\n- Analytics board & exports.`,
    adminDesc: `### 🏢 ${projName} Super Admin Control\n- Global system governance.\n- User role permissions & security audit trail.\n- High availability cloud infrastructure.`,
    planAPrice: isApp ? 55000 : (isHybrid ? 110000 : 55000),
    planBPrice: isApp ? 85000 : (isHybrid ? 165000 : 95000),
    planCPrice: isApp ? 145000 : (isHybrid ? 260000 : 160000),
    planComparisonItems: [
      { deliverable: `${projName} Web & Mobile User Workstation`, planA: true, planB: true },
      { deliverable: `${projName} Core Workflow Engine`, planA: true, planB: true },
      { deliverable: `Payment Gateway & Notification Dispatch`, planA: true, planB: true },
      { deliverable: `Native iOS & Android Mobile Apps`, planA: isApp || isHybrid, planB: true },
      { deliverable: `Cloud Infrastructure & Store SLA`, planA: true, planB: true }
    ],
    termsAndConditions: `### 📄 Standard Terms & Conditions\n1. **Source Code**: Speshway Solutions transfers full source code ownership upon final invoice settlement.\n2. **Support**: Includes 90 days complimentary bug-fix support.\n3. **Hosting**: Deployed on client cloud servers (AWS / Vercel / DigitalOcean).`,
    companyDetailsDoc: `### 🏢 Speshway Solutions\n- **Company Name**: Speshway Solutions\n- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020\n- **Address**: T-Hub, Knowledge City, Hyderabad, India.`
  };
}

export const triggerDirectPdfDownload = (htmlBody: string, fileName: string) => {
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
