# Speshway CRM — Project Categories, Branding & Color Palette Guide

This reference document contains the complete branding setup, color palettes (hex codes), project category names, taglines, and specialized technical features for the CRM Quotation System.

---

## 🏠 0. Main Home Page & Dashboard Color Palette

| Color Element | Hex Code | Tailwind Token | Visual Description & Application |
| :--- | :--- | :--- | :--- |
| **Primary Brand Dark** | `#1a0f00` | `navy-950` / `text-[#1a0f00]` | Warm Dark Espresso / Obsidian. Main hero titles, dark sidebar & headings. |
| **Primary Brand Orange** | `#f97316` | `orange-500` / `bg-orange-500` | Signature Speshway Orange. CTA buttons, active state highlights & main logo icon. |
| **Sunset Orange Accent** | `#ea580c` | `orange-600` / `bg-orange-600` | Deep Sunset Orange. Hover states, active buttons & PDF proposal accents. |
| **Warm Amber / Gold** | `#f59e0b` | `amber-500` / `bg-amber-500` | Recommended badges, feature star icons & warning chips. |
| **Page Background** | `#f9fafb` | `bg-gray-50` | Soft warm neutral canvas background. |
| **Glass Card Background** | `#ffffff` | `bg-white/70` | Pure white glass cards with soft drop shadows (`shadow-sm`). |

### 🟢 Status & Pipeline Color Indicators
- **Approved / Active / Won**: `#27C15A` (`bg-green-50 text-green-700 border-green-200`)
- **Pending / Follow-up**: `#FF9F0A` (`bg-amber-50 text-amber-700 border-amber-200`)
- **Urgent / Hot Lead**: `#EE4047` (`bg-red-50 text-red-700 border-red-200`)
- **Quotation Review**: `#9333ea` (`bg-purple-50 text-purple-700 border-purple-200`)

---

## 🏢 1. Company Branding & Logo Settings

- **Company Name**: `SPESHWAY SOLUTIONS`
- **Tagline**: `Website & App Development Company | Hyderabad, India`
- **Email**: `info@speshway.com`
- **Phone**: `+91 91000 06020`
- **Website**: `www.speshway.com`
- **Address**: `T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India`
- **Logo Storage**: Integrated with **AWS S3 Bucket** (`crm-naveen-1.s3.ap-south-1.amazonaws.com`).
- **Watermark Controls**: Supports logo image watermark & custom text watermark, opacity (0.05 to 0.60), contrast scaling, grayscale toggle, and rotation (-45° to +45°).

---

## 🎨 2. Project Categories, Color Palettes & Feature Scope

### 🌐 1. Web Application
- **Category Name**: `Web Application` / `Web & SaaS`
- **Tagline**: *Responsive Web Portals, Dashboards & Cloud Web Apps*
- **Color Palette**:
  - **Primary Color**: `#0f172a` *(Deep Tech Slate)*
  - **Secondary Color**: `#0284c7` *(Sky Blue)*
  - **Accent Background**: `#f0f9ff` *(Soft Blue Tint)*
  - **Border Color**: `#bae6fd` *(Light Cyan)*
- **Specialized Features & Scope**:
  1. Responsive Cross-Device UI/UX (Mobile, Tablet, Desktop)
  2. Lighthouse Performance Target (90+ Speed Score)
  3. SEO Structured Data (Schema.org) & Social OpenGraph Tags
  4. Cross-Browser Certification (Chrome, Safari, Firefox, Edge)
  5. Secure Web Hosting & SSL Encryption Setup

---

### 📱 2. Mobile Application (iOS & Android)
- **Category Name**: `Mobile Application (iOS & Android)` / `Mobile`
- **Tagline**: *App Store & Play Store Cross-Platform App*
- **Color Palette**:
  - **Primary Color**: `#4c1d95` *(Royal Violet)*
  - **Secondary Color**: `#9333ea` *(Vibrant Purple)*
  - **Accent Background**: `#faf5ff` *(Soft Lavender Tint)*
  - **Border Color**: `#e9d5ff` *(Purple Mist)*
- **Specialized Features & Scope**:
  1. Apple App Store & Google Play Store Publishing Compliance
  2. Firebase Cloud Messaging (FCM) & APNs Push Notifications
  3. FaceID / TouchID Biometric Security & Encrypted Local Storage
  4. Offline Data Caching & Synchronization (SQLite/WatermelonDB)
  5. Native Device APIs (GPS Location, Camera, Bluetooth, Contacts)

---

### 🛒 3. E-Commerce & Digital Marketplace
- **Category Name**: `E-Commerce & Digital Marketplace` / `Commerce`
- **Tagline**: *Storefront, Multi-Vendor Marketplace, Cart & Gateways*
- **Color Palette**:
  - **Primary Color**: `#064e3b` *(Deep Emerald)*
  - **Secondary Color**: `#059669` *(Forest Green)*
  - **Accent Background**: `#ecfdf5` *(Mint Tint)*
  - **Border Color**: `#a7f3d0` *(Soft Emerald)*
