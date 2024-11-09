import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  const method = req.method;
  const tableName = "Agenda"; // Assuming "schedule" table is correctly named

  if (req.method === "GET") {
    return listItem(tableName, req, res, { event: true }); // Assuming you want to include event-related data
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler);
