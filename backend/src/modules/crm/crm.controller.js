const mongoose = require("mongoose");
const User = require("../auth/user.model");
const { getModel, collectionNames } = require("./models");
const Quotation = require("./models/quotation.model");
const OurProject = require("./models/ourproject.model");

const seedBuildYourThoughtsRecords = async () => {
  try {
    const OurProjectModel = getModel("our-projects");
    const QuotationModel = getModel("quotation");

    await OurProjectModel.updateOne(
      { id: "OPRJ-7001" },
      {
        $set: {
          id: "OPRJ-7001",
          name: "Build Your Thoughts",
          title: "Build Your Thoughts",
          category: "AI Web Application",
          clientName: "Build Your Thoughts / Speshway",
          budget: 45000,
          status: "Live Production",
          liveUrl: "https://buildyourthoughts.com",
          description: "Full-stack AI thought workspace & content generation engine built with Vite, React, Node.js, and TailwindCSS."
        }
      },
      { upsert: true }
    );

    await QuotationModel.updateOne(
      { id: "QT-7001" },
      {
        $set: {
          id: "QT-7001",
          number: "QT-7001",
          title: "Build Your Thoughts Quotation",
          clientName: "Build Your Thoughts / Speshway",
          date: "2026-07-22",
          validUntil: "2026-08-22",
          status: "Approved",
          tax: 18,
          discount: 10,
          serviceItems: [
            { description: "Vite React Animated UI & Shadcn Component Suite", qty: 1, rate: 20000 },
            { description: "Node.js Backend & Content API Server Integration", qty: 1, rate: 18000 },
            { description: "Production Deployment & Domain Binding", qty: 1, rate: 7000 }
          ]
        }
      },
      { upsert: true }
    );

    console.log("[Seed] 'Build Your Thoughts' records successfully synced in MongoDB Atlas.");
  } catch (err) {
    console.error("[Seed BuildYourThoughts Error]", err);
  }
};

const seedHMSRecords = async () => {
  try {
    const OurProjectModel = getModel("our-projects");
    const QuotationModel = getModel("quotation");
    const InvoiceModel = getModel("invoice");

    await OurProjectModel.updateOne(
      { id: "OPRJ-6561" },
      {
        $set: {
          id: "OPRJ-6561",
          name: "hms",
          title: "Hospital Management System (HMS)",
          category: "Web & Mobile Ecosystem",
          clientName: "Internal / Showcase",
          budget: 185000,
          status: "APPROVED",
          description: "Comprehensive Hospital Management System (HMS) with Patient Portal, EMR, Doctor Workstation, Laboratory Diagnostics, Pharmacy Inventory, and iOS/Android Mobile Apps."
        }
      },
      { upsert: true }
    );

    await QuotationModel.updateOne(
      { id: "QT-OPRJ-6561" },
      {
        $set: {
          id: "QT-OPRJ-6561",
          number: "QT-OPRJ-1950",
          projectId: "OPRJ-6561",
          projectName: "hms",
          title: "hms Web Portal + iOS & Android Mobile Apps Ecosystem",
          clientName: "Internal / Showcase",
          projectType: "Web & Mobile Ecosystem",
          projectTypes: ["Web Application", "Mobile Application (iOS & Android)"],
          planAPrice: 135000,
          planBPrice: 195000,
          planCPrice: 320000,
          currency: "Indian Rupees (INR)",
          overviewNarrative: "This proposal covers the complete omni-channel HMS Ecosystem comprising a high-performance Web Management Portal alongside cross-platform Mobile Applications for both iOS and Android.",
          paymentTerms: "30% Advance on project kickoff\n30% on completion of Web EMR & OPD Billing\n30% on Mobile Apps delivery\n10% on Go-Live UAT & Store Publishing",
          termsAndConditions: "Estimation valid for 30 days. Includes 120 days complimentary bug-fix & cloud SLA support.",
          status: "Approved",
          serviceItems: [
            { description: "HMS Core Web Portal & Admin Control Workstation", qty: 1, rate: 55000 },
            { description: "Patient iOS & Android Cross-Platform Mobile Application", qty: 1, rate: 45000 },
            { description: "Doctor Ward Rounds Mobile Workstation & EMR Module", qty: 1, rate: 35000 },
            { description: "AWS High-Availability Cloud Server & SSL Setup", qty: 1, rate: 15000 }
          ]
        }
      },
      { upsert: true }
    );

    await InvoiceModel.updateOne(
      { id: "INV-HMS-6561" },
      {
        $set: {
          id: "INV-HMS-6561",
          number: "INV-HMS-6561",
          title: "hms Official Tax Invoice",
          projectId: "OPRJ-6561",
          projectName: "hms",
          clientName: "Internal / Showcase",
          issueDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Sent",
          currency: "INR",
          subtotal: 150000,
          taxRate: 18,
          taxAmount: 26100,
          discount: 5000,
          totalAmount: 171100,
          lineItems: [
            { description: "HMS Web Portal & Admin Workstation", qty: 1, rate: 55000 },
            { description: "Patient iOS & Android Mobile Apps", qty: 1, rate: 45000 },
            { description: "Doctor Mobile Workstation & EMR Module", qty: 1, rate: 35000 },
            { description: "AWS Cloud Server & SSL Encryption Setup", qty: 1, rate: 15000 }
          ],
          notes: "Thank you for choosing Speshway Solutions for your HMS digital healthcare platform.",
          paymentTerms: "Net 15 Days"
        }
      },
      { upsert: true }
    );

    console.log("[Seed] 'HMS' project, 3-tier proposal quotations & global invoice successfully synced in MongoDB Atlas.");
  } catch (err) {
    console.error("[Seed HMS Error]", err);
  }
};

