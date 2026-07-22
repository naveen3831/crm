const express = require("express");
const router = express.Router();

// Clear all database records endpoint
router.delete("/clear-database", (req, res, next) => require("./crm.controller").clearDatabase(req, res, next));

// Dynamic CRM collection endpoints mapping with dynamic require wrapper
router.route("/:type")
  .get((req, res, next) => require("./crm.controller").getRecords(req, res, next))
  .post((req, res, next) => require("./crm.controller").createRecord(req, res, next));

router.route("/:type/:id")
  .put((req, res, next) => require("./crm.controller").updateRecord(req, res, next))
  .delete((req, res, next) => require("./crm.controller").deleteRecord(req, res, next));

module.exports = router;
