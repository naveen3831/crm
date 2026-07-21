const CRMRecord = require("./crm.model");

// Seeding helper to ensure the user gets a working starting setup
const seedInitialData = async () => {
  const count = await CRMRecord.countDocuments();
  if (count > 0) return;

  console.log("[Database Seeding] Database is empty, seeding initial CRM records...");

  const initialRecords = [
    // Clients
    {
      type: "client",
      customId: "CLI-1002",
      data: {
        id: "CLI-1002",
        name: "Marcus Vance",
        company: "Vanguard Retail Inc",
        email: "m.vance@vanguard.com",
        phone: "+91 98452 10245",
        whatsapp: "+91 98452 10245",
        address: "M G Road, Bangalore, KA, 560001",
        industry: "Retail",
        type: "Existing",
        assignedEmployee: "Nisha Rao (Sales Lead)",
        status: "Active",
        notes: "High priority client. Handles large scale retail logistics.",
        createdDate: "2026-06-12"
      }
    },
    {
      type: "client",
      customId: "CLI-1003",
      data: {
        id: "CLI-1003",
        name: "Sarah Jenkins",
        company: "AeroSpace Logistics",
        email: "s.jenkins@aerolog.com",
        phone: "+91 74502 99401",
        whatsapp: "+91 74502 99401",
        address: "Whitefield Tech Park, Bangalore, KA, 560066",
        industry: "Transportation",
        type: "Existing",
        assignedEmployee: "Devon Miller (Account Executive)",
        status: "Active",
        notes: "Requirements include secure real-time GPS tracking.",
        createdDate: "2026-05-18"
      }
    },
    {
      type: "client",
      customId: "CLI-1004",
      data: {
        id: "CLI-1004",
        name: "John Doe",
        company: "Acme Corporation",
        email: "john@acme.com",
        phone: "+1 (555) 459-0012",
        whatsapp: "+1 (555) 459-0012",
        address: "Silicon Valley Boulevard, Suite 400, CA",
        industry: "Manufacturing",
        type: "Potential",
        assignedEmployee: "Nisha Rao (Sales Lead)",
        status: "Potential",
        notes: "Looking to deploy a fully-integrated invoice tracker dashboard.",
        createdDate: "2026-07-02"
      }
    },
    // Calls
    {
      type: "call",
      customId: "CAL-8802",
      data: {
        id: "CAL-8802",
        clientId: "CLI-1002",
        clientName: "Marcus Vance",
        phoneNumber: "+91 98452 10245",
        calledBy: "Nisha Rao",
        type: "Outgoing",
        date: "2026-07-21",
        startTime: "10:30 AM",
        endTime: "10:45 AM",
        duration: "15 mins",
        status: "Completed",
        purpose: "Project discussion",
        notes: "Discussed database schema migrations and estimated pricing.",
        followUpDate: "2026-07-25",
        nextAction: "Send quotation review PDF"
      }
    },
    {
      type: "call",
      customId: "CAL-8803",
      data: {
        id: "CAL-8803",
        clientId: "CLI-1004",
        clientName: "John Doe",
        phoneNumber: "+1 (555) 459-0012",
        calledBy: "Marcus Vance",
        type: "Follow-up",
        date: "2026-07-21",
        startTime: "11:15 AM",
        endTime: "11:20 AM",
        duration: "5 mins",
        status: "Connected",
        purpose: "Sales call",
        notes: "Checked lead qualification criteria and budget limits.",
        followUpDate: "2026-07-28",
        nextAction: "Schedule zoom presentation"
      }
    },
    // Leads
    {
      type: "lead",
      customId: "LEA-4001",
      data: {
        id: "LEA-4001",
        name: "Alex River",
        companyName: "River Logistics Co",
        email: "alex@riverlog.com",
        phone: "+91 88450 11928",
        whatsapp: "+91 88450 11928",
        source: "Google Ads",
        interestedService: "GPS API Integrations",
        expectedBudget: 15000,
        assignedEmployee: "Nisha Rao",
        priority: "High",
        leadScore: 85,
        nextFollowUpDate: "2026-07-24",
        notes: "Highly qualified lead. Intends to convert before end of quarter.",
        status: "Qualified",
        createdDate: "2026-07-15"
      }
    },
    {
      type: "lead",
      customId: "LEA-4002",
      data: {
        id: "LEA-4002",
        name: "Elena Rostova",
        companyName: "Rostov Tech Inc",
        email: "elena@rostovtech.ru",
        phone: "+7 910 445-1299",
        whatsapp: "+7 910 445-1299",
        source: "Website",
        interestedService: "CRM Cloud Setup",
        expectedBudget: 8000,
        assignedEmployee: "Devon Miller",
        priority: "Medium",
        leadScore: 60,
        nextFollowUpDate: "2026-07-26",
        notes: "Filled contact form. Requested email callbacks.",
        status: "New",
        createdDate: "2026-07-20"
      }
    },
    // Projects
    {
      type: "project",
      customId: "PRJ-901",
      data: {
        id: "PRJ-901",
        name: "Enterprise Database Migration & Setup",
        clientName: "Vanguard Retail Inc",
        category: "Database Integration",
        manager: "Nisha Rao",
        teamMembers: ["Karan (Backend Developer)", "Sophia (Testing Specialist)"],
        startDate: "2026-06-15",
        expectedCompletionDate: "2026-08-30",
        budget: 45000,
        priority: "High",
        description: "Migration of legacy Oracle retail transactions ledger onto MongoDB cluster.",
        progress: 68,
        status: "In progress"
      }
    },
    {
      type: "project",
      customId: "PRJ-902",
      data: {
        id: "PRJ-902",
        name: "Stripe Payment Gateway Configurations",
        clientName: "AeroSpace Logistics",
        category: "Fintech Security",
        manager: "Devon Miller",
        teamMembers: ["Karan (Backend)", "Arjun (Frontend UI)"],
        startDate: "2026-07-01",
        expectedCompletionDate: "2026-07-25",
        budget: 12000,
        priority: "Medium",
        description: "Implementation of multi-currency invoice checkout cards for Client cargo billing.",
        progress: 90,
        status: "Testing"
      }
    },
    // Quotations
    {
      type: "quotation",
      customId: "QT-2026-0045",
      data: {
        number: "QT-2026-0045",
        clientName: "Vanguard Retail Inc",
        projectName: "Enterprise Database Migration & Setup",
        title: "Data Migration & Setup Consulting Proposal",
        serviceItems: [
          { service: "Data Sanitization & Extraction pipelines", qty: 1, rate: 1500 },
          { service: "MongoDB Cluster Architecture Config", qty: 1, rate: 2000 },
          { service: "Security Audit & Firewalls setup", qty: 1, rate: 1000 }
        ],
        discount: 5,
        tax: 18,
        validUntil: "2026-08-15",
        terms: "50% advance, 50% upon successful testing signoff.",
        notes: "Includes standard support SLA for first three months.",
        createdBy: "Nisha Rao",
        createdDate: "2026-06-10",
        status: "Approved"
      }
    },
    // Features
    {
      type: "feature",
      customId: "FEAT-101",
      data: {
        id: "FEAT-101",
        projectId: "PRJ-901",
        projectName: "Enterprise Database Migration & Setup",
        title: "Stripe API Webhook Sync",
        moduleName: "Billing Gateways",
        description: "Setup real time alerts on transaction completions.",
        requirementType: "Functional",
        priority: "High",
        assignedDeveloper: "Karan (Developer)",
        startDate: "2026-06-20",
        dueDate: "2026-07-10",
        estimatedHours: 40,
        progress: 100,
        status: "Completed",
        clientApproval: true,
        notes: "Successfully deployed and tested on Sandbox environment."
      }
    },
    {
      type: "feature",
      customId: "FEAT-102",
      data: {
        id: "FEAT-102",
        projectId: "PRJ-901",
        projectName: "Enterprise Database Migration & Setup",
        title: "Logistics Dashboard Frontend Cards",
        moduleName: "User Experience UI",
        description: "Add responsive KPI indicators.",
        requirementType: "UI/UX Enhancements",
        priority: "Medium",
        assignedDeveloper: "Arjun (Frontend Developer)",
        startDate: "2026-07-02",
        dueDate: "2026-07-28",
        estimatedHours: 35,
        progress: 60,
        status: "In development",
        clientApproval: false,
        notes: "Pending final style guides from the UX lead."
      }
    },
    // Innovations
    {
      type: "innovation",
      customId: "INN-001",
      data: {
        id: "INN-001",
        title: "Generative AI Auto-fill for Shipping Logs",
        projectId: "PRJ-901",
        projectName: "Enterprise Database Migration & Setup",
        proposedBy: "Sophia (Testing Specialist)",
        description: "Implement automated data entry using small local LLM configurations.",
        businessBenefit: "Cuts client log entry delays by 85%.",
        technicalBenefit: "Reduces server load during high traffic periods.",
        estimatedCost: 3500,
        estimatedDevTime: "3 weeks",
        priority: "High",
        approvalStatus: "Under review",
        implementationStatus: "Researching",
        clientFeedback: "Extremely interested in exploring operational cost reduction details.",
        adminNotes: "Feasible if run locally. Security constraints need checking."
      }
    },
    // Invoices
    {
      type: "invoice",
      customId: "INV-1024",
      data: { id: "INV-1024", clientName: "Vanguard Retail Inc", value: 4500, status: "Pending", due: "July 30, 2026" }
    },
    {
      type: "invoice",
      customId: "INV-0982",
      data: { id: "INV-0982", clientName: "AeroSpace Logistics", value: 1200, status: "Paid", due: "June 30, 2026" }
    },
    // Payments
    {
      type: "payment",
      customId: "TXN-74029",
      data: { id: "TXN-74029", clientName: "AeroSpace Logistics", amount: 1200, gateway: "Stripe", date: "2026-06-30" }
    },
    // Expenses
    {
      type: "expense",
      customId: "EXP-092",
      data: { id: "EXP-092", title: "AWS Cloud Server Hosting", value: 340, category: "Infrastructure", date: "2026-07-01" }
    },
    // Users
    {
      type: "user",
      customId: "USR-001",
      data: { name: "Admin Operator", email: "admin@crm.com", role: "Super Admin", status: "Active" }
    },
    {
      type: "user",
      customId: "USR-002",
      data: { name: "John Doe", email: "customer@crm.com", role: "Client Access", status: "Active" }
    },
    // Employees
    {
      type: "employee",
      customId: "EMP-01",
      data: { id: "EMP-01", name: "Nisha Rao", role: "Sales Executive Lead", dept: "Corporate CRM", status: "Active" }
    },
    {
      type: "employee",
      customId: "EMP-02",
      data: { id: "EMP-02", name: "Karan Johar", role: "Sr. Backend Engineer", dept: "Engineering", status: "Active" }
    },
    // Teams
    {
      type: "team",
      customId: "TEAM-01",
      data: { name: "Enterprise Delivery Team", members: "Nisha R, Karan J, Sophia W", lead: "Nisha Rao", activeProjects: 2 }
    }
  ];

  await CRMRecord.insertMany(initialRecords);
  console.log("[Database Seeding] Successfully seeded initial CRM records.");
};

