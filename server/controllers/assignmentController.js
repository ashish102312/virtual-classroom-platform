const Assignment = require("../models/Assignment");
const Class = require("../models/Class");

/* ================= CREATE ASSIGNMENT ================= */
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, classId, dueDate, maxPoints, attachments } = req.body;

        // Check if class exists and user is owner
        const classExists = await Class.findOne({ _id: classId, teacher: req.user.id });
        if (!classExists) {
            return res.status(403).json({ message: "Not authorized to add assignments to this class" });
        }

        const assignment = await Assignment.create({
            title,
            description,
            class: classId,
            teacher: req.user.id,
            dueDate,
            maxPoints,
            attachments,
        });

        // Notify via Socket.IO
        const io = req.app.get("io");
        if (io) {
            io.to(classId).emit("newAssignment", assignment);
        }

        res.status(201).json(assignment);
    } catch (err) {
        console.error("CREATE ASSIGNMENT ERROR:", err);
        res.status(500).json({ message: "Failed to create assignment" });
    }
};

/* ================= GET ASSIGNMENTS FOR CLASS ================= */
exports.getClassAssignments = async (req, res) => {
    try {
        const { classId } = req.params;

        // Verify membership (teacher or student)
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Check if user is teacher or student in the class
        const isTeacher = classData.teacher.toString() === req.user.id;
        const isStudent = classData.students.includes(req.user.id);

        if (!isTeacher && !isStudent) {
            return res.status(403).json({ message: "Not a member of this class" });
        }

        const assignments = await Assignment.find({ class: classId })
            .sort({ createdAt: -1 })
            .populate("submissions.student", "name email");

        res.status(200).json(assignments);
    } catch (err) {
        console.error("GET ASSIGNMENTS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch assignments" });
    }
};

/* ================= SUBMIT ASSIGNMENT ================= */
exports.submitAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, attachments } = req.body;

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if user is allowed to submit (student only)
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can submit assignments" });
        }

        // Check if already submitted
        const existingSubmissionIndex = assignment.submissions.findIndex(
            (sub) => sub.student.toString() === req.user.id
        );

        if (existingSubmissionIndex > -1) {
            // Update existing submission
            assignment.submissions[existingSubmissionIndex].content = content;
            assignment.submissions[existingSubmissionIndex].attachments = attachments;
            assignment.submissions[existingSubmissionIndex].submittedAt = Date.now();
        } else {
            // Add new submission
            assignment.submissions.push({
                student: req.user.id,
                content,
                attachments,
            });
        }

        await assignment.save();

        const io = req.app.get("io");
        if (io) {
            io.to(assignment.class.toString()).emit("assignmentUpdated", { _id: assignment._id });
        }

        res.status(200).json({ message: "Assignment submitted successfully" });
    } catch (err) {
        console.error("SUBMIT ASSIGNMENT ERROR:", err);
        res.status(500).json({ message: "Failed to submit assignment" });
    }
};
