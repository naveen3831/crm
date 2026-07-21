# CRM Updated Design Specification

**File:** `design.md`  
**Project:** Customer Relationship Management System  
**Design Direction:** Premium enterprise CRM  
**Reference:** Updated CRM UI concept generated from the project logo  
**Frontend:** Next.js  
**Styling:** Tailwind CSS  
**Animations:** Framer Motion  
**Roles:** Admin and Customer  

---

# 1. Design Overview

The updated CRM design uses the project logo as the main visual foundation.

The interface combines:

- Dark navy enterprise branding
- Bright blue primary actions
- Red, amber, and green CRM pipeline colors
- Clean white dashboard surfaces
- Soft glassmorphism
- Rounded professional cards
- Data-focused charts
- Responsive desktop and mobile layouts
- Smooth, purposeful animations

The final product must feel like a modern enterprise CRM platform, not a generic admin template.

---

# 2. Logo-Based Design Direction

The logo contains:

- A navy magnifying glass
- Blue orbit lines
- Red, amber, and green growth bars
- Pixel-style data details
- Bold CRM lettering
- White background
- Business analysis symbolism

These logo elements must guide the complete design system.

## Visual Meaning

```text
Magnifying Glass  -> Customer search and insights
Orbit             -> Connected CRM ecosystem
Red Bar           -> New leads or risk stage
Amber Bar         -> Opportunity or proposal stage
Green Bar         -> Conversion and business growth
Pixels            -> Digital data and automation
Navy              -> Trust, security, and enterprise quality
Blue              -> Technology and intelligence
```

---

# 3. Brand Personality

The interface must communicate:

- Trust
- Growth
- Control
- Intelligence
- Clarity
- Security
- Automation
- Professionalism
- Reliability
- Scalability

## Brand Keywords

```text
Enterprise
Intelligent
Connected
Data-Driven
Professional
Modern
Reliable
Secure
Fast
Premium
```

---

# 4. Main Color System

## 4.1 Primary Navy

```css
--navy-950: #041429;
--navy-900: #071D38;
--navy-850: #0B2747;
--navy-800: #103456;
--navy-700: #17446B;
--navy-600: #205882;
```

Use navy for:

- Sidebar
- Footer
- Main headings
- Hero backgrounds
- Dashboard navigation
- Mobile navigation header
- Strong text
- Enterprise sections

## 4.2 Primary Blue

```css
--blue-700: #0057C8;
--blue-600: #006FE8;
--blue-500: #1687F8;
--blue-400: #55A8FF;
--blue-300: #91C7FF;
--blue-200: #C4E1FF;
--blue-100: #E5F2FF;
--blue-50:  #F3F9FF;
```

Use blue for:

- Primary buttons
- Active navigation
- Links
- Focus states
- Main charts
- Search controls
- Selected tabs
- Call-to-action sections

## 4.3 CRM Pipeline Colors

### Red

```css
--pipeline-red-600: #D92E35;
--pipeline-red-500: #EE4047;
--pipeline-red-100: #FCE4E6;
```

Use for:

- New leads
- Lost deals
- Failed payments
- Overdue invoices
- Critical notifications

### Amber

```css
--pipeline-amber-600: #E38B00;
--pipeline-amber-500: #FF9F0A;
--pipeline-amber-400: #FFB726;
--pipeline-amber-100: #FFF1D5;
```

Use for:

- Qualified leads
- Proposal stage
- Pending payments
- Draft quotations
- Waiting tickets

### Green

```css
--pipeline-green-600: #169B45;
--pipeline-green-500: #27C15A;
--pipeline-green-100: #DEF8E7;
```

Use for:

- Won deals
- Paid invoices
- Active Customers
- Completed tasks
- Successful operations

## 4.4 Neutral Colors

```css
--gray-950: #111827;
--gray-900: #1F2937;
--gray-800: #283548;
--gray-700: #3C4A5D;
--gray-600: #5C6979;
--gray-500: #7B8794;
--gray-400: #A4AFBA;
--gray-300: #CDD5DD;
--gray-200: #E4E9EF;
--gray-100: #F1F4F7;
--gray-50:  #F8FAFC;
--white:    #FFFFFF;
```

---

# 5. Color Balance

Use the following approximate balance:

```text
White and light gray: 62%
Navy: 20%
Blue: 12%
Red, amber, and green combined: 6%
```

The red, amber, and green colors should mainly communicate CRM stages and status.

Do not use the pipeline colors as random decoration.

---

# 6. Gradient System

## 6.1 Hero Gradient

