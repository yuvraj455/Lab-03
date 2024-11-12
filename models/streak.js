// Naming convention for models: use singular form of the represented entity
// Import mongoose
const mongoose = require("mongoose");

// Define data schema (JSON)
const dataSchemaObj = {
    date: { type: Date, default: Date.now },  // Date when streak activity is logged
    note: { type: String },  // Optional note for the day's activity
    goalStreakDays: { type: Number, default: 7 },  // Goal for streak in days
    skill: { type: String },  // Skill associated with the streak
    progress: { type: Number, default: 0, min: 0, max: 100 }  // Completion percentage for the activity
};

// Create mongoose schema
const streakSchema = mongoose.Schema(dataSchemaObj);

// Create and export mongoose model
module.exports = mongoose.model("Streak", streakSchema);
