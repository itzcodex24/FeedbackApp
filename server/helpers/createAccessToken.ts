import jwt from "jsonwebtoken";

export default function createAccessToken(userId: any, maxAge: number) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: maxAge,
  });
}
