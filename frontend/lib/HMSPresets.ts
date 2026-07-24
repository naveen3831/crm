export interface HMSPresetData {
  id: string;
  variantKey: "website" | "website_app" | "app";
  title: string;
  category: string;
  budget: number;
  overviewNarrative: string;
  rolesMatrix: { role: string; count: string; description: string; permissions: string }[];
  customerDesc: string; // Features & Scope: Customer/Patient Portal
  merchantDesc: string; // Features & Scope: Doctor/Staff Portal
  adminDesc: string;    // Features & Scope: Super Admin & Hospital Ops
  planAPrice: number;   // Starter Tier
  planBPrice: number;   // Professional Tier
  planCPrice: number;   // Enterprise Tier
  planComparisonItems: { deliverable: string; planA: boolean | string; planB: boolean | string; planC?: boolean | string }[];
  paymentTerms: string;
  termsAndConditions: string;
  companyDetailsDoc: string;
  features: { title: string; module: string; description: string; priority: "Low" | "Medium" | "High" | "Critical" }[];
}

export const HMS_PRESETS: Record<"website" | "website_app" | "app", HMSPresetData> = {
  website: {
    id: "hms-website",
    variantKey: "website",
    title: "HMS Web Application Portal & Dashboard",
    category: "Web Application",
    budget: 75000,
    overviewNarrative: `This proposal outlines the end-to-end development of the Hospital Management System (HMS) Web Portal & Admin Control Suite. Designed specifically for modern healthcare facilities, this web application provides seamless patient appointment booking, doctor schedule management, electronic medical records (EMR), laboratory results, pharmacy inventory management, and automated GST billing. Built using Next.js/React, Tailwind CSS, Node.js, and MongoDB, the system ensures 99.9% uptime, SSL encryption, and full compliance with DISHA & HIPAA digital health privacy standards.`,
    rolesMatrix: [
      { role: "Super Admin", count: "1 - 3", description: "Full system governance, hospital settings, user audit logs & financial overview.", permissions: "Full Access" },
      { role: "Hospital Admin", count: "3 - 10", description: "Department management, staff scheduling, bed allocation, and operational reports.", permissions: "Manage Hospital Ops" },
      { role: "Doctor / Specialist", count: "20 - 100+", description: "View OPD/IPD appointments, write digital prescriptions, access EMR & order lab tests.", permissions: "Clinical & EMR Access" },
      { role: "Nurse / Caretaker", count: "30 - 150+", description: "Record patient vitals, manage ward beds, and administer daily medication logs.", permissions: "Patient Vitals & Ward Access" },
      { role: "Patient", count: "Unlimited", description: "Self-service portal for appointment booking, viewing lab reports, and online fee payments.", permissions: "Patient Self-Service" },
      { role: "Billing Clerk", count: "2 - 10", description: "OPD/IPD invoice generation, insurance claim processing, and daily cash counter reconciliation.", permissions: "Financials & Invoicing" },
      { role: "Lab Technician", count: "5 - 20", description: "Receive diagnostic test orders, upload lab result PDFs, and manage testing queues.", permissions: "Diagnostics & Pathology" },
      { role: "Pharmacist", count: "2 - 10", description: "Dispense e-prescriptions, track medicine stock expiry, and process pharmacy sales.", permissions: "Pharmacy Stock & Sales" }
    ],
    customerDesc: `### 🌐 Patient Web Portal Features
- **Online Doctor Search & Appointment Booking**: Real-time doctor availability search, specialization filtering, slot selection, and instant confirmation SMS/Email.
- **Patient EMR & Diagnostic Reports Dashboard**: Secure digital health vault storing past visit summaries, lab report PDFs, and active prescriptions.
- **Online Teleconsultation & Video Calls**: Browser-based HD WebRTC video consultation with doctors, integrated chat, and online payment.
- **Online Payment & Invoice History**: Multi-gateway checkout (Razorpay, Stripe, UPI) for advance consultation fees, pathology tests, and IPD deposits.`,
    merchantDesc: `### 🩺 Doctor & Staff Operational Web Workstation
- **Digital EMR & Smart Prescription Writer**: Instant prescription builder with auto-complete ICD-10 drug database, dosage calculators, and print/PDF dispatch.
- **OPD Queue & Bed Management System**: Live patient queue counter, consultation timer, IPD ward/bed allocation grid with color-coded occupancy states.
- **Pathology & Radiology Diagnostic Workstation**: Test order queue, automated normal/abnormal value flags, radiologist electronic signature, and PDF report dispatch.
- **Pharmacy Inventory & Expiry Tracker**: Batch stock tracking, automated low-stock notifications, barcode scanning, and GST sales counter.`,
    adminDesc: `### 🏢 Super Admin & Hospital Operations Dashboard
- **Executive Analytics & Revenue Metrics**: Live dashboard tracking daily OPD patient count, bed occupancy %, revenue by department, and outstanding invoices.
- **Role-Based Access Control (RBAC)**: Fine-grained permission controls, staff onboarding, department assignment, and immutable audit trail logs.
- **Insurance & TPA Claims Management**: Pre-authorization form generator, claim status tracking, cashless admission ledger, and claim settlement audit.
- **System Backup & Data Security Governance**: Daily automated S3 cloud backups, AES-256 database encryption, and DISHA/HIPAA compliance logs.`,
    planAPrice: 55000,
    planBPrice: 85000,
    planCPrice: 145000,
    planComparisonItems: [
      { deliverable: "Patient Web Booking Portal", planA: true, planB: true, planC: true },
      { deliverable: "Doctor EMR & Digital Prescriptions", planA: true, planB: true, planC: true },
      { deliverable: "Lab & Pathology PDF Uploads", planA: true, planB: true, planC: true },
      { deliverable: "OPD Counter & GST Billing", planA: true, planB: true, planC: true },
      { deliverable: "WebRTC Video Teleconsultation", planA: false, planB: true, planC: true },
      { deliverable: "IPD Bed Allocation & Ward Matrix", planA: false, planB: true, planC: true },
      { deliverable: "Pharmacy Batch & Expiry Management", planA: false, planB: true, planC: true },
      { deliverable: "Insurance TPA Claims Engine", planA: false, planB: false, planC: true },
      { deliverable: "Multi-Branch Hospital Support", planA: false, planB: false, planC: true },
      { deliverable: "24/7 Priority SLA & Dedicated Server Setup", planA: false, planB: false, planC: true }
    ],
    paymentTerms: `### 💳 HMS Web Application Payment Milestones
- **Milestone 1 (30%)**: Project Kickoff, Architecture Blueprint, Database Schema & Design Mockups.
- **Milestone 2 (30%)**: Delivery of Core Modules (Patient Portal, Doctor EMR Workstation & OPD Billing).
- **Milestone 3 (30%)**: Delivery of Advanced Modules (Lab, Pharmacy, WebRTC Telemedicine & Admin Analytics).
- **Milestone 4 (10%)**: Final User Acceptance Testing (UAT), Staff Training & Production Cloud Deployment.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **Intellectual Property**: Speshway Solutions transfers full source code ownership upon final invoice settlement.
2. **Warranty & Maintenance**: Includes 90 days of complimentary bug fixes, cloud server monitoring, and security patches.
3. **Data Compliance**: The solution complies with Indian DISHA guidelines and international HIPAA privacy standards.
4. **Third-Party Services**: SMS gateway (Twilio/MSG91), Payment Gateways, and Domain/Hosting fees are billed at actual cost.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Patient Appointment Scheduler", module: "OPD Module", description: "Real-time doctor schedule booking, slot management, and SMS alerts.", priority: "Critical" },
      { title: "Smart EMR & Prescription Builder", module: "Clinical Module", description: "ICD-10 drug auto-fill, symptom logging, and instant PDF prescriptions.", priority: "Critical" },
      { title: "OPD & IPD GST Billing Engine", module: "Financial Module", description: "Itemized billing, tax calculation, payment gateway integration, and receipt printing.", priority: "Critical" },
      { title: "Lab & Diagnostic Report Vault", module: "Pathology Module", description: "Digital test result entry, reference ranges, and automated PDF report dispatch.", priority: "High" },
      { title: "WebRTC Video Teleconsultation", module: "Telemedicine", description: "Browser-based video consultation for remote patient follow-ups.", priority: "Medium" }
    ]
  },

  website_app: {
    id: "hms-website-app",
    variantKey: "website_app",
    title: "HMS Web Portal + iOS & Android Mobile Apps Ecosystem",
    category: "Web & Mobile Ecosystem",
    budget: 185000,
    overviewNarrative: `This proposal covers the complete omni-channel HMS Ecosystem comprising a high-performance Web Management Portal (for Hospital Staff, Admins, and Billing Counter) alongside cross-platform Mobile Applications for both iOS and Android (for Patients and Doctors). Powered by Next.js, React Native, Node.js, and Firebase Cloud Messaging (FCM), this hybrid suite delivers real-time Push Notifications for appointment reminders, instant prescription downloads, in-app video calls, Bluetooth vitals monitoring, and full ward management.`,
    rolesMatrix: [
      { role: "Super Admin", count: "1 - 5", description: "Central hospital chain dashboard, multi-location analytics, user management.", permissions: "Full Access" },
      { role: "Hospital Operations Manager", count: "5 - 15", description: "Live bed state, emergency ward escalation, staff shift rotas & billing approval.", permissions: "Ops Governance" },
      { role: "Doctor (Mobile & Web)", count: "50 - 200+", description: "Access patient rounds on mobile app, approve prescriptions, join instant video calls.", permissions: "Clinical & Mobile App" },
      { role: "Nurse & Ward Staff", count: "50 - 300+", description: "Update patient vitals via tablet app, record IV fluid charts, alert doctor on critical vitals.", permissions: "Ward Tablet Access" },
      { role: "Patient (iOS & Android)", count: "Unlimited", description: "Book appointments, receive live queue updates, view vitals history, and pay bills via UPI.", permissions: "Mobile App Patient Access" },
      { role: "Billing & Insurance Clerk", count: "5 - 20", description: "Process cashless claims, issue advance deposit receipts, and audit pharmacy invoices.", permissions: "Billing & Financials" },
      { role: "Lab & Imaging Tech", count: "10 - 30", description: "Upload DICOM radiology scans, enter diagnostic results, and send push alerts.", permissions: "Diagnostics & Imaging" },
      { role: "Pharmacy Manager", count: "5 - 15", description: "Process mobile e-prescriptions, manage drug inventory, and automate re-orders.", permissions: "Pharmacy Management" }
    ],
    customerDesc: `### 📱 Patient Mobile Apps (iOS & Android) & Web Portal
- **Native iOS & Android Patient App**: Sleek Flutter/React Native app with FaceID login, emergency ambulance call, and family member profile management.
- **Real-time Live OPD Queue Tracker**: GPS navigation to hospital, live queue token updates ("3 patients ahead of you"), and delay notifications.
- **In-App Mobile Payment & UPI Integration**: One-click fee payment via GPay, PhonePe, Paytm, Credit Cards, and Apple/Google Pay.
- **Health Vitals Log & Medical Vault**: Store blood pressure, sugar readings, ECG PDFs, and historical lab reports with offline caching.`,
    merchantDesc: `### 🩺 Doctor Mobile Workstation & Staff Web Station
- **Doctor Mobile App for Ward Rounds**: Instant mobile access to IPD patient charts, vital trend graphs, and voice-to-text consultation note taker.
- **Instant Push Alerts for Critical Vitals**: Automated FCM alerts triggered when nurse logs abnormal vitals (e.g. SpO2 < 90%, BP spike).
- **In-App Video Telemedicine & E-Prescription**: Direct HD video call with patient inside mobile app with digital signature dispatch.
- **Bed & ICU Ward Grid Management**: Interactive drag-and-drop bed occupancy grid for Web and Tablet apps.`,
    adminDesc: `### 🏢 Multi-Hospital Chain Governance & Executive Suite
- **Ecosystem Governance & Multi-Branch Support**: Unified control panel managing multiple hospital branches, OPD clinics, and diagnostic labs.
- **App Store & Play Store Compliance**: Complete Apple App Store & Google Play Store publishing, updates, and maintenance.
- **Automated Financial Reconciliation**: Integrated gateway settlement reports, daily cash/UPI audit summaries, and GST tax ledger export.
- **Cloud Infrastructure & High Availability**: Auto-scaling AWS ECS / Kubernetes cluster guaranteeing 99.99% uptime during peak OPD hours.`,
    planAPrice: 135000,
    planBPrice: 195000,
    planCPrice: 320000,
    planComparisonItems: [
      { deliverable: "Web Admin & OPD Billing Workstation", planA: true, planB: true, planC: true },
      { deliverable: "iOS & Android Patient Mobile Apps", planA: true, planB: true, planC: true },
      { deliverable: "Doctor Mobile App (iOS & Android)", planA: false, planB: true, planC: true },
      { deliverable: "Live OPD Queue Token Push Notifications", planA: true, planB: true, planC: true },
      { deliverable: "In-App Native Video Telemedicine", planA: false, planB: true, planC: true },
      { deliverable: "ICU & IPD Ward Tablet Matrix", planA: false, planB: true, planC: true },
      { deliverable: "Multi-Branch Hospital Chain Support", planA: false, planB: false, planC: true },
      { deliverable: "App Store & Play Store Publishing SLA", planA: true, planB: true, planC: true },
      { deliverable: "Bluetooth Medical Device Vitals Sync", planA: false, planB: false, planC: true },
      { deliverable: "Dedicated AWS Infrastructure & 24/7 DevOps Support", planA: false, planB: false, planC: true }
    ],
    paymentTerms: `### 💳 HMS Web + Mobile App Ecosystem Payment Milestones
- **Milestone 1 (25%)**: Project Kickoff, UI/UX Mobile Prototypes & System Architecture Setup.
- **Milestone 2 (25%)**: Web Portal & Backend APIs Development (EMR, Billing & Lab Modules).
- **Milestone 3 (25%)**: iOS & Android Mobile Apps Integration, Push Notifications & Telemedicine.
- **Milestone 4 (15%)**: Play Store & App Store Publishing, Staff Training & Security Audits.
- **Milestone 5 (10%)**: Final Go-Live Handover & 120-Day Post-Launch SLA Warranty.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **App Store Publishing**: Speshway manages submission to Apple App Store & Google Play Store under client's developer accounts.
2. **Source Code Ownership**: Full rights to Web codebase, Mobile app repositories, and Backend API scripts transferred upon final payment.
3. **Data Security & Privacy**: End-to-end encryption for patient health records, compliance with DISHA & HIPAA specifications.
4. **Maintenance SLA**: Includes 120 days post-launch technical support, minor UI updates, and store compliance maintenance.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Native Patient Mobile App (iOS & Android)", module: "Mobile Apps", description: "Appointment booking, live token queue tracker, digital health vault, and UPI payment.", priority: "Critical" },
      { title: "Doctor Mobile Workstation App", module: "Mobile Apps", description: "Mobile EMR view, ward rounds tracker, voice consultation notes, and emergency alerts.", priority: "Critical" },
      { title: "Web Management & Billing Portal", module: "Core Web", description: "Complete hospital administration, OPD/IPD counter billing, and EMR management.", priority: "Critical" },
      { title: "Push Notification Suite (FCM & APNs)", module: "Mobile Infrastructure", description: "Automated reminders for upcoming visits, lab report availability, and medicine dosage.", priority: "High" },
      { title: "In-App Native Video Consultation", module: "Telemedicine", description: "Seamless WebRTC video calls between Doctor app and Patient app.", priority: "High" }
    ]
  },

  app: {
    id: "hms-app-only",
    variantKey: "app",
    title: "HMS Native Mobile Application Suite (iOS & Android)",
    category: "Mobile Application",
    budget: 110000,
    overviewNarrative: `This proposal targets a dedicated, native Mobile Application suite for Hospital Management (iOS & Android). Designed for modern digital-first clinics, telemedicine providers, and mobile healthcare teams, this app provides patient booking, doctor mobile workstations, QR code check-in at hospital counters, offline consultation recording, native camera diagnostic upload, and Bluetooth medical device integration. Built using React Native / Expo, Node.js REST APIs, and Firebase backend services.`,
    rolesMatrix: [
      { role: "Mobile Super Admin", count: "1 - 2", description: "Mobile control center for clinic owners, daily revenue alerts, staff accounts.", permissions: "Full App Control" },
      { role: "Doctor (App User)", count: "10 - 50+", description: "View daily appointment agenda, conduct video consultations, send e-prescriptions.", permissions: "Doctor Mobile Profile" },
      { role: "Patient (App User)", count: "Unlimited", description: "Book appointments, store medical history, scan QR for instant check-in.", permissions: "Patient App Profile" },
      { role: "Clinic Desk Staff", count: "2 - 5", description: "Scan patient QR code on mobile/tablet to mark arrival and confirm fee payment.", permissions: "Desk App Token Scanner" }
    ],
    customerDesc: `### 📱 Patient Mobile App (iOS & Android)
- **Instant Booking & Specialist Search**: Filter doctors by distance, ratings, availability, and consultation fee.
- **QR Code Mobile Registration**: Unique encrypted QR ticket generated upon booking for touchless counter scan upon arriving at hospital.
- **Digital Health Passport**: Store blood group, allergy alerts, chronic illness records, and emergency contact card.
- **Offline Mode & In-App Storage**: View prescriptions and diagnostic reports even when mobile internet is offline.`,
    merchantDesc: `### 🩺 Doctor & Staff Mobile App Suite
- **Doctor Consultation Agenda**: Live schedule view, patient history preview before consultation, and instant status updates.
- **Digital Signature Prescription Writer**: Tap-to-add common medications, specify dosage, and sign digitally using finger/stylus on screen.
- **In-App Medical Imaging Scanner**: Built-in camera scanner with automatic document edge detection and PDF conversion for medical test papers.
- **Bluetooth Vitals Device Integration**: Auto-read pulse rate, blood pressure, and oxygen saturation from connected Bluetooth BLE monitors.`,
    adminDesc: `### 🏢 Mobile Administration & Backend Cloud API
- **Store Publishing & Store Compliance**: Complete submission setup for Apple App Store and Google Play Store.
- **Push Notification Campaign Manager**: Broadcast health awareness messages, vaccination drive notifications, and clinic operational announcements.
- **Analytics & Revenue Tracker**: View daily booking numbers, video consultation revenue, and app download metrics.
- **Secure REST API Backend**: Node.js API server deployed on AWS Lightsail / EC2 with SSL encryption and JWT authentication.`,
    planAPrice: 75000,
    planBPrice: 115000,
    planCPrice: 185000,
    planComparisonItems: [
      { deliverable: "Patient iOS & Android Apps", planA: true, planB: true, planC: true },
      { deliverable: "Doctor iOS & Android Apps", planA: true, planB: true, planC: true },
      { deliverable: "QR Code Counter Check-in", planA: true, planB: true, planC: true },
      { deliverable: "Push Notifications (FCM)", planA: true, planB: true, planC: true },
      { deliverable: "Native Video Teleconsultation", planA: false, planB: true, planC: true },
      { deliverable: "Digital Finger Signature Prescriptions", planA: false, planB: true, planC: true },
      { deliverable: "In-App Camera Document Scanner", planA: false, planB: true, planC: true },
      { deliverable: "Bluetooth BLE Medical Device Sync", planA: false, planB: false, planC: true },
      { deliverable: "Multi-Clinic Management Support", planA: false, planB: false, planC: true },
      { deliverable: "App Store Publishing & 90-Day SLA", planA: true, planB: true, planC: true }
    ],
    paymentTerms: `### 💳 HMS Mobile App Payment Milestones
- **Milestone 1 (30%)**: Project Onboarding, Wireframes & App UI/UX Design Approval.
- **Milestone 2 (35%)**: Frontend App Build (Patient & Doctor Mobile Views) & REST API Integration.
- **Milestone 3 (25%)**: Video Call Module, Camera Scanner & Testing on Physical iOS/Android Devices.
- **Milestone 4 (10%)**: App Store & Play Store Approval, Final Handover & Source Code Transfer.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **Developer Accounts**: Client provides Apple Developer & Google Play Console accounts for app store distribution.
2. **App Maintenance**: Includes 90 days post-publishing store update compliance and critical bug fixes.
3. **Data Encryption**: All mobile transmission protected via TLS 1.3 encryption and secure device storage.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Native Patient App (iOS & Android)", module: "Patient Mobile", description: "Search doctors, book slots, digital health record storage, and UPI payment.", priority: "Critical" },
      { title: "Doctor Mobile Workstation", module: "Doctor Mobile", description: "Consultation schedule, patient history view, digital signature prescriptions.", priority: "Critical" },
      { title: "QR Code Hospital Counter Scanner", module: "Desk Mobile", description: "Instant scan of patient booking QR code for touchless arrival confirmation.", priority: "High" },
      { title: "In-App Camera Document Edge Scanner", module: "Diagnostics", description: "Capture paper lab reports via camera with automatic crop and PDF conversion.", priority: "Medium" }
    ]
  }
};
