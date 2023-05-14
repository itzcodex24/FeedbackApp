import express from "express";
import { JwtPayload } from "jsonwebtoken";
import jwtDecode from "jwt-decode";

const rateLimit = 60 * 1000; // 1 minute
const userRequests = new Map<
  string,
  { requests: number; lastRequest: number }
>();

const rateLimiter = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const decodedToken = jwtDecode<JwtPayload>(req.cookies.token);
  if (!userRequests.has(decodedToken.id)) {
    userRequests.set(decodedToken.id, {
      requests: 1,
      lastRequest: Date.now(),
    });
  } else {
    const user: any = userRequests.get(decodedToken.id);
    const { requests, lastRequest } = user;
    const elapsedTime = Date.now() - lastRequest;

    if (elapsedTime < rateLimit) {
      if (requests >= 3) {
        return res.status(429).json({
          message: "Too many requests, please try again later.",
        });
      }
      user.requests++;
    } else {
      user.requests = 1;
      user.lastRequest = Date.now();
    }
  }
  next();
};

export default rateLimiter;
