export interface HRMSPresetData {
  id: string;
  variantKey: "website" | "website_app" | "app";
  title: string;
  category: string;
  budget: number;
  overviewNarrative: string;
  rolesMatrix: { role: string; count: string; description: string; permissions: string }[];
  customerDesc: string; // Employee Self-Service Portal
  merchantDesc: string; // HR & Manager Operations Workstation
  adminDesc: string;    // Executive Administration & Payroll Governance
  planAPrice: number;   // Starter Tier
  planBPrice: number;   // Professional Tier
  planCPrice: number;   // Enterprise Tier
  planComparisonItems: { deliverable: string; planA: boolean | string; planB: boolean | string; planC?: boolean | string }[];
  paymentTerms: string;
  termsAndConditions: string;
  companyDetailsDoc: string;
  features: { title: string; module: string; description: string; priority: "Low" | "Medium" | "High" | "Critical" }[];
}

export const HRMS_PRESETS: Record<"website" | "website_app" | "app", HRMSPresetData> = {
  website: {
    id: "hrms-website",
    variantKey: "website",
    title: "HRMS Web Portal & Automated Payroll Suite",
    category: "Web Application",
    budget: 60000,
    overviewNarrative: `This proposal outlines the end-to-end development of the Human Resource Management System (HRMS) Web Portal & Automated Payroll Suite. Tailored for modern corporate enterprises and fast-growing companies, this platform provides centralized employee onboarding, digital attendance logs, leave management, automated monthly payroll calculations with Indian Tax Slabs (PF, ESI, TDS), performance appraisal workflows, and real-time HR analytics. Built using Next.js, Node.js, and MongoDB with AES-256 data encryption and labor law compliance.`,
    rolesMatrix: [
      { role: "Super Admin", count: "1 - 2", description: "Company settings, multi-branch department structure & full audit trail.", permissions: "Full Access" },
      { role: "HR Manager", count: "2 - 5", description: "Employee onboarding, leave approval, shift scheduling & policy updates.", permissions: "HR Operations" },
      { role: "Payroll Specialist", count: "1 - 3", description: "Salary calculation, statutory deductions (PF/ESI/TDS), and payslip dispatch.", permissions: "Financial & Payroll" },
      { role: "Department Head", count: "5 - 20", description: "Approve team leaves, view attendance reports, and conduct performance reviews.", permissions: "Department Management" },
      { role: "Employee", count: "Unlimited", description: "Self-service portal to apply for leaves, download PDF payslips, and log daily hours.", permissions: "Employee Self-Service" },
      { role: "Recruiter / Talent Lead", count: "1 - 5", description: "Manage job requisitions, candidate pipeline, and digital offer letter generation.", permissions: "Recruitment Module" }
    ],
    customerDesc: `### 🌐 Employee Self-Service Web Portal
- **Digital Employee Dashboard**: Personal profile, attendance calendar, remaining leave balance, and company announcements.
- **Leave & Permission Request Engine**: Apply for Casual Leave, Sick Leave, Paid Time Off (PTO), and track real-time approval status.
- **Instant Payslip Vault & Tax Declarations**: Download monthly PDF payslips, submit Form 12BB tax investment declarations, and view Form 16.
- **Expense Reimbursement Submission**: Upload bills for travel/medical claims, track manager approval, and view reimbursement payouts.`,
    merchantDesc: `### 🩺 HR & Manager Operational Workstation
- **Centralized Employee Database (EMR for HR)**: Digital employee files, contract documents, bank details, emergency contacts, and ID proofs.
- **Attendance & Shift Rota Manager**: Integration with biometric fingerprint/face scanners, daily shift assignment, and late mark tracking.
- **Automated Payroll Engine**: Single-click payroll run, automated PF (12%), ESI (0.75%), TDS withholding, and direct bank transfer file export (NEFT/ACH).
- **Performance Appraisal & OKRs**: Set quarterly KPIs, conduct 360-degree reviews, track employee goal completion, and log appraisal scores.`,
    adminDesc: `### 🏢 Executive Administration & Corporate Governance
- **Executive HR Analytics**: Live metrics tracking headcount growth, attrition rate %, department salary cost distribution, and leave trends.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions by department, granular module access, and immutable audit logs.
- **Labor Law & Statutory Compliance**: Pre-configured Indian IT Tax Slabs (Old vs New Regime), Form 16 PDF generator, and PF ECR file exporter.
- **Cloud Infrastructure & Data Security**: S3 encrypted document store, daily MongoDB backups, and 99.9% high availability SLA.`,
    planAPrice: 60000,
    planBPrice: 95000,
    planCPrice: 160000,
    planComparisonItems: [
      { deliverable: "Employee Self-Service Web Portal", planA: true, planB: true, planC: true },
      { deliverable: "Centralized Employee Document Vault", planA: true, planB: true, planC: true },
      { deliverable: "Leave Request & Approval Workflow", planA: true, planB: true, planC: true },
      { deliverable: "Automated Monthly Payroll Calculation", planA: true, planB: true, planC: true },
      { deliverable: "Biometric Device API Sync", planA: false, planB: true, planC: true },
      { deliverable: "PF / ESI / TDS Statutory File Exporter", planA: false, planB: true, planC: true },
      { deliverable: "Expense Reimbursement Module", planA: false, planB: true, planC: true },
      { deliverable: "Performance Appraisal & 360 Feedback", planA: false, planB: false, planC: true },
      { deliverable: "Multi-Company & Branch Support", planA: false, planB: false, planC: true },
      { deliverable: "24/7 Priority SLA & HR Training", planA: false, planB: false, planC: true }
    ],
    paymentTerms: `### 💳 HRMS Web Application Payment Milestones
- **Milestone 1 (30%)**: Project Kickoff, System Architecture Blueprint & DB Schema Setup.
- **Milestone 2 (30%)**: Delivery of Core Modules (Employee Self-Service Portal, Leave Engine & HR Database).
- **Milestone 3 (30%)**: Delivery of Advanced Modules (Automated Payroll, Tax Exporter & Attendance Biometric Sync).
- **Milestone 4 (10%)**: Final User Acceptance Testing (UAT), HR Staff Training & Cloud Production Launch.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **Intellectual Property**: Speshway Solutions transfers full source code ownership upon final invoice settlement.
2. **Warranty & Maintenance**: Includes 90 days of complimentary bug fixes, cloud server monitoring, and statutory tax updates.
3. **Data Security**: Complies with Indian IT Act data privacy standards and ISO 27001 security guidelines.
4. **Third-Party Services**: Biometric hardware integration devices and SMS alert packages are billed at actual cost.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Employee Self-Service Portal", module: "Core HR", description: "Leave requests, payslip PDF downloads, and profile management.", priority: "Critical" },
      { title: "Automated Monthly Payroll Engine", module: "Payroll Module", description: "PF, ESI, TDS deductions, net pay computation, and payslip dispatch.", priority: "Critical" },
      { title: "Biometric Attendance API Sync", module: "Attendance", description: "Integration with biometric devices for automated clock-in logging.", priority: "High" },
      { title: "Leave & PTO Approval Workflow", module: "Leave Module", description: "Multi-level manager approval, leave balance tracking, and encashment.", priority: "High" },
      { title: "Expense Reimbursement Ledger", module: "Finance Module", description: "Submit claims, upload bill receipts, and track manager approval.", priority: "Medium" }
    ]
  },

  website_app: {
    id: "hrms-website-app",
    variantKey: "website_app",
    title: "HRMS Web Portal + iOS & Android Employee Mobile Apps",
    category: "Web & Mobile Ecosystem",
    budget: 140000,
    overviewNarrative: `This proposal covers the complete omni-channel HRMS Ecosystem comprising a high-performance Web Management Portal (for HR Admins, Managers, and Payroll Teams) alongside cross-platform Mobile Applications for both iOS and Android (for Employees and Field Teams). Featuring GPS Geo-fenced clock-in, FaceID attendance verification, push notifications for leave approvals, instant payslip downloads, and mobile expense claim uploading, this hybrid suite delivers modern mobile workforce management.`,
    rolesMatrix: [
      { role: "Super Admin", count: "1 - 3", description: "Central HR control center, multi-location analytics & system configuration.", permissions: "Full Access" },
      { role: "HR Operations Director", count: "2 - 10", description: "Oversee recruitment pipelines, employee lifecycle, and policy compliance.", permissions: "HR Operations" },
      { role: "Payroll Manager", count: "2 - 5", description: "Process monthly salaries, manage tax slabs, and export bank payout files.", permissions: "Payroll Access" },
      { role: "Manager / Lead (Mobile & Web)", count: "10 - 50+", description: "Approve team leaves on mobile app, view live field attendance, approve expense claims.", permissions: "Manager App & Web" },
      { role: "Employee (iOS & Android)", count: "Unlimited", description: "Mobile clock-in/out via GPS, apply for leaves, download payslips, view holiday calendar.", permissions: "Mobile App Access" },
      { role: "Recruiter Lead", count: "2 - 10", description: "Schedule candidate interviews, issue digital offer letters, and manage onboarding.", permissions: "Recruitment Access" }
    ],
    customerDesc: `### 📱 Employee Mobile Apps (iOS & Android) & Web Portal
- **Native iOS & Android Employee App**: Sleek React Native app with FaceID / TouchID biometric login and emergency contacts.
- **GPS Geo-Fenced Mobile Clock-In**: Allow field & office staff to clock in using mobile GPS coordinates within designated radius.
- **Real-Time Leave Application & Approval Alerts**: Submit leave requests in 2 taps; managers receive instant push notifications to approve/reject.
- **Mobile Payslip Vault & Tax Submissions**: View monthly salary breakdown, download PDF payslips, and upload tax investment proofs via mobile camera.`,
    merchantDesc: `### 🩺 Manager Mobile Workstation & HR Web Workstation
- **Manager Mobile App Dashboard**: Live view of team clock-ins, instant leave approvals, and field location tracking.
- **Biometric Hardware & Mobile Attendance Sync**: Real-time synchronization between office biometric hardware, mobile GPS clock-in, and central DB.
- **Automated Payroll & Statutory Compliance**: One-click salary run, PF/ESI/TDS tax ledger export, and direct bank payout integration.
- **Performance Appraisals & Goal Tracking**: Track OKRs, quarterly reviews, and employee peer appreciation on Web and Mobile.`,
    adminDesc: `### 🏢 Executive Governance & Cloud Infrastructure
- **Ecosystem Governance & Multi-Location Support**: Unified control panel managing multiple company branches, factories, and remote teams.
- **App Store & Play Store Compliance**: Complete Apple App Store & Google Play Store publishing, updates, and maintenance.
- **Push Notification Suite (FCM & APNs)**: Broadcast company announcements, holiday alerts, and payroll completion notifications.
- **High Availability Cloud Infrastructure**: Auto-scaling AWS deployment with 99.99% uptime SLA during monthly payroll processing.`,
    planAPrice: 110000,
    planBPrice: 160000,
    planCPrice: 280000,
    planComparisonItems: [
      { deliverable: "HR Web Admin & Payroll Workstation", planA: true, planB: true, planC: true },
      { deliverable: "iOS & Android Employee Mobile Apps", planA: true, planB: true, planC: true },
      { deliverable: "Manager Mobile App (iOS & Android)", planA: false, planB: true, planC: true },
      { deliverable: "GPS Geo-Fenced Attendance Clock-In", planA: true, planB: true, planC: true },
      { deliverable: "Push Notifications for Leave Approvals", planA: true, planB: true, planC: true },
      { deliverable: "Mobile Camera Document Proof Scanner", planA: false, planB: true, planC: true },
      { deliverable: "Biometric Hardware API Integration", planA: false, planB: true, planC: true },
      { deliverable: "App Store & Play Store Publishing SLA", planA: true, planB: true, planC: true },
      { deliverable: "Multi-Company & Branch Support", planA: false, planB: false, planC: true },
      { deliverable: "Dedicated AWS Cloud & 24/7 DevOps Support", planA: false, planB: false, planC: true }
    ],
    paymentTerms: `### 💳 HRMS Web + Mobile Ecosystem Payment Milestones
- **Milestone 1 (25%)**: Project Onboarding, UI/UX Mobile Prototypes & System Architecture.
- **Milestone 2 (25%)**: HR Web Portal & Backend Payroll APIs Development.
- **Milestone 3 (25%)**: iOS & Android Mobile Apps Integration, GPS Clock-in & Push Alerts.
- **Milestone 4 (15%)**: Play Store & App Store Publishing, HR Staff Training & Security Audits.
- **Milestone 5 (10%)**: Final Go-Live Handover & 120-Day Post-Launch SLA Warranty.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **App Store Distribution**: Speshway manages submission to Apple App Store & Google Play Store under client's developer accounts.
2. **Source Code Rights**: Complete rights to Web codebase, Mobile app repositories, and Backend API scripts transferred upon final payment.
3. **Data Security & Privacy**: End-to-end encryption for employee records, compliance with Indian IT Act privacy norms.
4. **Maintenance SLA**: Includes 120 days post-launch technical support, statutory tax updates, and store compliance.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Native Employee Mobile App (iOS & Android)", module: "Mobile Apps", description: "GPS clock-in, leave application, payslip PDF downloads, and announcements.", priority: "Critical" },
      { title: "Manager Mobile App for Approvals", module: "Mobile Apps", description: "Instant mobile approval for leaves, expense claims, and team attendance maps.", priority: "Critical" },
      { title: "HR Web Administration & Payroll Suite", module: "Core Web", description: "Complete employee lifecycle, salary computation, PF/ESI tax files export.", priority: "Critical" },
      { title: "GPS Geo-Fenced Clock-In Engine", module: "Mobile Infrastructure", description: "Restricts mobile attendance logging to authorized office or project site GPS bounds.", priority: "High" },
      { title: "Push Notifications (FCM & APNs)", module: "Mobile Infrastructure", description: "Automated alerts for leave approvals, payslip releases, and policy updates.", priority: "High" }
    ]
  },

  app: {
    id: "hrms-app-only",
    variantKey: "app",
    title: "HRMS Native Mobile Application Suite (iOS & Android)",
    category: "Mobile Application",
    budget: 80000,
    overviewNarrative: `This proposal targets a dedicated, native Mobile Application suite for Employee HR Self-Service & Mobile Attendance (iOS & Android). Designed for field forces, retail store staff, construction teams, and remote workforces, this app provides GPS geo-fenced clock-in, FaceID attendance verification, mobile leave requests, instant payslip PDF views, and mobile expense bill scanning. Built using React Native / Expo, Node.js REST APIs, and Firebase Cloud Messaging.`,
    rolesMatrix: [
      { role: "Mobile HR Admin", count: "1 - 2", description: "Mobile control center for HR heads, attendance reports, daily shift updates.", permissions: "Full App Control" },
      { role: "Team Lead (App User)", count: "5 - 20+", description: "View live team attendance, approve leave requests, verify field expense bills.", permissions: "Lead App Profile" },
      { role: "Employee (App User)", count: "Unlimited", description: "Clock in/out via GPS, apply for leaves, download payslips, view holiday list.", permissions: "Employee App Profile" }
    ],
    customerDesc: `### 📱 Employee Mobile App (iOS & Android)
- **GPS & FaceID Attendance Clock-In**: Tap to clock in with automatic selfie photo verification and GPS location tag.
- **Mobile Leave & Permission Requests**: Select dates, choose leave type, add reason, and submit for instant manager notification.
- **Payslip & Tax Vault**: View monthly net salary breakdown and download PDF payslips directly to smartphone storage.
- **Expense Claim Camera Scanner**: Snap photos of travel/food receipts and submit reimbursement claims on the go.`,
    merchantDesc: `### 🩺 Team Lead & Manager Mobile App
- **Live Team Attendance Board**: Real-time map view of team members currently logged in at office sites or client locations.
- **One-Tap Leave & Expense Approval**: Review pending leave requests and expense claim photos with instant accept/reject buttons.
- **Shift Assignment & Rota View**: View weekly team shift schedule and push roster updates.`,
    adminDesc: `### 🏢 Mobile Administration & Backend Cloud REST API
- **Store Publishing & Store Compliance**: Complete submission setup for Apple App Store and Google Play Store.
- **Push Notification Campaign Manager**: Broadcast HR policies, holiday wishes, and urgent shift change alerts.
- **Secure REST API Server**: Deployed on AWS Lightsail / EC2 with SSL encryption and JWT authentication.`,
    planAPrice: 55000,
    planBPrice: 85000,
    planCPrice: 145000,
    planComparisonItems: [
      { deliverable: "Employee iOS & Android Apps", planA: true, planB: true, planC: true },
      { deliverable: "Team Lead iOS & Android Apps", planA: true, planB: true, planC: true },
      { deliverable: "GPS Geo-Fenced Clock-In", planA: true, planB: true, planC: true },
      { deliverable: "Push Notifications (FCM)", planA: true, planB: true, planC: true },
      { deliverable: "FaceID / Selfie Attendance Verification", planA: false, planB: true, planC: true },
      { deliverable: "In-App Camera Document Proof Scanner", planA: false, planB: true, planC: true },
      { deliverable: "Offline Attendance Logging", planA: false, planB: false, planC: true },
      { deliverable: "App Store & Play Store Publishing SLA", planA: true, planB: true, planC: true }
    ],
    paymentTerms: `### 💳 HRMS Mobile App Payment Milestones
- **Milestone 1 (30%)**: Project Onboarding, Wireframes & App UI/UX Design.
- **Milestone 2 (35%)**: Frontend App Build (Employee & Lead Mobile Views) & REST API Server.
- **Milestone 3 (25%)**: GPS Clock-In Engine, Camera Scanner & Device Testing.
- **Milestone 4 (10%)**: App Store & Play Store Approval, Final Handover & Source Code Transfer.`,
    termsAndConditions: `### 📄 Standard Terms & Conditions
1. **Developer Accounts**: Client provides Apple Developer & Google Play Console accounts for app store distribution.
2. **App Maintenance**: Includes 90 days post-publishing store update compliance and critical bug fixes.
3. **Data Encryption**: All mobile transmission protected via TLS 1.3 encryption and secure local device storage.`,
    companyDetailsDoc: `### 🏢 Speshway Solutions
- **Company Name**: Speshway Solutions
- **Website**: www.speshway.com | **Email**: info@speshway.com | **Phone**: +91 91000 06020
- **Address**: T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Road, Serilingampalle (M), Hyderabad, Telangana 500032, India.`,
    features: [
      { title: "Native Employee Mobile App (iOS & Android)", module: "Employee Mobile", description: "GPS clock-in, leave application, payslip PDF downloads, and announcements.", priority: "Critical" },
      { title: "Manager Mobile App for Approvals", module: "Manager Mobile", description: "Instant mobile approval for leaves, expense claims, and team attendance maps.", priority: "Critical" },
      { title: "GPS & Selfie Clock-In Engine", module: "Attendance", description: "Geo-fenced attendance logging with selfie photo verification.", priority: "High" },
      { title: "In-App Camera Expense Scanner", module: "Finance", description: "Snap photos of receipts and submit reimbursement claims on the go.", priority: "Medium" }
    ]
  }
};
