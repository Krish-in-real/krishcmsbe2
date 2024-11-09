import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/services/auth";
import withCors from "@/utils/cors";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Hashing password for storage if needed in future processes (not used here)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Find the user by email
      const member = await prisma.member.findUnique({
        where: { email },
      });

      if (!member) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      // Compare provided password with the stored hashed password
      const passwordMatches = await bcrypt.compare(password, member.hashedPassword);

      if (passwordMatches) {
        const token = generateToken(email);
        return res.status(200).json({
          status: "Success",
          message: "Login successful",
          role: member.userRole,
          memberId: member.memberId,
          token: token,
        });
      } else {
        return res.status(404).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withCors(handler);
