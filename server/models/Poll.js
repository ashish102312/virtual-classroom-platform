const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        options: [
            {
                text: String,
                votes: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        voters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        endTime: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Poll", pollSchema);
