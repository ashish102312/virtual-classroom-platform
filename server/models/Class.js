const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* ================= TIMING ================= */
    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    /* ================= CLASS CODE ================= */
    classCode: {
      type: String,
      unique: true,
      default: () =>
        Math.random().toString(36).substring(2, 8).toUpperCase(),
    },

    /* ================= RELATIONS ================= */
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

module.exports = mongoose.model("Class", classSchema);
