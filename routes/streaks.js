const express = require("express");
const router = express.Router();
const Streak = require("../models/streak");
const Skill = require("../models/skills");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /streaks
router.get("/", async (req, res, next) => {
  let streaks = await Streak.find().sort([["date", "descending"]]);
  res.render("streaks/index", {
    title: "Streak Tracker",
    dataset: streaks,
    user: req.user,
  });
});

// GET /streaks/add
router.get("/add", AuthenticationMiddleware, async (req, res, next) => {
  let skillList = await Skill.find().sort([["name", "ascending"]]);
  res.render("streaks/add", {
    title: "Add a New Streak",
    skills: skillList,
    user: req.user,
  });
});

// POST /streaks/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newStreak = new Streak({
    date: req.body.date,
    note: req.body.note,
    goalStreakDays: req.body.goalStreakDays,
    progress: req.body.progress,
    skill: req.body.skill,
    skillId: req.body.skillId,
    userId: req.user._id, 
  });
  await newStreak.save();
  res.redirect("/streaks");
});

// GET /streaks/delete/:_id
router.get("/delete/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let streakId = req.params._id;
  await Streak.findByIdAndRemove({ _id: streakId });
  res.redirect("/streaks");
});

// GET /streaks/edit/:_id
router.get("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let streakId = req.params._id;
  let streakData = await Streak.findById(streakId);
  let skillList = await Skill.find().sort([["name", "ascending"]]);
  res.render("streaks/edit", {
    title: "Edit Streak Info",
    streak: streakData,
    skills: skillList,
    user: req.user,
  });
});

// POST /streaks/edit/:_id
router.post("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let streakId = req.params._id;
  await Streak.findByIdAndUpdate(
    { _id: streakId },
    {
      date: req.body.date,
      note: req.body.note,
      goalStreakDays: req.body.goalStreakDays,
      progress: req.body.progress,
      skill: req.body.skill,
      skillId: req.body.skillId, 
    }
  );
  res.redirect("/streaks");
});

module.exports = router;
