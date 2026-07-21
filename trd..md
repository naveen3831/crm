# Admin Dashboard Requirements Script

## CRM Project

### Technology Stack

**Frontend**

* Next.js
* Tailwind CSS
* JavaScript or TypeScript
* Framer Motion for animations
* Recharts or Chart.js for analytics charts

**Backend**

* Node.js
* Express.js
* REST API architecture

**Database**

* MongoDB
* Mongoose

**Authentication**

* JWT access token
* Refresh token
* Role-based authorization
* Admin and Customer roles

---

# 1. Admin Dashboard Overview

The Admin Dashboard is the main control center of the CRM application.

The admin should be able to monitor customers, leads, deals, quotations, invoices, payments, support tickets, activities, and reports from a single dashboard.

The dashboard must be responsive and work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

The UI should use a modern glassmorphism design with smooth animations, transparent cards, blurred backgrounds, soft shadows, rounded corners, and interactive hover effects.

---

# 2. Admin Dashboard Layout

The Admin Dashboard should contain:

* Sidebar navigation
* Top navigation bar
* Dashboard summary cards
* Charts and analytics
* Recent activities
* Upcoming tasks
* Notifications
* Quick-action buttons

---

# 3. Sidebar Navigation

The admin sidebar should contain the following modules:

1. Dashboard
2. Customers
3. Leads
4. Deals
5. Products and Services
6. Quotations
7. Invoices
8. Payments
9. Support Tickets
10. Tasks
11. Calendar
12. Communications
13. Notifications
14. Reports
15. Analytics
16. Documents
17. Audit Logs
18. Settings
19. My Profile
20. Logout

The sidebar should support:

* Expand and collapse
* Active-page highlighting
* Mobile drawer view
* Icons for every module
* Smooth opening and closing animation
* Tooltip when collapsed
* Role-based menu rendering

---

# 4. Top Navigation Bar

The top navigation bar should contain:

* Page title
* Global search
* Notification icon
* Messages icon
* Full-screen option
* Theme switcher
* Admin profile image
* Profile dropdown

The profile dropdown should contain:

* My Profile
* Account Settings
* Change Password
* Logout

---

# 5. Dashboard Summary Cards

The dashboard should display important CRM statistics.

Required summary cards:

* Total Customers
* Active Customers
* New Leads
* Qualified Leads
* Open Deals
* Won Deals
* Total Revenue
* Pending Payments
* Overdue Invoices
* Open Support Tickets
* Pending Tasks
* Completed Tasks

Each card should display:

* Card title
* Total count
* Percentage increase or decrease
* Comparison with the previous month
* Relevant icon
* Small trend graph
* Click action to open the related module

Example:

**Total Customers**

* Total: 1,250
* Growth: +12.5%
* Compared with last month

---

# 6. Sales and Revenue Analytics

The Admin Dashboard should contain interactive charts.

Required charts:

## Revenue Overview

Display:

* Daily revenue
* Weekly revenue
* Monthly revenue
* Yearly revenue

Filters:

* Last 7 days
* Last 30 days
* Last 6 months
* Current year
* Custom date range

## Sales Performance

Display:

* Total sales
* Won deals
* Lost deals
* Conversion percentage
* Average deal value

## Lead Conversion Funnel

Stages:

* New
* Contacted
* Qualified
* Proposal Sent
* Negotiation
* Won
* Lost

## Payment Analytics

Display:

* Paid amount
* Pending amount
* Failed payments
* Refunded amount
* Overdue amount

## Ticket Analytics

Display:

* Open tickets
* In-progress tickets
* Waiting for customer
* Resolved tickets
* Closed tickets

All charts should support:

* Tooltips
* Hover details
* Date filters
* Export
* Loading skeletons
* Empty states

---

# 7. Quick Actions

The dashboard should provide quick-action buttons.

Required actions:

* Add Customer
* Create Lead
* Create Deal
* Add Product
* Create Quotation
* Generate Invoice
* Record Payment
* Create Task
* Schedule Meeting
* Create Support Ticket
* Send Notification

The quick actions can be displayed using:

* Floating action button
* Quick-action cards
* Dropdown menu
* Command palette

---

# 8. Customer Management

The admin should be able to manage all registered customers.

## Customer List

The customer table should display:

