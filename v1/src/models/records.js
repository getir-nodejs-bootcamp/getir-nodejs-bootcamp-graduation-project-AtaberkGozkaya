const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const recordSchema = mongoose.Schema(
  {
    key: { type: String },
    createdAt: { type: Date },
    counts: { type: Array },
    value: { type: String },
  },
  { collection: "records" }
);

//recordSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Records", recordSchema);
