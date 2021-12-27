const express = require("express");
const { list } = require("../controllers/records");
const validate = require("../middlewares/validate");
const schemas = require("../validations/records");
const router = express.Router();

router.route("/").post(validate(schemas.createValidation), list);
module.exports = router;
