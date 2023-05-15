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
    const token = req.cookies.token;
    const decodedToken = jwtDecode<JwtPayload>(token);
    const projects = await prisma.project.findMany({
      where: {
        userId: decodedToken.userId,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: (req.params.id as string) ?? "",
      },
    });
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/create", protectedRoute, rateLimiter, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtDecode<JwtPayload>(token);
    const project = await prisma.project.create({
      data: {
        description: (req.body.content as string) || "Description",
        name: (req.body.name as string) || "New Project",
        user: {
          connect: {
            id: decodedToken.userId,
          },
        },
      },
    });
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
});

export default router;
