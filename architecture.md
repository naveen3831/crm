# CRM System Architecture and Workflow

**Project Type:** Production-Level CRM Web Application  
**Roles:** Admin and Customer  
**Frontend:** Next.js, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express.js  
**Database:** MongoDB with Mongoose  
**Design Style:** Responsive Glassmorphism UI  
**Architecture Style:** Three-Tier, Modular Layered Architecture  

---

# 1. System Overview

The CRM system is a production-ready web application designed to manage customers, leads, deals, products, quotations, invoices, payments, support tickets, tasks, notifications, documents, reports, and audit logs.

The system contains only two roles:

- Admin
- Customer

The Admin cannot register through the public application. The Admin account must be created securely through a backend seed script, protected setup process, or directly through an authorized database operation.

Only Customers can register through the public registration page.

---

# 2. High-Level Architecture

```text
+------------------------------------------------------+
|                    User Layer                        |
|------------------------------------------------------|
| Admin                                                |
| Customer                                             |
+--------------------------+---------------------------+
                           |
                           v
+------------------------------------------------------+
|                  Frontend Layer                      |
|------------------------------------------------------|
| Next.js                                              |
| Tailwind CSS                                         |
| Framer Motion                                        |
| Glassmorphism UI                                     |
| React Hook Form                                      |
| Zod Validation                                       |
| TanStack Query / Redux Toolkit                       |
+--------------------------+---------------------------+
                           |
                           | HTTPS REST API
                           v
+------------------------------------------------------+
|                  Backend Layer                       |
|------------------------------------------------------|
| Node.js                                              |
| Express.js                                           |
| Routes                                               |
| Middleware                                           |
| Controllers                                          |
| Services                                             |
| Validation                                           |
| Authentication                                       |
| Authorization                                        |
| Business Logic                                       |
+--------------------------+---------------------------+
                           |
                           v
+------------------------------------------------------+
|                   Data Layer                         |
|------------------------------------------------------|
| MongoDB                                              |
| Mongoose                                             |
| Collections                                          |
| Indexes                                              |
| Aggregation Pipelines                                |
| Transactions                                         |
| Audit Logs                                           |
+--------------------------+---------------------------+
                           |
                           v
+------------------------------------------------------+
|              External Services Layer                 |
|------------------------------------------------------|
| Cloudinary / AWS S3                                  |
| Razorpay / Stripe                                    |
| Nodemailer / SMTP                                    |
| WhatsApp Business API                                |
| Firebase Cloud Messaging                             |
| Redis / BullMQ                                       |
| Monitoring and Logging Services                      |
+------------------------------------------------------+
```

---

# 3. Frontend Architecture

## 3.1 Frontend Responsibilities

The Next.js frontend is responsible for:

- Rendering Admin and Customer interfaces
- Managing authentication state
- Protecting routes
- Handling forms and client-side validation
- Displaying charts and reports
- Managing pagination, filtering, sorting, and search
- Displaying loading, success, empty, and error states
- Calling backend APIs
- Rendering responsive glassmorphism components
- Providing smooth animations and transitions

## 3.2 Recommended Frontend Libraries

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- TanStack Query
- Zustand or Redux Toolkit
- Recharts or Chart.js
- Axios or Fetch API

## 3.3 Frontend Folder Structure

```text
frontend/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── deals/
│   │   ├── products/
│   │   ├── quotations/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── tickets/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── communications/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── analytics/
│   │   ├── documents/
│   │   ├── audit-logs/
│   │   ├── settings/
│   │   └── profile/
│   ├── customer/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── quotations/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── tickets/
│   │   ├── documents/
│   │   └── notifications/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   ├── cards/
│   ├── modals/
│   └── notifications/
├── services/
├── hooks/
├── store/
├── types/
├── utils/
├── constants/
├── middleware.ts
└── public/
```

---

# 4. Backend Architecture

The backend follows a modular layered architecture.

```text
Client Request
      |
      v
Express Route
      |
      v
Authentication Middleware
      |
      v
Role Authorization Middleware
      |
      v
Validation Middleware
      |
      v
Controller
      |
      v
Service Layer
      |
      v
Mongoose Model / Repository
      |
      v
MongoDB
```

## 4.1 Backend Layer Responsibilities

### Routes

Routes define API endpoints and connect middleware with controllers.

### Middleware

Middleware handles:

