import withCors from "@/utils/cors";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const tableName = "enrollment";
  const method = req.method;

  if (method === 'POST') {
    // Extract eventId and memberToken from the request body
    const { eventId } = req.body;
    const memberToken = req.headers.authorization?.split(" ")[1];

    if (!eventId || !memberToken) {
      return res.status(400).json({ error: 'Event ID and Member Token are required' });
    }

    try {
      const decoded = jwt.verify(memberToken, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      // Fetch the member by email
      const member = await prisma.member.findUnique({
        where: {
          email: email,
        }
      });

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      const memberId = member.memberId;

      // Check if the member is already enrolled in the event
      const enrollments = await prisma.enrollment.findMany({
        where: {
          memberId: memberId,
        },
      });

      const isAlreadyEnrolled = enrollments.some((enrollment) => enrollment.eventId === eventId);

      if (isAlreadyEnrolled) {
        return res.status(400).json({ error: 'Member already enrolled in this event' });
      }

      // Create a new enrollment
      const newEnrollment = await prisma.enrollment.create({
        data: {
          memberId: memberId,
          eventId,
          registrationDate: new Date(),
          ticketType: 'regular', // Use a default ticket type or pass as needed
        },
      });

      return res.status(201).json({ message: 'Registration successful', enrollment: newEnrollment });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid member token or authentication failed' });
    }
  }

  if (req.method === "GET") {
    const memberToken = req.headers.authorization?.split(" ")[1];

    if (!memberToken) {
      return res.status(400).json({ error: 'Member token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(memberToken, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      // Fetch the member by email
      const member = await prisma.member.findUnique({
        where: {
          email: email,
        }
      });

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      const memberId = member.memberId;

      // Fetch the member's enrollments
      const enrollments = await prisma.enrollment.findMany({
        where: {
          memberId: memberId,
        }
      });

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid member token or authentication failed' });
    }
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler);
