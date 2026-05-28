import { connectDB } from "./config/db.js";
import { User } from "./models/user.model.js";

const users = [
  {
    name: "Aisha Khan",
    email: "employee@royalgroup.local",
    password: "Password123",
    role: "employee",
    department: "Operations",
    designation: "Executive"
  },
  {
    name: "Omar Rahman",
    email: "manager@royalgroup.local",
    password: "Password123",
    role: "manager",
    department: "Operations",
    designation: "Department Manager"
  }
];

await connectDB();
await User.deleteMany({ email: { $in: users.map((user) => user.email) } });
await User.create(users);
console.log("Seed users created");
process.exit(0);
