import jwt from "jsonwebtoken";

export default async function useAuth(event) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "JWT_SECRET non configurato"
    });
  }

  const authHeader = event.node.req.headers["authorization"];
  if (!authHeader) {
    return { ok: false };
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return { ok: false };
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    event.context.authPayload = payload;
    return { ok: true, payload };
  } catch (err) {
    return { ok: false };
  }
}