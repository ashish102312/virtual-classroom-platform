const express = require("express");
const router = express.Router();
const { createPoll, votePoll, getClassPolls } = require("../controllers/pollController");
const auth = require("../middleware/auth");

router.post("/", auth, createPoll);
router.get("/class/:classId", auth, getClassPolls);
router.post("/:id/vote", auth, votePoll);

module.exports = router;
