// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, role, description, expertise  } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const participant = await prisma.participant.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        description,
        expertise
      },
    });

    res.status(201).json({ message: "Registration Successful" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