```css
background:
  radial-gradient(circle at 15% 20%, rgba(22, 135, 248, 0.22), transparent 34%),
  radial-gradient(circle at 82% 18%, rgba(85, 168, 255, 0.14), transparent 30%),
  linear-gradient(135deg, #041429 0%, #071D38 52%, #103456 100%);
```

## 6.2 Primary Button Gradient

```css
background: linear-gradient(135deg, #0057C8 0%, #1687F8 100%);
```

## 6.3 CRM Growth Gradient

```css
background: linear-gradient(
  90deg,
  #EE4047 0%,
  #FF9F0A 48%,
  #27C15A 100%
);
```

Use only for:

- Funnel illustrations
- Growth indicators
- Workflow diagrams
- Landing-page CRM journey
- Small brand details

## 6.4 Trust Banner Gradient

```css
background: linear-gradient(135deg, #0057C8 0%, #4B35B9 100%);
```

---

# 7. Typography

## Primary Font

```text
Manrope
```

## Secondary Font

```text
Inter
```

## Font Usage

Use Manrope for:

- Main headings
- Section headings
- Buttons
- Marketing content
- Dashboard card values

Use Inter for:

- Tables
- Filters
- Form labels
- Metadata
- Tooltips
- Small interface text

## Typography Scale

```text
Display XL: 68px / 1.05 / 750
Display LG: 56px / 1.08 / 750
Display MD: 46px / 1.12 / 700
Heading 1: 40px / 1.18 / 700
Heading 2: 32px / 1.22 / 700
Heading 3: 26px / 1.28 / 650
Heading 4: 21px / 1.32 / 650
Body Large: 18px / 1.70 / 400
Body Medium: 16px / 1.65 / 400
Body Small: 14px / 1.55 / 400
Caption: 12px / 1.45 / 500
Button: 14px–16px / 1 / 650
```

---

# 8. Spacing System

Use an 8-point spacing system.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
120px
```

## Section Spacing

```text
Public desktop: 96px–120px
Public tablet: 72px–88px
Public mobile: 56px–72px
Dashboard page spacing: 24px–32px
Card inner spacing: 20px–28px
```

---

# 9. Border Radius

```text
Inputs: 10px
Buttons: 10px
Small cards: 12px
Dashboard cards: 16px
Feature cards: 18px
Large panels: 24px
Hero product frame: 28px
Pills: 999px
```

The design should be rounded but not cartoon-like.

---

# 10. Shadows and Borders

## Standard Card Shadow

```css
box-shadow:
  0 14px 38px rgba(4, 20, 41, 0.08),
  0 3px 10px rgba(4, 20, 41, 0.04);
```

## Elevated Dashboard Shadow

```css
box-shadow:
  0 20px 55px rgba(4, 20, 41, 0.10);
```

## Hero Product Shadow

```css
box-shadow:
  0 38px 100px rgba(4, 20, 41, 0.26),
  0 14px 36px rgba(22, 135, 248, 0.14);
```

## Standard Border

```css
border: 1px solid rgba(16, 52, 86, 0.10);
```

## Active Border

```css
border: 1px solid rgba(22, 135, 248, 0.36);
```

---

# 11. Glassmorphism

Use glassmorphism only in selected areas.

## Dark Glass

```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(18px);
border: 1px solid rgba(255, 255, 255, 0.14);
```

## Light Glass

```css
background: rgba(255, 255, 255, 0.82);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.92);
```

## Use Glassmorphism For

- Sticky public navbar
- Hero metric cards
- Product screenshot frame
- Notification dropdown
- Mobile drawer
- Modal
- Search command menu
- Quick-action panel

## Avoid Glassmorphism For

- Large tables
- Long forms
- Reports
- Invoices
- Legal pages
- Ticket conversations

---

# 12. Public Website Structure

The public website should contain:

```text
Home
About Us
Features
Pricing
Blogs
FAQ
Contact Us
Privacy Policy
Terms and Conditions
Login
Customer Registration
```

Admin registration must not exist.

---

# 13. Public Navbar Design

## Desktop Layout

```text
Logo | Home | About Us | Features | Pricing | Blogs | Contact Us | Login | Get Started
```

## Style

- White background on regular sections
- Transparent glass effect over the hero
- Sticky after scroll
- Logo on the left
- Navigation links centered
- Login button as outline
- Get Started button as blue gradient
- 72px–80px height
- Thin bottom border after scrolling

## Active Link

```css
color: #0057C8;
font-weight: 650;
```

Use a short blue underline animation.

---

# 14. Home Page Design

## 14.1 Hero Section

### Layout

Desktop:

```text
Left side:
- Small CRM badge
- Strong headline
- Supporting paragraph
- Primary CTA
- Secondary CTA
- Trust note