* Customer ID
* Profile image
* Full name
* Company name
* Email
* Phone
* Customer type
* Status
* Registration date
* Last activity
* Actions

## Customer Actions

The admin can:

* Add customer
* View customer
* Edit customer
* Activate customer
* Suspend customer
* Delete customer
* Export customer data
* Send email
* Send notification
* View activity history

## Customer Search and Filters

Search by:

* Customer name
* Email
* Phone
* Company
* Customer ID

Filter by:

* Active
* Inactive
* Suspended
* Individual
* Business
* Registration date

## Customer Profile

The customer details page should contain:

* Personal information
* Company information
* Contact information
* Address
* Leads
* Deals
* Quotations
* Invoices
* Payments
* Support tickets
* Documents
* Communication history
* Activity timeline

---

# 9. Lead Management

The admin should be able to create and manage leads.

## Lead Fields

* Lead ID
* Lead name
* Company
* Contact person
* Email
* Phone
* Lead source
* Budget
* Priority
* Status
* Expected closing date
* Description
* Notes
* Attachments
* Created date
* Updated date

## Lead Status

* New
* Contacted
* Qualified
* Proposal Sent
* Negotiation
* Won
* Lost

## Lead Priority

* Low
* Medium
* High
* Critical

## Admin Lead Actions

* Create lead
* Update lead
* Delete lead
* Change status
* Add notes
* Add attachments
* Schedule follow-up
* Convert lead into customer
* Convert lead into deal
* Mark lead as won
* Mark lead as lost

## Lead Views

The system should support:

* Table view
* Kanban board
* List view
* Pipeline view

The Kanban board should support drag-and-drop stage updates.

---

# 10. Deal Management

The admin should be able to manage the complete sales pipeline.

## Deal Fields

* Deal name
* Customer
* Related lead
* Product or service
* Deal amount
* Discount
* Tax
* Probability
* Expected closing date
* Stage
* Notes
* Attachments

## Deal Stages

* Prospect
* Qualification
* Proposal
* Negotiation
* Closed Won
* Closed Lost

## Deal Features

* Create deal
* Update deal
* Move deal between stages
* Add notes
* Add files
* Schedule meetings
* Update probability
* Mark won
* Mark lost
* Record lost reason
* Convert deal into quotation

---

# 11. Product and Service Management

The admin should manage CRM products and services.

## Product Fields

* Product ID
* Product name
* SKU
* Category
* Product type
* Description
* Price
* Discount
* Tax
* Image
* Status
* Created date

## Product Actions

* Add product
* Edit product
* Delete product
* Activate product
* Deactivate product
* Upload images
* Manage categories
* Export product list

---

# 12. Quotation Management

The admin should be able to create and send quotations.

## Quotation Fields

* Quotation number
* Customer
* Issue date
* Expiry date
* Product or service items
* Quantity
* Unit price
* Discount
* Tax
* Subtotal
* Grand total
* Terms and conditions
* Notes
* Status

## Quotation Status

* Draft
* Sent
* Viewed
* Accepted
* Rejected
* Expired
* Converted

## Quotation Actions

* Create quotation
* Edit quotation
* Preview quotation
* Download PDF
* Send by email
* Send notification
* Duplicate quotation
* Convert quotation into invoice
* Cancel quotation

---

# 13. Invoice Management

The admin should be able to generate and manage invoices.

## Invoice Fields

* Invoice number
* Customer
* Quotation reference
* Issue date
* Due date
* Items
* Quantity
* Price
* Discount
* Tax
* Subtotal
* Total
* Paid amount
* Due amount
* Payment status
* Notes

## Invoice Status

* Draft
* Sent
* Partially Paid
* Paid
* Pending
* Overdue
* Cancelled

## Invoice Actions

* Generate invoice
* Edit invoice
* Send invoice
* Download PDF
* Record offline payment
* Send payment reminder
* Mark as paid
* Cancel invoice
* Duplicate invoice

---

# 14. Payment Management

The admin should monitor all customer payments.

## Payment Fields

* Payment ID
* Invoice number
* Customer
* Amount
* Payment method
* Transaction ID
* Payment date
* Payment status
* Gateway response
* Notes

## Payment Status

* Pending
* Processing
* Paid
* Failed
* Refunded
* Partially Refunded

## Payment Methods

* Razorpay
* Stripe
* UPI
* Credit card
* Debit card
* Net banking
* Bank transfer
* Cash

