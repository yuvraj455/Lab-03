const express = require("express");
const router = express.Router();
const Skill = require("../models/skills");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /skills
router.get("/", AuthenticationMiddleware, async (req, res, next) => {
  let skills = await Skill.find().sort([["name", "ascending"]]);
  res.render("skills/index", { title: "Skill List", dataset: skills, user: req.user });
});

// GET /skills/add
router.get("/add", AuthenticationMiddleware, (req, res, next) => {
  res.render("skills/add", { title: "Add a new Skill", user: req.user });
});

// POST /skills/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newSkill = new Skill({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
  });
  await newSkill.save();
  res.redirect("/skills");
});

module.exports = router;
