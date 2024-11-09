import withCors from "@/utils/cors";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const method = req.method;
  const tableName = "contribution";
  console.log(method);

  if (req.method === "GET") {
    // Get the participant's token from the authorization header
    const participantToken = req.headers.authorization?.split(" ")[1];

    if (!participantToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      // Decode the JWT token to retrieve the participant's email
      const decoded = jwt.verify(participantToken, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      // Find the participant by email in the database
      const participant = await prisma.member.findUnique({
        where: { email },
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      // Get the participantId from the found participant
      const memberId = participant.memberId;

      // Fetch all submission papers except the user's own paper
      const submissions = await prisma.contribution.findMany({
        where: {
          memberId: {
            not: memberId,  // Exclude the participant's own submission
          },
        },
      });

      return res.status(200).json(submissions);

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid participant token or authentication failed' });
    }
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler);
