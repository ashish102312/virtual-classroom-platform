const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            enum: ["teacher", "student"],
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["text", "system", "announcement"],
            default: "text",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);
