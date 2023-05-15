import express from "express";
import { PrismaClient } from "@prisma/client";
import protectedRoute from "../middleware/protectedRoute";
import rateLimiter from "../middleware/rateLimiter";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", protectedRoute, rateLimiter, async (req, res, next) => {
  console.log(req.body);
  const { projectId, content } = req.body;
  try {
    await prisma.feedback.create({
      data: {
        name: "Feedback",
        content,
        Project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
    res.status(200).json({ message: "Feedback created successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