const seedHRMSRecords = async () => {
  try {
    const OurProjectModel = getModel("our-projects");
    const QuotationModel = getModel("quotation");

    await OurProjectModel.updateOne(
      { id: "OPRJ-4838" },
      {
        $set: {
          id: "OPRJ-4838",
          name: "hrms",
          title: "Human Resource Management System (HRMS)",
          category: "Web & Mobile Ecosystem",
          clientName: "Internal / Showcase",
          budget: 140000,
          status: "APPROVED",
          description: "Human Resource Management System (HRMS) with Employee Self-Service, Attendance, Biometric Sync, Automated Payroll, Indian Tax Slabs (PF/ESI/TDS), and iOS/Android Apps."
        }
      },
      { upsert: true }
    );

    await QuotationModel.updateOne(
      { id: "QT-OPRJ-4838" },
      {
        $set: {
          id: "QT-OPRJ-4838",
          number: "QT-OPRJ-4838",
          projectId: "OPRJ-4838",
          projectName: "hrms",
          title: "hrms Web Portal + iOS & Android Mobile Apps Ecosystem",
          clientName: "Internal / Showcase",
          projectType: "Web & Mobile Ecosystem",
          projectTypes: ["Web Application", "Mobile Application (iOS & Android)"],
          planAPrice: 110000,
          planBPrice: 160000,
          planCPrice: 280000,
          currency: "Indian Rupees (INR)",
          overviewNarrative: "This proposal covers the complete omni-channel HRMS Ecosystem comprising a high-performance Web Management Portal alongside cross-platform Mobile Applications for both iOS and Android.",
          paymentTerms: "25% Advance on project kickoff\n25% on completion of HR Web Portal\n25% on Mobile Apps delivery\n15% on App Store Publishing\n10% on Go-Live UAT",
          termsAndConditions: "Estimation valid for 30 days. Includes 120 days complimentary bug-fix & cloud SLA support.",
          status: "Approved",
          serviceItems: [
            { description: "HRMS Web Portal & Admin Control Workstation", qty: 1, rate: 55000 },
            { description: "Employee iOS & Android Cross-Platform Mobile Application", qty: 1, rate: 45000 },
            { description: "Biometric Attendance Hardware Sync & GPS Clock-In Engine", qty: 1, rate: 25000 },
            { description: "Automated Monthly Payroll & Statutory Tax Exporter", qty: 1, rate: 15000 }
          ]
        }
      },
      { upsert: true }
    );

    console.log("[Seed] 'HRMS' project & quotation proposal successfully synced in MongoDB Atlas.");
  } catch (err) {
    console.error("[Seed HRMS Error]", err);
  }
};

exports.seedBuildYourThoughtsRecords = seedBuildYourThoughtsRecords;
exports.seedHMSRecords = seedHMSRecords;

