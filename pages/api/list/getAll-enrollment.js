import { listItem } from "../../../utils/crud";

const handler = async (req, res) => {
  const tableName = "registration"; // Updated from "enrollment" to "registration" as per updated schema
  const method = req.method;

  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default withCors(handler)