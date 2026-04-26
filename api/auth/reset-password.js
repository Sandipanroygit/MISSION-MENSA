import {
  readJsonBody,
  sendJson,
  sendMethodNotAllowed,
  sendValidationError,
} from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    sendMethodNotAllowed(res);
    return;
  }

  const payload = await readJsonBody(req);
  const token = (payload.token || "").toString().trim();
  const email = (payload.email || "").toString().trim();
  const password = (payload.password || "").toString();
  const passwordConfirmation = (payload.password_confirmation || "").toString();

  const errors = {};
  if (!token) errors.token = ["Reset token is required."];
  if (!email) errors.email = ["Email is required."];
  if (!password) errors.password = ["Password is required."];
  if (!passwordConfirmation) {
    errors.password_confirmation = ["Password confirmation is required."];
  }
  if (password && passwordConfirmation && password !== passwordConfirmation) {
    errors.password_confirmation = ["Password confirmation does not match."];
  }

  if (Object.keys(errors).length > 0) {
    sendValidationError(res, errors);
    return;
  }

  sendJson(res, 200, { message: "Password reset successful." });
}
