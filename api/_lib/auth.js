import crypto from "node:crypto";

const TOKEN_TTL_SECONDS = Number.parseInt(
  process.env.AUTH_TOKEN_TTL_SECONDS || "604800",
  10,
);
const AUTH_TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET || "mensa-dev-auth-secret";

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  return Buffer.from(base64 + pad, "base64").toString("utf8");
}

function signValue(value) {
  return toBase64Url(
    crypto.createHmac("sha256", AUTH_TOKEN_SECRET).update(value).digest(),
  );
}

function safeEqual(a, b) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function normalizeEmail(email) {
  return (email || "").toString().trim().toLowerCase();
}

function makeNumericId(seed) {
  let hash = 0;
  for (const ch of seed) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return Math.max(1, hash % 1000000000);
}

function nowIso() {
  return new Date().toISOString();
}

function buildUser(email, fullName) {
  const normalizedEmail = normalizeEmail(email);
  const fallbackName = normalizedEmail.split("@")[0] || "Learner";
  const name = (fullName || fallbackName).toString().trim();
  const timestamp = nowIso();
  return {
    id: makeNumericId(normalizedEmail),
    name,
    email: normalizedEmail,
    email_verified_at: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export function buildUserFromTokenPayload(payload) {
  return buildUser(payload?.email || "", payload?.name || "");
}

function buildHouseholdForUser(user) {
  const householdId = `household-${user.id}`;
  return [
    {
      id: householdId,
      name: `${user.name}'s Household`,
      learners: [
        {
          id: `learner-${user.id}`,
          first_name: user.name.split(" ")[0] || "Learner",
          household_id: householdId,
          user_id: user.id,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      ],
    },
  ];
}

function parseSeedUsers() {
  try {
    const raw = process.env.AUTH_USERS_JSON;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        email: normalizeEmail(item?.email),
        password: (item?.password || "").toString(),
        name: (item?.name || "").toString(),
      }))
      .filter((item) => item.email && item.password);
  } catch {
    return [];
  }
}

function getFallbackSeedUser() {
  return {
    email: normalizeEmail(process.env.AUTH_DEFAULT_EMAIL || "admin@mensa.local"),
    password: (process.env.AUTH_DEFAULT_PASSWORD || "admin123").toString(),
    name: (process.env.AUTH_DEFAULT_NAME || "Mensa Admin").toString(),
  };
}

const SEEDED_USERS = [...parseSeedUsers(), getFallbackSeedUser()];

export function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === "string") {
    try {
      return Promise.resolve(JSON.parse(req.body || "{}"));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

export function sendMethodNotAllowed(res) {
  sendJson(res, 405, { message: "Method not allowed." });
}

export function sendValidationError(res, errors) {
  sendJson(res, 422, {
    message: "The given data was invalid.",
    errors,
  });
}

export function createAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + Math.max(60, TOKEN_TTL_SECONDS || 604800),
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function parseAccessToken(token) {
  if (!token || typeof token !== "string") return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = signValue(encodedPayload);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.exp || now > Number(payload.exp)) return null;
    const email = normalizeEmail(payload.email);
    if (!email) return null;
    return {
      sub: Number(payload.sub || 0),
      email,
      name: (payload.name || "").toString(),
    };
  } catch {
    return null;
  }
}

export function getBearerToken(req) {
  const header =
    req.headers.authorization || req.headers.Authorization || "";
  if (!header || typeof header !== "string") return null;
  const [scheme, token] = header.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token;
}

export function authenticate(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const rawPassword = (password || "").toString();

  const allowAny = (process.env.AUTH_ALLOW_ANY_LOGIN || "true")
    .toString()
    .toLowerCase() === "true";

  if (allowAny) {
    if (!normalizedEmail || !rawPassword) return null;
    return buildUser(normalizedEmail);
  }

  const matched = SEEDED_USERS.find(
    (item) => item.email === normalizedEmail && item.password === rawPassword,
  );
  if (!matched) return null;

  return buildUser(matched.email, matched.name);
}

export function createUserFromRegisterPayload(payload) {
  return buildUser(payload.email, payload.full_name);
}

export function buildMeResponse(user) {
  return {
    user,
    roles: [
      {
        role: "PARENT",
        scope_type: "household",
        scope_id: `household-${user.id}`,
      },
    ],
    households: buildHouseholdForUser(user),
  };
}
