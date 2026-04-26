import { sendJson, sendMethodNotAllowed } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    sendMethodNotAllowed(res);
    return;
  }

  sendJson(res, 200, { message: "Logged out." });
}
