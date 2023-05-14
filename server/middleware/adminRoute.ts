import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: any, decodedToken: any) => {
        if (err) {
          res.status(403).send({ message: "Forbidden" });
        } else {
          prisma.user
            .findUnique({
              where: {
                id: decodedToken.id,
              },
            })
            .then((user) => {
              if (user?.role === "ADMIN") {
                next();
              }
            })
            .catch((err) => {
              return res
                .status(400)
                .send({ message: "User does not exist", error: err });
            });
        }
      }
    );
  } else {
    res.status(402).send({ message: "Unauthorized" });
  }
};

export default protectedRoute;