- JWT authentication
- Role authorization
- Input validation
- File validation
- Rate limiting
- Error handling
- Audit logging
- Request logging

### Controllers

Controllers receive requests, call services, and return standardized responses.

### Services

Services contain business logic such as:

- Customer creation
- Lead conversion
- Deal stage updates
- Quotation calculations
- Invoice creation
- Payment verification
- Ticket resolution
- Notification generation

### Models

Mongoose models define database schemas, indexes, references, timestamps, validation rules, and soft-deletion fields.

## 4.2 Backend Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   ├── mailer.js
│   │   ├── payment.js
│   │   └── redis.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── deals/
│   │   ├── products/
│   │   ├── quotations/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── tickets/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── communications/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── analytics/
│   │   ├── documents/
│   │   ├── auditLogs/
│   │   └── settings/
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   ├── jobs/
│   ├── queues/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── scripts/
│   └── createAdmin.js
├── tests/
├── .env
├── package.json
└── Dockerfile
```

---

# 5. Authentication Architecture

## 5.1 Authentication Rules

- Customers can register publicly.
- Admin cannot register publicly.
- No Admin registration page must exist.
- No public Admin registration API must exist.
- Public registration must always create a Customer.
- The backend must never trust a role sent from the frontend.
- Admin accounts must be created securely through a backend seed script or protected setup process.
- Admin and Customer can use the same login page.
- Users are redirected according to their stored role.

## 5.2 Customer Registration Flow

```text
Customer Opens Registration Page
        |
        v
Enters Registration Details
        |
        v
Frontend Validation
        |
        v
POST /api/v1/auth/register
        |
        v
Backend Validation
        |
        v
Check Existing Email
        |
        +----------------------+
        |                      |
        v                      v
Email Exists             Email Available
        |                      |
        v                      v
Return Error          Hash Password
                               |
                               v
                     Force role = customer
                               |
                               v
                    Create Customer Account
                               |
                               v
                    Send Verification Email
                               |
                               v
                    Customer Verifies Email
                               |
                               v
                       Account Activated
                               |
                               v
                       Redirect to Login
```

## 5.3 Admin Account Creation

```text
Developer Runs Secure Seed Script
        |
        v
Read Admin Credentials from Environment Variables
        |
        v
Check Whether Admin Already Exists
        |
        +----------------------+
        |                      |
        v                      v
Admin Exists             Admin Missing
        |                      |
        v                      v
Stop Script           Hash Password
                               |
                               v
                    Create role = admin
                               |
                               v
                    Mark Account Active
                               |
                               v
                       Finish Script
```

The application must not expose endpoints such as:

```text
POST /api/v1/auth/register-admin
POST /api/v1/admin/register
POST /api/v1/auth/signup-admin
```

## 5.4 Login Workflow

```text
User Enters Email and Password
        |
        v
POST /api/v1/auth/login
        |
        v
Find User by Email
        |
        v
Compare Password with bcrypt
        |
        v
Check Account Status
        |
        v
Generate Access and Refresh Tokens
        |
        v
Identify Stored Role
        |
        +------------------------+
        |                        |
        v                        v
Admin Role                Customer Role
        |                        |
        v                        v
