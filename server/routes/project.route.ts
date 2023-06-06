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
        user: {
          id: decodedToken.userId,
        },
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

router.post("/react", protectedRoute, rateLimiter, async (req, res, next) => {
  const {} = req.body;
});

router.post(
  "/addfeedback",
  protectedRoute,
  rateLimiter,
  async (req, res, next) => {
    const {
      projectId,
      feedback: { content },
    } = req.body;

    if (projectId && content) {
      try {
        const user = jwtDecode<JwtPayload>(req.cookies.token);

        const data = await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            feedbacks: {
              push: {
                content,
                name: "Feedback Name",
                author: user.userId,
              },
            },
          },
        });

        const io = req.app.get("io");
        io.to(`project-${projectId}`).emit("feedbackAdded", data.feedbacks);

        res.status(200).json({ message: "Feedback added" });
      } catch (err) {
        next(err);
      }
    } else {
      res
        .status(400)
        .json({ message: "Please provide a project id and feedback content" });
    }
  }
);

export default router;
