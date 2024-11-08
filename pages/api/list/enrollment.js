import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const tableName = "enrollment";
  const method = req.method;


  if (method === 'POST') {
    // Extract eventId and participantToken from the request body
    const { eventId} = req.body;
    const participantToken = req.headers.authorization?.split(" ")[1];

    if (!eventId || !participantToken) {
      return res.status(400).json({ error: 'Event ID and Participant Token are required' });
    }

    try {
      const decoded = jwt.verify(participantToken, process.env.JWT_SECRET_KEY);

      
      const email = decoded.email;
      
      
      const participant = await prisma.participant.findUnique({
        where: {
          email: email,
        }
      });
      // console.log(participant)

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      const participantId = participant.participantId;


      const enrollments = await prisma.enrollment.findMany({
        where: {
          participantId: participantId,
        },
      });

      const isAlreadyEnrolled = enrollments.some((enrollment) => enrollment.eventId === eventId);

      if (isAlreadyEnrolled) {
        return res.status(400).json({ error: 'Participant already enrolled in this event' });
      }

      const newEnrollment = await prisma.enrollment.create({
        data: {
          participantId: participantId,
          eventId,
          registrationDate: new Date(),
          ticketType: 'regular', //a default ticket type or pass as needed
        },
      });

      return res.status(201).json({ message: 'Registration successful', enrollment: newEnrollment });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid participant token or authentication failed' });
    }
  }




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

      const enrollments = await prisma.enrollment.findMany({
        where: {
          participantId: participantId,
        }
      });

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid participant token or authentication failed' });
    }
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}
export default withCors(handler);



