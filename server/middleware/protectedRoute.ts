import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwtDecode, { InvalidTokenError } from "jwt-decode";

const prisma = new PrismaClient();

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded instanceof InvalidTokenError) {
        return res.status(400).send({ message: "Invalid token" });
      }
      prisma.user
        .findUnique({
          where: {
            id: decoded.userId,
          },
        })
        .then((user) => {
          next();
        })
        .catch((err) => {
          return res
            .status(400)
            .send({ message: "User does not exist", error: err });
        });
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        return res.status(400).send({ message: "Invalid token" });
      }
      return res.status(400).send({ error: err });
    }
  } else {
    res.status(402).send({ message: "Unauthorized" });
  }
};

export default protectedRoute;
