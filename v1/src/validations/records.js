const Joi = require("joi");

const createValidation = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  minCount: Joi.number().positive().required(),
  maxCount: Joi.number().positive().required(),
});

module.exports = {
  createValidation,
};
