import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import createError from "http-errors";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

require("dotenv").config();

// routes
import { feedbackRoute, apiRoute, authRoutes, projectRoute } from "./routes";
import cookieParser from "cookie-parser";
import connectionsHandler from "./sockets/connections";
import protectedRoute from "./middleware/protectedRoute";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.app.set("io", io);
  next();
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3100",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3100",
    methods: ["GET", "POST"],
  },
});

connectionsHandler(io);

app.post("/", protectedRoute, (req, res) => {
  res.status(200).json({ data: "👋" });
});

app.use("/api/", apiRoute);
app.use("/feedback/", feedbackRoute);
app.use("/auth/", authRoutes);
app.use("/project/", projectRoute);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err: any, req: any, res: any, next: () => void) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
