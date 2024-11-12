const mongoose = require("mongoose");
const schemaObj = {
    name: { type: String, required: true },  // Name of the skill, e.g., "Cooking"
  category: { type: String, enum: ["Arts", "Languages", "Fitness", "Coding", "Custom"], required: true },  // Category of skill
  description: { type: String },  // Brief description about the skill
};
const mongooseSchema = mongoose.Schema(schemaObj);
module.exports = mongoose.model("Skills", mongooseSchema);