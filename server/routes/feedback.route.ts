import express from "express";
import { PrismaClient } from "@prisma/client";
import validateToken from "../middleware/validateTokenHandler";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", validateToken, async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({});
    res.send({ feedbacks });
  } catch (error) {
    next(error);
  }
});

router.get("/getUser", validateToken, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (user) {
      res.status(200).send({ email: user.email });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/create", validateToken, async (req, res, next) => {
  try {
    const { name, author, content } = req.body;
    if (!name || !author || !content)
      return res.status(400).send({ message: "All fields are required" });

    res.status(200).send({ message: "Ok" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res) => {
  // get the id param
  const id = req.params.id;
  res.send({ message: "Feedback route " + id });
});

export default router;