## Payment Actions

* View payment
* Verify payment
* Record payment
* Refund payment
* Download receipt
* Export payment report

---

# 15. Support Ticket Management

The admin should manage customer support requests.

## Ticket Fields

* Ticket ID
* Customer
* Subject
* Description
* Category
* Priority
* Status
* Attachments
* Created date
* Updated date

## Ticket Priority

* Low
* Medium
* High
* Critical

## Ticket Status

* Open
* Assigned
* In Progress
* Waiting for Customer
* Resolved
* Closed

## Ticket Actions

* View ticket
* Reply to customer
* Add internal note
* Change priority
* Change status
* Resolve ticket
* Close ticket
* Reopen ticket
* Download attachments

The ticket page should display the complete conversation thread.

---

# 16. Task Management

The admin should create and manage CRM tasks.

## Task Types

* Call
* Email
* Meeting
* Follow-up
* Demo
* Payment Reminder
* General Task

## Task Fields

* Title
* Description
* Related customer
* Related lead
* Related deal
* Due date
* Reminder
* Priority
* Status
* Notes

## Task Status

* Pending
* In Progress
* Completed
* Cancelled
* Overdue

---

# 17. Calendar Management

The admin calendar should display:

* Meetings
* Calls
* Follow-ups
* Tasks
* Invoice due dates
* Quotation expiry dates
* Customer reminders

Views:

* Day view
* Week view
* Month view
* Agenda view

Features:

* Create event
* Edit event
* Delete event
* Drag and drop
* Event reminders
* Filter by event type

---

# 18. Communication Center

The admin should be able to communicate with customers.

## Email

* Send individual email
* Send bulk email
* Use email templates
* Attach files
* View email history

## SMS

* Send OTP
* Send alerts
* Send payment reminders
* Send ticket updates

## WhatsApp

* Send text messages
* Send quotation
* Send invoice
* Send payment reminder
* Send attachments

## Communication History

The admin should be able to view:

* Sent emails
* SMS records
* WhatsApp messages
* Notifications
* Delivery status
* Failed messages

---

# 19. Notification Management

The admin should manage in-app and external notifications.

## Notification Triggers

* New customer registration
* New lead creation
* Quotation created
* Quotation accepted
* Invoice generated
* Payment completed
* Payment failed
* Ticket created
* Ticket replied
* Ticket resolved
* Task reminder

## Notification Channels

* In-app
* Email
* SMS
* WhatsApp
* Browser push

---

# 20. Reports

The admin should access detailed CRM reports.

Required reports:

* Customer report
* Lead report
* Lead conversion report
* Deal report
* Sales report
* Revenue report
* Quotation report
* Invoice report
* Payment report
* Support ticket report
* Task report
* Activity report

Report filters:

* Date range
* Customer
* Lead status
* Deal stage
* Payment status
* Ticket status

Export formats:

* PDF
* Excel
* CSV

---

# 21. Analytics

The analytics module should provide:

* Customer growth
* Lead source performance
* Lead conversion rate
* Sales performance
* Revenue trends
* Average deal value
* Quotation acceptance rate
* Payment collection rate
* Ticket resolution time
* Customer activity

---

# 22. Document Management

The admin should manage uploaded documents.

Document types:

* Agreements
* Contracts
* Quotations
* Invoices
* Payment receipts
* Customer identification
* Product documents
* Support attachments

Features:

* Upload
* Preview
* Download
* Delete
* Search
* Filter
* File validation
* Access control

Supported file formats:

* PDF
* JPG
* JPEG
* PNG
* DOCX
* XLSX

---

# 23. Audit Logs

The system should record important admin and customer activities.

Track:

* Login
* Logout
* Failed login
* Customer creation
* Customer update
* Customer deletion
* Lead changes
* Deal changes
* Quotation changes
* Invoice changes
* Payment updates
* Ticket updates
* Settings changes
* Document downloads
* Export actions

Audit log fields:

* User
* Role
* Action
* Module
* IP address
* Device
* Browser
* Date and time
* Previous value
* Updated value

---

# 24. Admin Settings

The settings module should contain:

## Company Settings

* Company name
* Company logo
* Address
* Phone
* Email
* Website
* GST number

## Email Settings

* SMTP host
* SMTP port
* SMTP username
* SMTP password
* Sender email
* Sender name

