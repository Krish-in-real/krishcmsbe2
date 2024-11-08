import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const method = req.method;
  const tableName = "submission";
  if (req.method === "GET") {
    // const { participantToken } = req.headers;
    const participantToken = req.headers.authorization?.split(" ")[1];

    if (!participantToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(participantToken, process.env.JWT_SECRET_KEY);

      const email = decoded.email;
      console.log(decoded)

      const participant = await prisma.participant.findUnique({
        where: {
          email: email,
        }
      });
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      const participantId = participant.participantId;
      console.log(participantId)
      const submission = await prisma.submission.findMany({
        where: {
          participantId: {
            not: participantId
          },
        }
      });

      return res.status(200).json(submission);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid participant token or authentication failed' });
    }
  }
  
  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler);

//peer review fetch all the submission papers except the user paper user will be ftched via token from the frontend
