import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateToken from "../middleware/validateTokenHandler";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ message: "Email and password are required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    prisma.user
      .create({
        data: {
          email,
          password: hashedPassword,
        },
      })
      .then((user) => {
        res.status(200).send({ message: "User created successfully" });
      })
      .catch((err) => {
        res.status(400).send({ message: "User already exists" });
      });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", validateToken, (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out" });
});

router.get("/user", validateToken, async (req: any, res, next) => {
  try {
    prisma.user
      .findUnique({
        where: {
          id: req.user.user.id,
        },
      })
      .then((user) => {
        res.status(200).send({ email: user?.email, id: user?.id });
      })
      .catch((err) => {
        res.status(400).send({ message: "User does not exist" });
      });
  } catch (err) {
    next(err);
  }
});

router.get("/", validateToken, async (req: any, res, next) => {
  const userData = req.user.user;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });
    if (user) {
      res.status(200).send({ email: user.email, id: user.id });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(400).send({ message: "Email and password are required" });

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).send({ message: "User does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(
      password,
      user?.password as string
    );
    if (!passwordMatch) {
      res.status(400).send({ message: "Password is incorrect" });
    } else {
      // USER LOGGED IN SUCCESSFULLY

      const accessToken = jwt.sign(
        {
          user: {
            id: user?.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );
      res
        .cookie("token", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .send({
          message: "User logged in successfully",
          accessToken,
        });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
