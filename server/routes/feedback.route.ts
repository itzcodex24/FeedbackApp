import express from "express";
import { PrismaClient } from "@prisma/client";
import protectedRoute from "../middleware/protectedRoute";
import jwtDecode from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import rateLimiter from "../middleware/rateLimiter";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", protectedRoute, async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({});
    res.send({ feedbacks });
  } catch (error) {
    next(error);
  }
});

router.post("/getUserFeedbacks", async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        User: {
          id: req.body.id,
        },
      },
    });
    res.status(200).send({ feedbacks });
  } catch (err) {
    next(err);
  }
});

const timeouts = new Set<string>();

router.post("/create", protectedRoute, rateLimiter, async (req, res, next) => {
  try {
    const { name, content } = req.body;
    if (!name || !content)
      return res.status(400).send({ message: "All fields are required" });

    const decoded = jwtDecode<JwtPayload>(req.cookies.token);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    const feedback = await prisma.feedback.create({
      data: {
        name,
        content,
        User: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    timeouts.add(decoded.userId);
    res.status(200).send({ feedback: feedback.id });
  } catch (error) {
    next(error);
  }
});

export default router;
