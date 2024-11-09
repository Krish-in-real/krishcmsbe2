import Cors from 'cors';

// CORS configuration
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  origin: "*",
  allowedHeaders: ['Authorization', 'Content-Type'], // Allow specific headers like Authorization
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) {
        return reject(err); // Reject the promise if an error occurs
      }
      return resolve(); // Resolve when the middleware is done
    });
  });
}

// Higher-order function to wrap API handlers with CORS middleware
export default function withCors(handler) {
  return async (req, res) => {
    try {
      console.log(req)
      // Handle preflight OPTIONS request
      if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Send 200 OK for OPTIONS preflight request
      }

      // Log origin for debugging
      // console.log('Request Origin:', req.headers.origin || 'No origin header'); // Ensure undefined origins are handled

      // Apply CORS middleware
      await runMiddleware(req, res, cors);

      // Proceed with the original handler
      return handler(req, res);
    } catch (error) {
      console.error('CORS Error:', error);
      return res.status(500)
    }
  };
}