Admin Dashboard          Customer Dashboard
```

## 5.5 Token Strategy

- Access token expiry: approximately 15 minutes
- Refresh token expiry: approximately 7 days
- Refresh token rotation
- HTTP-only secure cookies
- Refresh token revocation on logout
- Session invalidation after password reset

---

# 6. Role-Based Authorization

```text
/admin/*       -> Admin only
/customer/*    -> Customer only
/auth/*        -> Public or authentication routes
```

Frontend route protection improves user experience, but backend authorization is mandatory.

Example backend route:

```javascript
router.get(
  "/admin/dashboard",
  protect,
  allowRoles("admin"),
  getAdminDashboard
);
```

Customer queries must always include the authenticated Customer ID.

Example:

```javascript
Invoice.findOne({
  _id: req.params.id,
  customer: req.user.customerId
});
```

This prevents Customers from viewing other Customers' data.

---

# 7. Database Architecture

## 7.1 Core Collections

```text
users
customers
leads
deals
products
categories
quotations
quotationItems
invoices
invoiceItems
payments
tickets
ticketReplies
tasks
calendarEvents
notifications
communications
documents
activities
auditLogs
settings
refreshTokens
```

## 7.2 Main Relationships

```text
Customer
  |
  +---- Leads
  +---- Deals
  +---- Quotations
  +---- Invoices
  +---- Payments
  +---- Tickets
  +---- Tasks
  +---- Documents
  +---- Communications
  +---- Notifications
```

## 7.3 Standard Record Fields

Important collections should include:

- createdAt
- updatedAt
- createdBy
- updatedBy
- status
- isDeleted
- deletedAt
- deletedBy

Soft deletion should be used for important financial and business records.

---

# 8. API Architecture

## 8.1 Versioned API Routes

```text
/api/v1/auth
/api/v1/admin
/api/v1/customers
/api/v1/leads
/api/v1/deals
/api/v1/products
/api/v1/quotations
/api/v1/invoices
/api/v1/payments
/api/v1/tickets
/api/v1/tasks
/api/v1/calendar
/api/v1/communications
/api/v1/notifications
/api/v1/reports
/api/v1/analytics
/api/v1/documents
/api/v1/settings
/api/v1/audit-logs
```

## 8.2 Standard Success Response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

## 8.3 Standard Error Response

```json
{
  "success": false,
  "message": "Request could not be completed",
  "errors": []
}
```

---

# 9. Complete CRM Workflow

```text
Customer Registration
        |
        v
Customer Login
        |
        v
Customer Account
        |
        v
Admin Manages Customer
        |
        v
Lead Created
        |
        v
Lead Contacted
        |
        v
Lead Qualified
        |
        v
Deal Created
        |
        v
Quotation Created
        |
        v
Customer Accepts Quotation
        |
        v
Invoice Generated
        |
        v
Customer Makes Payment
        |
        v
Payment Verified
        |
        v
Invoice Marked Paid
        |
        v
Support and Retention
```

---

# 10. Admin Dashboard Workflow

```text
Admin Logs In
        |
        v
Admin Dashboard Loads
        |
        v
Frontend Requests Dashboard API
        |
        v
Backend Verifies Token and Admin Role
        |
        v
MongoDB Aggregation Retrieves:
- Customers
- Leads
- Deals
- Quotations
- Invoices
- Revenue
- Payments
- Tickets
- Tasks
        |
        v
API Returns Dashboard Data
        |
        v
Next.js Displays Cards and Charts
```

The Admin Dashboard should provide quick actions for:

- Add Customer
- Create Lead
- Create Deal
- Add Product
- Create Quotation
- Generate Invoice
- Record Payment
- Create Task
- Schedule Meeting
- View Ticket
- Send Notification

---

# 11. Customer Management Workflow

```text
Admin Opens Customers
        |
        v
Search / Filter / Sort / Paginate
        |
        +----------------+----------------+----------------+
        |                |                |                |
        v                v                v                v
Add Customer       View Customer    Edit Customer   Change Status
```

## Add Customer

```text
Admin Enters Customer Data
        |
        v
Frontend Validation
        |
        v
Backend Validation
        |
        v
Duplicate Check
        |
        v
Customer Created
        |
        v
Welcome Notification Sent
        |
        v
Audit Log Created
```

## Customer Details

The Customer profile should display:

- Personal information
- Company information
- Leads
- Deals
- Quotations
- Invoices
- Payments
- Tickets
- Tasks
- Documents
- Communication history
- Activity timeline

---

# 12. Lead Management Workflow

```text
New
 |
 v
Contacted
 |
 v
Qualified
 |
 v
Proposal Sent
 |
 v
Negotiation
 |
 +------> Won
 |           |
 |           v
 |    Convert to Customer
 |           |
 |           v
 |       Create Deal
 |
 +------> Lost
             |
             v
      Save Lost Reason
```

The Admin can:

- Create, edit, and delete leads
- Add notes and attachments
- Change priority
- Schedule follow-ups
- Convert leads into Customers
- Convert leads into deals
- Mark leads as won or lost

---

# 13. Deal Management Workflow

```text
Prospect
   |
   v
Qualification
   |
   v
Proposal
   |
   v
Negotiation
   |
   +------> Closed Won
   |             |
   |             v
   |      Create Quotation
   |
   +------> Closed Lost
                 |
                 v
          Save Lost Reason
```

The system must maintain deal stage history.

---

# 14. Product and Service Workflow

```text
Admin Creates Category
        |
        v
Admin Adds Product or Service
        |
        v
Adds Name, SKU, Price, Tax, Discount and Image
        |
        v
Product Saved
        |
        v
Product Available in Quotations
```

Products already used in quotations or invoices should be archived instead of permanently deleted.

---

# 15. Quotation Workflow

```text
Admin Creates Quotation
        |
        v
Select Customer
        |
        v
Add Products or Services
        |
        v
Calculate Subtotal, Discount and Tax
        |
        v
Save as Draft
        |
        v
Preview and Send
        |
        v
Status = Sent
        |
        v
Customer Opens Quotation
        |
        v
Status = Viewed
        |
        +-------------------------+
        |                         |
        v                         v
Customer Accepts           Customer Rejects
        |                         |
        v                         v
Status = Accepted          Save Rejection Reason
        |
        v
Convert to Invoice
```

Quotation statuses:

- Draft
- Sent
- Viewed
- Accepted
- Rejected
- Expired
- Converted

---

# 16. Invoice Workflow

```text
Accepted Quotation
        |
        v
Convert to Invoice
        |
        v
Generate Invoice Number
        |
        v
Set Issue Date and Due Date
        |
        v
Save Invoice
        |
        v
Send to Customer
        |
        v
Customer Views Invoice
        |
        +-------------------------+
        |                         |
        v                         v
Customer Pays             Payment Not Completed
        |                         |
        v                         v
Verify Payment            Due Date Passes
        |                         |
        v                         v
Mark Paid                 Mark Overdue
```

Invoice statuses:

- Draft
- Sent
- Pending
- Partially Paid
- Paid
- Overdue
- Cancelled

---

# 17. Payment Workflow

```text
Customer Opens Invoice
        |
        v
Clicks Pay Now
        |
        v
Backend Verifies Invoice and Amount
        |
        v
Create Razorpay or Stripe Order
        |
        v
Open Payment Checkout
        |
        v
Customer Completes Payment
        |
        v
Payment Gateway Sends Webhook
        |
        v
Backend Verifies Signature
        |
        +------------------------+
        |                        |
        v                        v
Payment Successful         Payment Failed
        |                        |
        v                        v
Create Payment Record      Save Failure Status
        |
        v
Update Invoice Balance
        |
        v
Update Invoice Status
        |
        v
Generate Receipt
        |
        v
Notify Admin and Customer
```

Payment status must only be confirmed after backend verification.

---

# 18. Support Ticket Workflow

```text
Customer Creates Ticket
        |
        v
Status = Open
        |
        v
Admin Receives Notification
        |
        v
Admin Reviews Ticket
        |
        v
Status = In Progress
        |
        v
Admin Replies
        |
        v
Customer Receives Notification
        |
        v
Issue Resolved
        |
        v
Status = Resolved
        |
        v
Customer Confirms
        |
        v
Status = Closed
```

Ticket statuses:

- Open
- In Progress
- Waiting for Customer
- Resolved
- Reopened
- Closed

---

# 19. Task Workflow

```text
Admin Creates Task
        |
        v
Links Customer, Lead, Deal, Invoice or Ticket
        |
        v
Sets Due Date and Reminder
        |
        v
Status = Pending
        |
        v
Reminder Triggered
        |
        v
Status = In Progress
        |
        +----------------------+
        |                      |
        v                      v
Completed                  Overdue
```

Task statuses:

- Pending
- In Progress
- Completed
- Cancelled
- Overdue

---

# 20. Calendar Workflow

```text
Admin Opens Calendar
        |
        v
Selects Day, Week or Month View
        |
        v
Creates Meeting, Call, Demo or Follow-up
        |
        v
Links Customer or Lead
        |
        v
Sets Date, Time and Reminder
        |
        v
Event Saved
        |
        v
Notification Scheduled
        |
        v
Admin and Customer Receive Reminder
```

The calendar should also display:

- Task due dates
- Invoice due dates
- Quotation expiry dates
- Customer meetings
- Follow-up dates

---

# 21. Document Workflow

```text
Admin or Customer Selects File
        |
        v
Frontend Validates Type and Size
        |
        v
Backend Receives File
        |
        v
Multer Validates File
        |
        v
Upload to Cloudinary or AWS S3
        |
        v
Store URL and Metadata in MongoDB
        |
        v
Link Document to CRM Record
```

Documents can be linked to:

- Customers
- Leads
- Deals
- Quotations
- Invoices
- Payments
- Tickets

---

# 22. Notification Workflow

```text
CRM Event Occurs
        |
        v
Notification Service
        |
        +------------------+
        |                  |
        v                  v
In-App Notification   Background Job Queue
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
            Email            SMS          WhatsApp
```

Notification triggers include:

- Customer registration
- New lead
- Lead conversion
- Quotation sent
- Quotation accepted or rejected
- Invoice generated
- Payment successful or failed
- Ticket created or replied
- Task reminder
- Meeting reminder

---

# 23. Reports Workflow

```text
Admin Opens Reports
        |
        v
Selects Report Type
        |
        v
Applies Filters
        |
        v
Backend Verifies Admin Role
        |
        v
MongoDB Aggregation Processes Data
        |
        v
Report Displayed
        |
        +----------------+----------------+----------------+
        |                |                |                |
        v                v                v                v
View Chart          Export PDF       Export Excel      Export CSV
```

Large reports should be generated using background jobs.

---

# 24. Audit Log Workflow

```text
Important Action Occurs
        |
        v
Capture User, Role, Action and Record
        |
        v
Capture Previous and Updated Values
        |
        v
Capture IP, Browser and Timestamp
        |
        v
Save Audit Log in MongoDB
        |
        v
Admin Can Review Audit Logs
```

Audit events include:

- Login and logout
- Failed login
- Customer changes
- Lead status changes
- Deal stage changes
- Quotation changes
- Invoice changes
- Payment updates
- Refunds
- Ticket updates
- Data exports
- Settings changes
- Record deletion

---

# 25. Customer Dashboard Workflow

```text
Customer Logs In
        |
        v
Customer Dashboard Loads
        |
        v
Fetch Only Authenticated Customer Data
        |
        +---- Quotations
        +---- Invoices
        +---- Payments
        +---- Tickets
        +---- Documents
        +---- Notifications
        +---- Meetings
```

The Customer must never access another Customer's records.

---

# 26. Password Reset Workflow

```text
User Clicks Forgot Password
        |
        v
Enters Email
        |
        v
Generate Reset Token
        |
        v
Store Hashed Token
        |
        v
Send Reset Link
        |
        v
Validate Token
        |
        v
Update Password
        |
        v
Invalidate Existing Sessions
        |
        v
Redirect to Login
```

---

# 27. Logout Workflow

```text
User Clicks Logout
        |
        v
Backend Revokes Refresh Token
        |
        v
Authentication Cookies Cleared
        |
        v
Audit Log Created
        |
        v
Redirect to Login
```

---

# 28. File Storage Architecture

```text
Frontend File Selection
        |
        v
Client Validation
        |
        v
Express Upload Endpoint
        |
        v
Multer Validation
        |
        v
Cloudinary / AWS S3
        |
        v
Store URL and Metadata in MongoDB
```

The database must store the file URL and metadata, not the complete binary file.

---

# 29. Background Job Architecture

Use Redis and BullMQ for operations that should not block API requests.

Recommended background jobs:

- Email delivery
- PDF generation
- Payment reminders
- Notifications
- Large reports
- Data exports
- Payment reconciliation

```text
API Request
    |
    v
Create Job
    |
    v
Redis Queue
    |
    v
Worker
    |
    v
Email / PDF / Notification / Export
```

---

# 30. Security Architecture

```text
Client Request
        |
        v
HTTPS
        |
        v
Rate Limiter
        |
        v
CORS Validation
        |
        v
Authentication
        |
        v
Role Authorization
        |
        v
Input Validation
        |
        v
Controller and Service
        |
        v
Database
```

Security requirements:

- HTTPS
- Helmet
- CORS whitelist
- JWT authentication
- Refresh token rotation
- bcrypt password hashing
- Secure cookies
- Rate limiting
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection
- Secure file uploads
- Payment webhook verification
- Audit logs
- Environment variables
- Secret management

---

# 31. Glassmorphism UI Architecture

Glassmorphism belongs only in the presentation layer.

Recommended Tailwind classes:

```css
bg-white/10
backdrop-blur-xl
border
border-white/20
shadow-xl
rounded-2xl
```

Use glassmorphism for:

- Dashboard cards
- Sidebar
- Navbar
- Modals
- Filters
- Analytics panels

Avoid excessive transparency in:

- Large tables
- Long forms
- Text-heavy pages

Use Framer Motion for:

- Page transitions
- Sidebar animations
- Card entrance animations
- Modals
- Dropdowns
- Notifications
- Button hover effects

Animations must not reduce performance or readability.

---

# 32. Deployment Architecture

```text
                         Internet
                            |
                            v
                     Cloudflare / CDN
                            |
               +------------+------------+
               |                         |
               v                         v
        Next.js Frontend          Express Backend
        Vercel / AWS              AWS / Render
               |                         |
               +------------+------------+
                            |
                            v
                      MongoDB Atlas
                            |
               +------------+------------+
               |                         |
               v                         v
       Cloudinary / AWS S3           Redis
               |
               v
       External Services
```

Recommended services:

- Frontend: Vercel or AWS
- Backend: AWS, Render, or DigitalOcean
- Database: MongoDB Atlas
- Storage: Cloudinary or AWS S3
- Cache and Queue: Redis and BullMQ
- Payments: Razorpay or Stripe
- Email: Nodemailer with SMTP provider
- Monitoring: Sentry, Prometheus, Grafana
- CI/CD: GitHub Actions and Docker

---

# 33. Environment Architecture

Maintain separate environments:

```text
Development
Testing
Staging
Production
```

Each environment must use separate:

- Database
- API URL
- Storage credentials
- Payment keys
- Email credentials
- JWT secrets
- Redis instance

Never use production credentials in development.

---

# 34. Scalability Architecture

Initial production:

```text
Next.js Frontend
        |
        v
Single Express Backend
        |
        v
MongoDB Atlas
        |
        +---- Redis
        +---- Cloudinary
```

Future scaling:

```text
Load Balancer
    |
    +---- Backend Instance 1
    +---- Backend Instance 2
    +---- Backend Instance 3
              |
              v
         MongoDB Atlas
              |
              v
            Redis
```

The backend must remain stateless to support horizontal scaling.

---

# 35. Development Workflow

## Phase 1: Setup

- Create Next.js frontend
- Configure Tailwind CSS and TypeScript
- Configure Framer Motion
- Create Node.js and Express.js backend
- Connect MongoDB
- Configure environment variables
- Add centralized error handling

## Phase 2: Authentication

- User model
- Customer-only registration
- Secure Admin seed script
- Admin and Customer login
- JWT access and refresh tokens
- Forgot and reset password
- Role authorization middleware

## Phase 3: Core CRM

- Customer management
- Lead management
- Deal management
- Product and service management

## Phase 4: Business Documents

- Quotations
- Invoices
- PDF generation
- Document storage

## Phase 5: Payments

- Razorpay or Stripe
- Webhooks
- Payment verification
- Receipts
- Refunds

## Phase 6: Support

- Support tickets
- Ticket replies
- Attachments
- Notifications

## Phase 7: Productivity

- Tasks
- Calendar
- Meetings
- Reminders
- Communication history

## Phase 8: Analytics

- Dashboard statistics
- Reports
- Charts
- Exports

## Phase 9: Production Readiness

- Security testing
- Unit testing
- Integration testing
- API testing
- Performance testing
- Logging
- Monitoring
- Automated backups
- CI/CD
- Production deployment

---

# 36. Architecture and Workflow Acceptance Criteria

The architecture and workflow are complete when:

- Admin cannot register publicly.
- Customer registration always creates the Customer role.
- Admin accounts are created through a secure backend process.
- Admin and Customer authentication works correctly.
- Admin and Customer routes are protected.
- Customers can access only their own records.
- Leads can be converted into Customers and deals.
- Deals can be converted into quotations.
- Accepted quotations can be converted into invoices.
- Customers can securely pay invoices.
- Payments are verified through gateway webhooks.
- Invoice balances and statuses update correctly.
- Customers can create and track support tickets.
- Admin can manage and resolve tickets.
- Email and in-app notifications work.
- Important operations are recorded in audit logs.
- Dashboard statistics use live MongoDB data.
- Loading, empty, success, and error states are implemented.
- The UI works on desktop, tablet, and mobile.
- Glassmorphism and animations remain consistent and performant.
- Files are stored externally.
- APIs are versioned.
- Logging, monitoring, backups, and CI/CD are enabled.