Right side:
- CRM dashboard preview
- Logo magnifying-glass visual
- Floating metric cards
- Orbit line
- Pipeline color nodes
```

### Suggested Headline

```text
Manage Relationships.
Drive Growth.
```

The words `Drive Growth` may use a controlled blue-to-green highlight.

### Primary CTA

```text
Get Started Free
```

### Secondary CTA

```text
Watch Demo
```

### Background

- White or very light blue
- Soft blue radial glow
- Faint grid pattern
- Curved blue orbit line
- Small red, amber, and green pixels

---

## 14.2 Feature Strip

Below the hero, display four short benefits:

```text
360° Customer View
Smart Automation
Powerful Analytics
Secure and Reliable
```

Each item should have:

- Small pastel icon background
- One-line heading
- Short description
- Subtle hover lift

---

## 14.3 Main Features Section

Title:

```text
Everything You Need in One CRM
```

Use a three-column card grid.

Feature cards:

- Lead Management
- Deal Tracking
- Tasks and Activities
- Reports and Analytics
- Customer Support
- Invoicing and Payments

Each card should have:

- Icon
- Title
- Short description
- White background
- Soft border
- Hover elevation
- Blue arrow on hover

---

## 14.4 Trust Metrics Banner

Use a navy-to-indigo gradient banner.

Metrics:

```text
500+ Happy Customers
20K+ Active Users
1M+ Data Records
99.9% Uptime
```

Animate values when the section enters the viewport.

---

## 14.5 Team Use Cases

Create a four-column section:

- Sales Teams
- Support Teams
- Marketing Teams
- Business Owners

Use round icon containers with blue accents.

---

## 14.6 Product Preview Section

Show:

- Desktop CRM dashboard
- Tablet preview
- Mobile preview
- Floating labels
- Highlighted analytics cards

The product preview should feel layered and premium.

---

## 14.7 Footer

Use dark navy.

Columns:

- Logo and description
- Quick Links
- Product
- Support
- Newsletter
- Social links
- Privacy Policy
- Terms and Conditions

---

# 15. About Us Page

## Sections

- Hero
- Company story
- Mission
- Vision
- Core values
- CRM philosophy
- Growth timeline
- Technology approach
- Why choose us
- CTA

## Visual Style

- Alternating white and light-blue sections
- Timeline using the logo's orbit style
- Green milestones for completed achievements
- Blue progress connectors
- Professional business illustrations

---

# 16. Contact Us Page

## Layout

Desktop:

```text
Left:
- Contact information
- Business hours
- Email
- Phone
- Address
- Social links

Right:
- Contact form card
```

## Contact Form Fields

- Full name
- Email
- Phone
- Company
- Subject
- Message
- Consent checkbox

Use a solid white card with strong readability.

---

# 17. FAQ Page

Use:

- Search field
- Category tabs
- Accordion list
- Contact support CTA

Accordion animation:

- 220ms height transition
- Rotating chevron
- Blue active heading
- Soft blue background on open item

---

# 18. Blogs Page

## Blog Listing

Include:

- Featured blog
- Blog card grid
- Search
- Category filters
- Pagination
- Author
- Date
- Reading time

## Blog Card

- 16:9 image
- Category badge
- Title
- Description
- Author
- Date
- Hover image zoom
- Arrow animation

---

# 19. Authentication Pages

## Pages

- Login
- Customer Registration
- Forgot Password
- Reset Password
- Email Verification

## Layout

Desktop split screen:

```text
Left:
- Branding
- CRM illustration
- Growth bars
- Orbit animation
- Business benefits

