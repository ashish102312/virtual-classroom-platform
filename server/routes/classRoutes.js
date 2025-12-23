const express = require("express");
const router = express.Router();

const Class = require("../models/Class");
const auth = require("../middleware/auth");

/*
|--------------------------------------------------------------------------
| CREATE CLASS (Teacher only)
|--------------------------------------------------------------------------
| POST /api/classes
*/
router.post("/", auth, async (req, res) => {
  try {
    console.log("=== CREATE CLASS REQUEST ===");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("HEADERS:", req.headers.authorization);

    if (req.user.role !== "teacher") {
      console.log("❌ Access denied - not a teacher");
      return res.status(403).json({ message: "Only teachers can create classes" });
    }

    const { name, subject, startTime, endTime } = req.body;

    if (!name || !subject || !startTime || !endTime) {
      console.log("❌ Missing fields:", { name, subject, startTime, endTime });
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("✅ Creating class with data:", {
      name,
      subject,
      startTime,
      endTime,
      teacher: req.user.id,
    });

    const newClass = await Class.create({
      name,
      subject,
      startTime,
      endTime,
      teacher: req.user.id,
      students: [],
    });

    console.log("✅ Class created successfully:", newClass._id);
    res.status(201).json(newClass);
  } catch (err) {
    console.error("❌ CREATE CLASS ERROR:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      message: "Failed to create class",
      error: err.message 
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET CLASSES
|--------------------------------------------------------------------------
| GET /api/classes
| Teacher → own classes
| Student → all classes
*/
router.get("/", auth, async (req, res) => {
  try {
    let classes;

    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user.id })
        .populate("teacher", "name email")
        .populate("students", "name email");
    } else {
      classes = await Class.find()
        .populate("teacher", "name email")
        .populate("students", "name email");
    }

    res.json(classes);
  } catch (err) {
    console.error("GET CLASSES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

/*
|--------------------------------------------------------------------------
| JOIN CLASS (Student only)
|--------------------------------------------------------------------------
| POST /api/classes/join
*/
router.post("/join", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can join classes" });
    }

    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "Class ID required" });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (cls.students.includes(req.user.id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    cls.students.push(req.user.id);
    await cls.save();

    res.json({ message: "Joined class successfully" });
  } catch (err) {
    console.error("JOIN CLASS ERROR:", err);
    res.status(500).json({ message: "Join failed" });
  }
});

module.exports = router;
