import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";
async function handler(req, res) {
  const method = req.method;
  const tableName = "schedule";
  if (req.method === "GET") {
    return listItem(tableName, req, res, { event: true });
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}
export default withCors(handler);

