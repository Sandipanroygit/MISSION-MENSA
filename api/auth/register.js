import {
  createAccessToken,
  createUserFromRegisterPayload,
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
  const fullName = (payload.full_name || "").toString().trim();
  const email = (payload.email || "").toString().trim();
  const password = (payload.password || "").toString();
  const passwordConfirmation = (payload.password_confirmation || "").toString();

  const errors = {};
  if (!fullName) errors.full_name = ["Full name is required."];
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

  const user = createUserFromRegisterPayload({ full_name: fullName, email });
  sendJson(res, 201, {
    access_token: createAccessToken(user),
    user,
  });
}
