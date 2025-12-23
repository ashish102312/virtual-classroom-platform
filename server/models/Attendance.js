const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        records: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                status: {
                    type: String,
                    enum: ["present", "absent", "late"],
                    default: "present",
                },
                joinedAt: Date,
                leftAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
