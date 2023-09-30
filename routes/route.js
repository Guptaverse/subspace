const express = require("express");
const router = express.Router();

const { blogStats, blogSearch } = require("../controllers/controller");

router.get("/blog-stats", blogStats);
router.get("/blog-search", blogSearch);

module.exports = router;
