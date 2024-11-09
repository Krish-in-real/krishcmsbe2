import {
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../../../utils/crud";
import withCors from "../../../utils/cors";

const handler = async (req, res) => {
  const method = req.method;
  console.log("method");
  console.log(method);


  const tableName = "contribution";
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