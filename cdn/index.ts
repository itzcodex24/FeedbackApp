import * as dotenv from "dotenv";

dotenv.config();

import fs from "fs";
import path from "path";
import url from "url";
import Jimp from "jimp";
import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin:
      process.env.APP_ORIGIN && process.env.APP_ORIGIN != "*"
        ? process.env.APP_ORIGIN.split(",")
        : "*",
    optionsSuccessStatus: 200,
  })
);

app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const filePath = path.join(__dirname, process.env.DEFAULT_IMAGE ?? "");
  res.sendFile(filePath);
});
