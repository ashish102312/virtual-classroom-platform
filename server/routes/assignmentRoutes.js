const express = require("express");
const router = express.Router();
const { createAssignment, getClassAssignments, submitAssignment } = require("../controllers/assignmentController");
const auth = require("../middleware/auth");

router.post("/", auth, createAssignment);
router.get("/class/:classId", auth, getClassAssignments);
router.post("/:id/submit", auth, submitAssignment);

module.exports = router;