## Payment Settings

* Razorpay keys
* Stripe keys
* Currency
* Payment methods

## Tax Settings

* Tax name
* Tax percentage
* GST configuration

## Invoice Settings

* Invoice prefix
* Starting invoice number
* Invoice template
* Payment terms
* Footer text

## Notification Settings

* Email notifications
* SMS notifications
* WhatsApp notifications
* Push notifications

## Security Settings

* Password policy
* Session timeout
* Login attempt limit
* Two-factor authentication
* IP restrictions

---

# 25. Admin Profile

The admin should be able to:

* View profile
* Edit profile
* Upload profile picture
* Change email
* Change password
* Enable two-factor authentication
* View active sessions
* Logout from all devices

---

# 26. Glassmorphism UI Requirements

The admin dashboard should use a professional glassmorphism design.

## Design Style

* Transparent cards
* Background blur
* Subtle borders
* Soft shadows
* Gradient backgrounds
* Rounded corners
* Clean typography
* Minimal color palette

## Recommended Glass Card Classes

```css
backdrop-blur-xl
bg-white/10
border
border-white/20
shadow-xl
rounded-2xl
```

## Animation Requirements

Use Framer Motion for:

* Page transitions
* Sidebar animations
* Card entrance animations
* Modal animations
* Dropdown animations
* Chart loading animations
* Button hover effects
* Notification animations
* Table row animations

Animations should be smooth and professional.

Avoid excessive animation that reduces usability or performance.

---

# 27. Backend API Requirements

The backend should use Node.js and Express.js.

Recommended API structure:

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
/api/v1/notifications
/api/v1/reports
/api/v1/settings
```

Every API should support:

* Authentication
* Authorization
* Validation
* Error handling
* Pagination
* Search
* Sorting
* Filtering
* Audit logging

---

# 28. Admin Authorization Requirements

Only users with the `admin` role should access admin routes.

Example protected route logic:

```javascript
router.get(
  "/admin/dashboard",
  protect,
  roleCheck("admin"),
  getAdminDashboard
);
```

The backend must verify the admin role.

Frontend route protection alone is not sufficient.

---

# 29. MongoDB Collections

Required collections:

* users
* customers
* leads
* deals
* products
* categories
* quotations
* quotationItems
* invoices
* invoiceItems
* payments
* tickets
* ticketReplies
* tasks
* calendarEvents
* notifications
* communications
* documents
* activities
* auditLogs
* settings

All collections should include:

* createdAt
* updatedAt
* createdBy
* updatedBy
* status

Soft deletion should be used for important business records.

---

# 30. Validation and Error Handling

All forms should include:

* Required field validation
* Email validation
* Phone number validation
* Password validation
* Amount validation
* Date validation
* File-size validation
* File-type validation

The API should return consistent error responses.

Example:

```json
{
  "success": false,
  "message": "Customer email already exists",
  "errors": []
}
```

---

# 31. Security Requirements

* JWT authentication
* Refresh tokens
* bcrypt password hashing
* Role-based authorization
* Rate limiting
* Helmet security headers
* CORS configuration
* Input sanitization
* MongoDB injection protection
* XSS protection
* Secure cookies
* HTTPS
* Secure file uploads
* Environment variables
* Audit logs

---

# 32. Performance Requirements

* Use MongoDB indexes
* Implement pagination
* Use server-side filtering
* Optimize images
* Use lazy loading
* Use API caching where required
* Use Next.js dynamic imports
* Avoid unnecessary React re-renders
* Use loading skeletons
* Compress API responses

Target performance:

* Common API response below 300 milliseconds
* Dashboard initial loading below 3 seconds
* Support at least 500 concurrent users
* Responsive UI on all supported devices

---

# 33. Admin Dashboard Acceptance Criteria

The Admin Dashboard is complete when:

* Only admins can access it
* Dashboard statistics are loaded from APIs
* Charts use live MongoDB data
* Customers can be managed
* Leads can be tracked and converted
* Deals can be moved through stages
* Quotations can be generated
* Invoices can be created
* Payments can be tracked
* Tickets can be resolved
* Reports can be exported
* Notifications work correctly
* All critical activities are logged
* The UI is responsive
* Glassmorphism effects are consistent
* Animations do not affect performance
* Proper loading, empty, success, and error states are available
    