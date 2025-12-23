const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        sessionDate: {
            type: Date,
            default: Date.now,
        },
        canvasData: {
            type: String, // JSON stringified canvas state
            default: "[]",
        },
        savedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Whiteboard", whiteboardSchema);