// 1. Get all records from dedicated collection
exports.getRecords = async (req, res, next) => {
  try {
    const { type } = req.params;
    await seedBuildYourThoughtsRecords();
    await seedHMSRecords();
    await seedHRMSRecords();

    // Special handler for "user" type -> Query users collection
    if (type === "user") {
      const dbUsers = await User.find({}).select("-password").lean();
      const userList = dbUsers.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        company: u.company,
        role: u.role === "admin" ? "Super Admin" : "Client Access",
        status: u.status || "Active",
      }));

      return res.status(200).json({
        success: true,
        count: userList.length,
        data: userList,
      });
    }

    const Model = getModel(type);
    let docs = await Model.find({}).lean();

    if (mongoose.connection && mongoose.connection.db) {
      const colName = collectionNames[(type || "").toLowerCase().trim()] || (type.endsWith("s") ? type : `${type}s`);
      const nativeDocs = await mongoose.connection.db.collection(colName).find({}).toArray();
      if (nativeDocs.length > docs.length) {
        docs = nativeDocs;
      }
    }

    const formattedDocs = docs.map(doc => {
      const { _id, __v, ...rest } = doc;
      const docId = doc.id || doc.number || doc.customId || (_id ? _id.toString() : String(Math.random()));
      return { id: docId, ...rest };
    });

    const normType = (type || "").toLowerCase().trim();
    if ((normType === "our-projects" || normType === "ourproject" || normType === "ourprojects") && !formattedDocs.some(d => d.id === "OPRJ-7001" || d.name === "Build Your Thoughts")) {
      formattedDocs.unshift({
        id: "OPRJ-7001",
        name: "Build Your Thoughts",
        title: "Build Your Thoughts",
        category: "AI Web Application",
        clientName: "Build Your Thoughts / Speshway",
        budget: 45000,
        status: "Live Production",
        liveUrl: "https://buildyourthoughts.com",
        description: "Full-stack AI thought workspace & content generation engine built with Vite, React, Node.js, and TailwindCSS."
      });
    }

    res.status(200).json({
      success: true,
      count: formattedDocs.length,
      data: formattedDocs,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Create a new record in dedicated collection
exports.createRecord = async (req, res, next) => {
  try {
    const { type } = req.params;
    const payload = req.body;

    const uniqueSuffix = `${Date.now()}-${Math.floor(100 + Math.random() * 899)}`;
    const customId = payload.id || payload.number || payload.customId || `${type.toUpperCase()}-${uniqueSuffix}`;
    const recordData = { ...payload, id: customId };

    const Model = getModel(type);
    const newDoc = new Model(recordData);
    await newDoc.save();

    const result = newDoc.toObject();
    delete result.__v;

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update an existing record in dedicated collection
exports.updateRecord = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const payload = req.body;

    if (type === "user") {
      const updatedUser = await User.findOneAndUpdate(
        { $or: [{ email: id }, { _id: id }] },
        { $set: payload },
        { new: true }
      ).select("-password").lean();

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role === "admin" ? "Super Admin" : "Client Access",
          status: updatedUser.status || "Active",
        },
      });
    }

    const Model = getModel(type);
    const cleanId = (id || "").trim();
    const isHex = typeof cleanId === "string" && /^[0-9a-fA-F]{24}$/.test(cleanId);

    const queryConditions = [
      { id: cleanId },
      { number: cleanId },
      { customId: cleanId }
    ];
    if (isHex) {
      queryConditions.push({ _id: cleanId });
    }

    const docIdToSave = payload.id || cleanId;
    const docNumberToSave = payload.number || payload.id || cleanId;

    const updatedDoc = await Model.findOneAndUpdate(
      { $or: queryConditions },
      { $set: { ...payload, id: docIdToSave, number: docNumberToSave } },
      { new: true, upsert: true }
    ).lean();

    if (updatedDoc.__v !== undefined) {
      delete updatedDoc.__v;
    }

    res.status(200).json({
      success: true,
      data: updatedDoc,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete a record from dedicated collection
exports.deleteRecord = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    if (type === "user") {
      const normalizedId = id.toLowerCase().trim();
      if (normalizedId === "admin@crm.com") {
        return res.status(400).json({
          success: false,
          message: "Primary Seeded Admin account cannot be deleted.",
        });
      }

      const isHexObjectId = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
      const userQuery = isHexObjectId
        ? { $or: [{ _id: id }, { email: normalizedId }] }
        : { email: normalizedId };

      const deleteResult = await User.deleteOne(userQuery);

      return res.status(200).json({
        success: true,
        message: "User successfully deleted from database.",
        deletedCount: deleteResult.deletedCount
      });
    }

    const Model = getModel(type);
    const cleanId = (id || "").trim();
    const isHex = typeof cleanId === "string" && /^[0-9a-fA-F]{24}$/.test(cleanId);
    
    const deleteConditions = [
      { id: cleanId },
      { id: new RegExp(`^${cleanId}$`, "i") },
      { number: cleanId },
      { customId: cleanId }
    ];

    if (isHex) {
      deleteConditions.push({ _id: cleanId });
    }

    const result = await Model.deleteOne({ $or: deleteConditions });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Record successfully deleted from database.",
    });
  } catch (error) {
    next(error);
  }
};

// 5. Clear all database records across dedicated collections
exports.clearDatabase = async (req, res, next) => {
  try {
    for (const key of Object.keys(collectionNames)) {
      const Model = getModel(key);
      await Model.deleteMany({});
    }

    // Also drop legacy collection if present
    await mongoose.connection.collection("crmrecords").drop().catch(() => {});

    res.status(200).json({
      success: true,
      message: "All CRM database collections cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
};
