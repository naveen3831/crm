const mongoose = require("mongoose");

const Client = require("./client.model");
const Lead = require("./lead.model");
const Project = require("./project.model");
const OurProject = require("./ourproject.model");
const Quotation = require("./quotation.model");
const Invoice = require("./invoice.model");

const modelRegistry = {
  client: Client,
  clients: Client,
  lead: Lead,
  leads: Lead,
  project: Project,
  projects: Project,
  ourproject: OurProject,
  ourprojects: OurProject,
  "our-project": OurProject,
  "our-projects": OurProject,
  quotation: Quotation,
  quotations: Quotation,
  invoice: Invoice,
  invoices: Invoice,
};

const collectionNames = {
  client: "clients",
  lead: "leads",
  project: "projects",
  ourproject: "ourprojects",
  "our-project": "ourprojects",
  "our-projects": "ourprojects",
  call: "calls",
  quotation: "quotations",
  quotations: "quotations",
  feature: "features",
  innovation: "innovations",
  invoice: "invoices",
  payment: "payments",
  expense: "expenses",
  employee: "employees",
  team: "teams"
};

const getModel = (type) => {
  const normType = (type || "").toLowerCase().trim();
  if (modelRegistry[normType]) {
    return modelRegistry[normType];
  }

  const collectionName = collectionNames[normType] || (normType.endsWith("s") ? normType : `${normType}s`);
  const modelName = normType.charAt(0).toUpperCase() + normType.slice(1);

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const schema = new mongoose.Schema({ id: { type: String } }, { strict: false, timestamps: true, collection: collectionName });
  return mongoose.model(modelName, schema);
};

module.exports = {
  getModel,
  Client,
  Lead,
  Project,
  OurProject,
  Quotation,
  collectionNames
};
