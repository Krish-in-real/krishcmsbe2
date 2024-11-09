import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import withCors from "../../../utils/cors"; // Make sure to import your CORS middleware

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, userRole, bio, skills } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      // Check if the email already exists
      const existingUser = await prisma.member.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new member
      const member = await prisma.member.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          userRole,
          bio,
          skills,
        },
      });

      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed", error: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

// Wrap your handler with the CORS middleware
export default withCors(handler);