Right:
- Authentication form
```

Mobile:

- Logo at top
- Form first
- Illustration hidden or simplified

## Important Rule

Customer registration must not include role selection.

Admin cannot register.

---

# 20. Admin Dashboard Layout

## Sidebar

- Dark navy background
- Full logo at top
- White menu icons
- Blue active item
- Rounded active menu background
- Red notification badge
- Upgrade or support card at the bottom

## Sidebar Items

```text
Dashboard
Customers
Leads
Deals
Products
Quotations
Invoices
Payments
Tasks
Calendar
Tickets
Reports
Notifications
Blogs
Documents
Audit Logs
Settings
Profile
Logout
```

## Top Navbar

Include:

- Mobile menu button
- Global search
- Add button
- Notifications
- Settings shortcut
- Admin avatar
- Name
- Role
- Dropdown

---

# 21. Admin Dashboard Home

## Summary Cards

Display:

- Total Customers
- New Leads
- Open Deals
- Revenue

Each card contains:

- Label
- Large value
- Percentage comparison
- Circular icon
- Optional sparkline
- Hover elevation

## Main Charts

### Sales Overview

- Line chart
- Revenue
- Deals
- Invoices
- Date filter
- Tooltip
- Smooth line animation

### Deal Pipeline

Use a funnel with:

```text
New
Qualified
Proposal
Negotiation
Won
```

Color flow:

```text
Red
Orange
Amber
Green
Blue
```

## Activity Panels

- Recent Activities
- Top Customers
- Recent Payments
- Upcoming Tasks
- Open Tickets

---

# 22. Admin Data Table Design

Use a solid white card.

## Table Features

- Search
- Filters
- Sort
- Pagination
- Bulk selection
- Column visibility
- Export
- Sticky header
- Row actions
- Status badges

## Row Hover

```css
background: #F3F9FF;
```

## Table Header

```css
background: #F8FAFC;
color: #3C4A5D;
font-weight: 650;
```

---

# 23. Customer Management Design

## Customer List

Columns:

- Customer
- Company
- Email
- Phone
- Status
- Total value
- Last activity
- Actions

## Customer Profile

Tabs:

- Overview
- Leads
- Deals
- Quotations
- Invoices
- Payments
- Tickets
- Documents
- Activity

The profile header should show:

- Avatar
- Customer name
- Company
- Status
- Contact actions
- Customer value
- Last interaction

---

# 24. Leads Design

## Views

- Table view
- Kanban view

## Kanban Columns

```text
New
Contacted
Qualified
Proposal
Negotiation
Won
Lost
```

Use semantic colors only in:

- Column top border
- Small status badge
- Progress indicator

Cards remain mostly white.

---

# 25. Deals Design

## Deal Pipeline

Use a professional Kanban layout with:

- Deal name
- Customer
- Value
- Expected close date
- Probability
- Assignee
- Next activity

Drag animations should be subtle.

---

# 26. Quotations Design

## Quotation Builder

Layout:

```text
Left main area:
- Customer information
- Line items
- Tax and discount
- Terms

