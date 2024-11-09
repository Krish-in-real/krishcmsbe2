import { listItem } from "../../../utils/crud";

const handler = async (req, res) => {
  const method = req.method;
  const tableName = "user"; // You can replace "user" with the correct table name if needed

  if (method === "GET") {
    // Calling the listItem function with the table name and the request and response objects
    return listItem(tableName, req, res);
  }

  // Handling unsupported methods
  return res.status(405).end(`Method ${method} Not Allowed`);
}


export default withCors(handler)