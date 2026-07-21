const express = require("express");
const router = express.Router();
const crmController = require("./crm.controller");

// Dynamic CRM collection endpoints mapping
router.route("/:type")
  .get(crmController.getRecords)
  .post(crmController.createRecord);

router.route("/:type/:id")
  .put(crmController.updateRecord)
  .delete(crmController.deleteRecord);

module.exports = router;
