const Poll = require("../models/Poll");
const Class = require("../models/Class");

/* ================= CREATE POLL ================= */
exports.createPoll = async (req, res) => {
    try {
        const { classId, question, options } = req.body;

        const classExists = await Class.findOne({ _id: classId, teacher: req.user.id });
        if (!classExists) {
            return res.status(403).json({ message: "Not authorized to create polls for this class" });
        }

        const poll = await Poll.create({
            class: classId,
            teacher: req.user.id,
            question,
            options: options.map((opt) => ({ text: opt, votes: 0 })),
        });

        // Notify via Socket.IO if available
        const io = req.app.get("io");
        if (io) {
            io.to(classId).emit("newPoll", poll);
        }

        res.status(201).json(poll);
    } catch (err) {
        console.error("CREATE POLL ERROR:", err);
        res.status(500).json({ message: "Failed to create poll" });
    }
};

/* ================= VOTE POLL ================= */
exports.votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { optionIndex } = req.body;

        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (!poll.isActive) {
            return res.status(400).json({ message: "Poll is closed" });
        }

        // Check if already voted
        if (poll.voters.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already voted" });
        }

        // Register vote
        poll.options[optionIndex].votes += 1;
        poll.voters.push(req.user.id);
        await poll.save();

        // Notify via Socket.IO
        const io = req.app.get("io");
        if (io) {
            io.to(poll.class.toString()).emit("pollUpdated", poll);
        }

        res.status(200).json(poll);
    } catch (err) {
        console.error("VOTE POLL ERROR:", err);
        res.status(500).json({ message: "Failed to vote" });
    }
};

/* ================= GET POLLS ================= */
exports.getClassPolls = async (req, res) => {
    try {
        const { classId } = req.params;

        const polls = await Poll.find({ class: classId }).sort({ createdAt: -1 });
        res.status(200).json(polls);
    } catch (err) {
        console.error("GET POLLS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch polls" });
    }
};
