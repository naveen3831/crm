# Product Requirements Document (PRD)

# CRM System (Admin & Customer)

**Version:** 1.0  
**Project Type:** Production-Level Web CRM  
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

---

# 1. Project Overview

## Purpose
Build a production-ready Customer Relationship Management (CRM) platform with two user roles: **Admin** and **Customer**. The platform centralizes customer data, lead management, quotations, invoices, payments, support tickets, and communication.

## Goals
- Centralize customer information
- Improve customer engagement
- Streamline sales and support
- Automate business workflows
- Provide business analytics
- Ensure secure access and auditing

---

# 2. User Roles

## Admin
- Full system access
- Manage customers
- Manage leads and deals
- Manage products/services
- Create quotations
- Generate invoices
- Track payments
- Manage support tickets
- Send emails and notifications
- View reports and analytics
- Configure settings
- View audit logs

## Customer
- Register/Login
- Manage profile
- View quotations
- Accept/Reject quotations
- View invoices
- Make payments
- Create and track support tickets
- View notifications
- Download documents

---

# 3. Functional Modules

## Authentication
- Registration
- Login / Logout
- Email Verification
- Forgot / Reset Password
- JWT Authentication
- Role-Based Access Control (RBAC)

## Dashboard

### Admin Dashboard
- Total Customers
- Active Leads
- Revenue
- Pending Payments
- Open Tickets
- Recent Activities
- Revenue & Sales Charts

### Customer Dashboard
- My Quotations
- My Invoices
- Payment Status
- Support Tickets
- Notifications

## Customer Management
- Add / Edit / Delete Customer
- Search & Filter
- Activate / Suspend
- Export Data

Fields:
- Customer ID
- Name
- Company
- Email
- Phone
- Address
- GST
- Industry
- Status

## Lead Management
- Create / Update / Delete Lead
- Assign Lead
- Convert Lead to Customer
- Notes & Attachments

Lead Status:
- New
- Contacted
- Qualified
- Proposal Sent
- Negotiation
- Won
- Lost

## Deal Management
Stages:
- Prospect
- Qualification
- Proposal
- Negotiation
- Closed Won
- Closed Lost

## Product & Service Management
- CRUD Products
- Categories
- Pricing
- Taxes
- Images

## Quotation Management
Admin:
- Create
- Update
- Email
- Download PDF
- Convert to Invoice

Customer:
- View
- Download
- Accept
- Reject

## Invoice Management
Admin:
- Generate
- Email
- Track Payments

Customer:
- View
- Download
- Pay Online

## Payment Management
Supported:
- Razorpay
- Stripe
- UPI
- Net Banking
- Credit/Debit Card

Statuses:
- Pending
- Processing
- Paid
- Failed
- Refunded

## Support Ticket System
Customer:
- Raise Ticket
- Upload Files
- Reply
- Close

Admin:
- Assign
- Reply
- Resolve
- Close

## Communication
- Email
- SMS
- WhatsApp
- Push Notifications

## Reports
- Customers
- Leads
- Sales
- Revenue
- Invoices
- Payments
- Tickets

Export:
- PDF
- Excel
- CSV

## Analytics
- Revenue
- Sales Trends
- Customer Growth
- Lead Conversion
- Payment Collection

## Settings
- Company Profile
- SMTP
- Payment Gateway
- Taxes
- Notification Settings
- Backup Settings

## Audit Logs
Track:
- Login
- Profile Updates
- Customer Changes
- Invoice Changes
- Payments
- Ticket Activities
- Settings Changes

---

# 4. Non-Functional Requirements

## Performance
- API response <300 ms
- Support 500+ concurrent users

## Security
- JWT
- bcrypt
- HTTPS
- Rate Limiting
- Input Validation
- XSS & CSRF Protection
- Secure File Uploads
- Encrypted Sensitive Data

## Availability
- 99.9% uptime
- Daily Backups

## Scalability
- Modular Architecture
- REST APIs
- API Versioning

---

# 5. Database Collections

- Users
- Customers
- Leads
- Deals
- Products
- Quotations
- QuotationItems
- Invoices
- InvoiceItems
- Payments
- Tickets
- TicketReplies
- Notifications
- Activities
- AuditLogs
- Settings

---

# 6. Integrations

- MongoDB Atlas
- Cloudinary
- Razorpay
- Stripe
- Nodemailer
- WhatsApp Business API
- Firebase Cloud Messaging

---

# 7. Success Metrics

- Lead Conversion Rate
- Customer Retention
- Monthly Revenue
- Payment Success Rate
- Ticket Resolution Time
- Customer Satisfaction (CSAT)

---

# 8. Future Enhancements

- AI Insights
- Workflow Automation
- Mobile Apps
- Multi-language Support
- Multi-tenant SaaS
- Public API