Right summary:
- Subtotal
- Discount
- Tax
- Grand total
- Save draft
- Preview
- Send
```

Use a white invoice-style surface.

---

# 27. Invoices and Payments Design

## Invoice Status Colors

```text
Draft -> Gray
Sent -> Blue
Pending -> Amber
Partially Paid -> Orange
Paid -> Green
Overdue -> Red
Cancelled -> Gray
```

## Payment Cards

Display:

- Payment amount
- Method
- Transaction ID
- Invoice number
- Status
- Date

Use green only after payment verification.

---

# 28. Tickets Design

## Ticket List

Show:

- Ticket number
- Customer
- Subject
- Priority
- Status
- Last response
- Created date

## Conversation Layout

- Solid white message area
- Customer messages aligned left
- Admin messages aligned right
- Soft blue admin message background
- Attachments displayed as compact cards
- Reply box fixed near bottom

---

# 29. Customer Dashboard

## Sidebar

Use dark navy but simplify the menu.

```text
Dashboard
My Profile
My Quotations
My Invoices
My Payments
Support Tickets
Documents
Notifications
Settings
Logout
```

## Dashboard Cards

- Quotations
- Pending Invoices
- Payments
- Open Tickets

## Mobile Design

Use:

- Dark navy top header
- Two-column metric cards
- Compact chart
- Bottom navigation
- Floating notifications
- Responsive cards

---

# 30. Component System

## Buttons

### Primary

- Blue gradient
- White text
- 10px radius
- 44px–48px height
- Subtle shadow
- Hover lift

### Secondary

- White background
- Navy text
- Gray border

### Danger

- Red background
- White text

### Success

- Green background
- White text

### Ghost

- Transparent
- Navy or blue text

---

# 31. Inputs

## Standard Input

- 44px–48px height
- 10px radius
- Gray border
- White background
- Strong label
- Blue focus ring
- Error text below

## Input States

- Default
- Hover
- Focus
- Filled
- Disabled
- Error
- Success

---

# 32. Status Badges

Use pastel backgrounds.

```text
Active: green
Pending: amber
Failed: red
Draft: gray
In Progress: blue
Completed: green
Overdue: red
```

Badges should be compact and readable.

---

# 33. Charts

Use the logo color system.

## Main Chart Colors

```text
Primary series: Blue
Secondary series: Amber
Success series: Green
Risk series: Red
Neutral comparison: Gray
```

## Chart Rules

- Use subtle grid lines.
- Avoid 3D charts.
- Use smooth tooltips.
- Keep labels readable.
- Use animations only on initial load.
- Use accessible legends.

---

# 34. Animation System

## 34.1 Logo Animation

On page load:

1. Magnifying glass fades and scales in.
2. Blue orbit line draws around the bars.
3. Red bar rises.
4. Amber bar rises.
5. Green bar rises.
6. Pixel squares appear upward.
7. CRM wordmark fades in.

Run once only.

## 34.2 Hero Animation

- Headline fades upward
- CTA buttons appear with stagger
- Dashboard preview scales in
- Orbit line rotates slowly
- Floating cards move slightly
- Decorative pixels pulse

## 34.3 Page Transition

```javascript
{
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1]
  }
}
```

## 34.4 Card Reveal

```javascript
{
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
}
```

## 34.5 Button Motion

```javascript
{
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 }
}
```

## 34.6 Sidebar Animation

- Width transition: 260ms
- Icon rotation: none
- Label fade: 160ms
- Active item glow: subtle
- Mobile drawer: slide from left

## 34.7 Chart Animation

- Line draw
- Bar rise
- Funnel scale
- Number count-up
- Tooltip fade

## 34.8 Reduced Motion

When `prefers-reduced-motion` is active:

- Disable orbit rotation
- Disable parallax
- Remove large transforms
- Use simple fades
- Show charts immediately

---

# 35. Responsive Design

## Desktop

- Full navigation
- Expanded sidebar
- Multi-column layout
- Large product visuals
- Four-card statistics row

## Tablet

- Collapsible sidebar
- Two-column dashboards
- Reduced spacing
- Simplified navigation

## Mobile

- Drawer navigation
- Bottom navigation for Customer Dashboard
- One or two-column cards
- Horizontally scrollable tables
- Sticky mobile actions
- Simplified charts
- Full-width forms

## Breakpoints

```text
Mobile: 0–639px
Large mobile: 640–767px
Tablet: 768–1023px
Laptop: 1024–1279px
Desktop: 1280–1535px
Large desktop: 1536px+
```

---

# 36. Accessibility

The design must support:

- WCAG AA contrast
- Keyboard navigation
- Visible focus states
- Screen-reader labels
- Semantic headings
- Form validation messages
- Accessible charts
- Reduced motion
- 44px minimum touch targets
- Clear error states
- No status communication through color alone

---

# 37. Tailwind Design Tokens

```javascript
const colors = {
  navy: {
    950: "#041429",
    900: "#071D38",
    850: "#0B2747",
    800: "#103456",
    700: "#17446B",
    600: "#205882"
  },
  blue: {
    700: "#0057C8",
    600: "#006FE8",
    500: "#1687F8",
    400: "#55A8FF",
    300: "#91C7FF",
    200: "#C4E1FF",
    100: "#E5F2FF",
    50: "#F3F9FF"
  },
  pipeline: {
    red: "#EE4047",
    amber: "#FF9F0A",
    green: "#27C15A"
  }
};
```

---

# 38. Design Quality Rules

## Do

- Keep layouts clean.
- Use consistent spacing.
- Use navy and blue as the main colors.
- Use pipeline colors for status.
- Keep charts easy to understand.
- Use motion to explain hierarchy.
- Preserve strong contrast.
- Use white space generously.
- Maintain consistent icon style.
- Use responsive behavior on every page.

## Do Not

- Use too many gradients.
- Make every card glass.
- Add excessive glow.
- Use red, amber, and green randomly.
- Use cartoon illustrations.
- Over-animate data tables.
- Use very small text.
- Use multiple font families.
- Copy another CRM interface exactly.
- Show Admin registration.

---

# 39. Final Acceptance Criteria

The updated design is complete when:

- The UI clearly reflects the CRM logo.
- Navy and blue are the dominant brand colors.
- Red, amber, and green represent CRM stages.
- The public website matches the updated visual concept.
- The Admin Dashboard uses a dark navy sidebar.
- The Customer Dashboard is simplified and responsive.
- Charts use the logo color system.
- Public pages are professional and conversion-focused.
- Forms and tables are easy to read.
- Mobile layouts work correctly.
- Framer Motion animations are smooth.
- Reduced-motion accessibility is supported.
- Admin registration is not available.
- The complete interface feels like one consistent enterprise CRM product.