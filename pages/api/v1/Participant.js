import {
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../../../utils/crud";

const handler = async (req, res) => {
  const method = req.method;
  const tableName = "member";
  switch (method) {
    case "POST":
      return createItem(tableName, req, res);
    case "GET":
      return getItem(tableName, req, res);
    case "PUT":
      return updateItem(tableName, req, res);
    case "DELETE":
      return deleteItem(tableName, req, res);
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}


export default withCors(handler)