- **Specialized Features & Scope**:
  1. Multi-Variant SKU Product Catalog & Instant Search
  2. PCI-DSS Multi-Currency Payment Gateways (Stripe, Razorpay, UPI)
  3. Multi-Vendor Payout Ledger & Automated Commission Split
  4. Abandoned Cart Recovery Engine via WhatsApp & Email
  5. Real-time Order Fulfillment & Shipping Carrier API Sync

---

### ☁️ 4. Cloud / DevOps & Microservices
- **Category Name**: `Cloud / DevOps & Microservices` / `Infrastructure`
- **Tagline**: *AWS/GCP Cloud Architecture, Docker/K8s, CI/CD & 99.9% High Availability*
- **Color Palette**:
  - **Primary Color**: `#1e293b` *(Midnight Slate)*
  - **Secondary Color**: `#d97706` *(Amber Gold)*
  - **Accent Background**: `#fffbeb` *(Amber Mist)*
  - **Border Color**: `#fde68a` *(Gold Tint)*
- **Specialized Features & Scope**:
  1. AWS / GCP Infrastructure as Code (Terraform IaC)
  2. Docker Containerization & Kubernetes (EKS/GKE) Auto-Scaling
  3. Automated Zero-Downtime CI/CD Deployment Pipeline (GitHub Actions)
  4. 99.9% High Availability SLA & Datadog/Prometheus Real-Time Monitoring

---

### 🤖 5. AI / ML & Intelligent Automation
- **Category Name**: `AI / ML & Intelligent Automation` / `AI & Data`
- **Tagline**: *LLMs, Vector DB (RAG) Search & AI Autonomous Agents*
- **Color Palette**:
  - **Primary Color**: `#881337` *(Deep Crimson)*
  - **Secondary Color**: `#e11d48` *(Vibrant Rose)*
  - **Accent Background**: `#fff1f2` *(Rose Tint)*
  - **Border Color**: `#fecdd3` *(Soft Pink)*
- **Specialized Features & Scope**:
  1. OpenAI GPT-4 & Anthropic Claude LLM API Integrations
  2. RAG Vector Knowledge Base Search (Pinecone / pgvector)
  3. Autonomous AI Customer Agent with Human Escalation Rules
  4. Token Rate Limiting, API Cost Optimization & Zero Client Data Training Guarantee

---

### 🏢 6. Enterprise ERP & CRM Software
- **Category Name**: `Enterprise ERP & CRM Software` / `Enterprise`
- **Tagline**: *Multi-tenant RBAC, Custom Workflow Engine & Comprehensive Audit Logs*
- **Color Palette**:
  - **Primary Color**: `#1e1b4b` *(Corporate Indigo)*
  - **Secondary Color**: `#4f46e5` *(Steel Cobalt)*
  - **Accent Background**: `#eef2ff` *(Indigo Tint)*
  - **Border Color**: `#c7d2fe` *(Soft Indigo)*
- **Specialized Features & Scope**:
  1. Multi-Tenant Role-Based Access Control (SuperAdmin, OrgAdmin, Manager, Staff)
  2. Multi-Step Custom Workflow Approval Chains
  3. Enterprise Immutable Audit Trail Logging with Timestamp & IP Delta Tracking
  4. Bulk Data Sync, Excel/CSV Batch Import & REST Webhooks

---

### ⚡ 7. Custom Software Development
- **Category Name**: `Custom Software Development` / `Custom`
- **Tagline**: *Tailored Architecture, Proprietary Business Logic & System APIs*
- **Color Palette**:
  - **Primary Color**: `#7c2d12` *(Deep Rust)*
  - **Secondary Color**: `#ea580c` *(Sunset Orange)*
  - **Accent Background**: `#fff7ed` *(Warm Orange Tint)*
  - **Border Color**: `#ffedd5` *(Soft Apricot)*
- **Specialized Features & Scope**:
  1. Proprietary Business Logic Engine & Custom Database Schema Design
  2. High-Throughput RESTful APIs & GraphQL Interfaces with Redis Caching
  3. Scalable Modular Codebase & Third-Party System Integrations

---

### 🔥 8. Hybrid Multi-Domain Proposals (2 to 3 Selected Types)
- **Category Name**: `Hybrid Multi-Domain Proposal`
- **Tagline**: *Integrated Multi-Platform Ecosystem*
- **Color Palette**:
  - **Primary Color**: `#0f172a` *(Executive Slate)*
  - **Secondary Color**: `#ea580c` *(Sunset Gold)*
  - **Accent Background**: `#fff7ed` *(Warm Slate Tint)*
  - **Border Color**: `#fed7aa` *(Gold Accent)*
- **Specialized Features & Scope**:
  1. **Cross-Domain Architecture Synergy Matrix** unifying 2 to 3 selected project domains
  2. Unified Single-Sign-On (SSO) Authentication & Central Database Layer
