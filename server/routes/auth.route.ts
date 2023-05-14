import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createAccessToken, remove } from "../helpers";
import protectedRoute from "../middleware/protectedRoute";
import jwtDecode, { InvalidTokenError } from "jwt-decode";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", async (req, res, next) => {
  try {
    let returnedUsers: any[] = [];

    const users = await prisma.user.findMany({});

    users.length > 0 &&
      users.map((u) => {
        returnedUsers.push(remove(u, ["password"]));
      });
    res.status(200).send(returnedUsers);
  } catch (err) {
    next(err);
  }
});

router.post("/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send({ message: "Refresh token is required" });
    }
  } catch (err) {
    next(err);
  }
});

const maxAge = 3 * 24 * 60 * 60;

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
          password: hashedPassword,
          email,
          username: "",
        },
      })
      .then((user) => {
        const io = req.app.get("io");
        io.to("register").emit("newRegister", {
          message: "New user registered",
          user: remove(user, ["password"]),
        });

        const accessToken = createAccessToken(user.id, maxAge);
        res
          .cookie("token", accessToken, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          })
          .send({ message: "User successfully registered !", userId: user.id });
      })
      .catch((err) => {
        res.status(400).send({ message: "User already exists" });
      });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", protectedRoute, (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out" });
});

router.post("/reset", protectedRoute, async (req, res) => {
  console.log(req.body);
  const { id, currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!id || !currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (isPasswordValid) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.status(200).send({ message: "Password updated" });
    } else {
      return res.status(400).send({ message: "Wrong password" });
    }
  } else {
    return res.status(400).send({ message: "User does not exists" });
  }
});

router.get("/user", protectedRoute, async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded instanceof InvalidTokenError) {
      return res
        .status(400)
        .send({ message: "Invalid token", status: "UNAUTHORIZED" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (user) {
      return res.status(200).send({
        email: user.email,
        id: user.id,
        role: user.role,
        username: user.username,
        status: "AUTHORIZED",
      });
    }
    return res
      .status(400)
      .send({ message: "User does not exists", status: "UNAUTHORIZED" });
  } else {
    res
      .status(400)
      .send({ message: "User is not authenticated", status: "UNAUTHORIZED" });
  }
});

router.get("/", protectedRoute, async (req: any, res, next) => {
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
        email: email,
      },
    });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Email or password are incorrect" });
    }

    const passwordMatch = bcrypt.compareSync(
      password,
      user?.password as string
    );
    if (!passwordMatch) {
      res.status(400).send({ message: "Password is incorrect" });
    } else {
      // USER LOGGED IN SUCCESSFULLY
      const token = createAccessToken(user.id, maxAge);
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        })
        .status(200)
        .json({ user: user.id });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
