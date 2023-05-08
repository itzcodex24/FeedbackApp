import jwt from "jsonwebtoken";

const validateToken = async (req: any, res: any, next: any) => {
  const token = req.cookies["token"];
  if (!token) return res.status(402).send({ message: "Unauthorized" });

  try {
    const valid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    if (!valid) return res.status(403).send({ message: "Forbidden" });
    req.user = valid;
    next();
  } catch (err) {
    return res.status(403).send({ message: "Forbidden", err });
  }
};

export default validateToken;
