import { listItem } from "../../../utils/crud";

const handler = async (req, res) => {
  const method = req.method;
  const tableName = "review"; // Updated from "feedback" to "review" to reflect schema change

  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}


export default withCors(handler)