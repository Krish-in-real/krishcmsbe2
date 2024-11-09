import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  const method = req.method;
  const tableName = "member"; // Assuming "participant" is now "member" based on your schema changes

  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler);
