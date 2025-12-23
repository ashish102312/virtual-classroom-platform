const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MySQL Connected (just kidding, it's MongoDB!)");

        // Clear existing data (Optional: comment out if you want to keep data)
        console.log("🧹 Clearing existing data...");
        await User.deleteMany({});
        await Class.deleteMany({});
        await Assignment.deleteMany({});

        // Create Admin/Teacher
        console.log("👩‍🏫 Creating Teacher...");
        const teacherHash = await bcrypt.hash("password123", 10);
        const teacher = await User.create({
            name: "Professor Dumbledore",
            email: "teacher@example.com",
            password: teacherHash,
            role: "teacher",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        });

        // Create Student
        console.log("🎓 Creating Student...");
        const studentHash = await bcrypt.hash("password123", 10);
        const student = await User.create({
            name: "Harry Potter",
            email: "student@example.com",
            password: studentHash,
            role: "student",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harry",
        });

        // Create Class
        console.log("🏫 Creating Class...");
        const potionsClass = await Class.create({
            name: "Defense Against the Dark Arts",
            subject: "Magic",
            teacher: teacher._id,
            description: "Learn how to defend yourself properly.",
            startTime: "10:00",
            endTime: "11:30",
        });

        // Enroll Student
        potionsClass.students.push(student._id);
        await potionsClass.save();

        // Create Assignment
        console.log("📝 Creating Assignment...");
        await Assignment.create({
            title: "Patronus Charm Essay",
            description: "Write 500 words on your happiest memory.",
            class: potionsClass._id,
            teacher: teacher._id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        });

        console.log(`
🎉 Database Seeded Successfully!
---------------------------------------
Login Credentials:
Teacher: teacher@example.com / password123
Student: student@example.com / password123
---------------------------------------
`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDatabase();