// 1. Get all records of a specific type
exports.getRecords = async (req, res, next) => {
  try {
    await seedInitialData(); // Trigger check/seed on first request
    
    const { type } = req.params;
    const records = await CRMRecord.find({ type });
    // Extract internal nested objects and return clean arrays for direct React state set
    const dataList = records.map(r => r.data);
    
    res.status(200).json({
      success: true,
      count: dataList.length,
      data: dataList
    });
  } catch (error) {
    next(error);
  }
};

// 2. Create a new record of a specific type
exports.createRecord = async (req, res, next) => {
  try {
    const { type } = req.params;
    const payload = req.body;
    
    // Determine custom unique business key
    const customId = payload.id || payload.number || payload.name || `REC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = new CRMRecord({
      type,
      customId,
      data: payload
    });

    await newRecord.save();

    res.status(201).json({
      success: true,
      data: newRecord.data
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update an existing record
exports.updateRecord = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const payload = req.body;

    const record = await CRMRecord.findOne({ type, customId: id });
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    record.data = { ...record.data, ...payload };
    // Maintain key reference sync
    record.markModified("data");
    await record.save();

    res.status(200).json({
      success: true,
      data: record.data
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete a record
exports.deleteRecord = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    const result = await CRMRecord.deleteOne({ type, customId: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Record successfully deleted"
    });
  } catch (error) {
    next(error);
  }
};
