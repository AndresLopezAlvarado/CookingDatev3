import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";

export const authRequired = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return res
      .status(401)
      .json({ message: "No accessToken, authorization denied (authRequired)" });

  jwt.verify(accessToken, TOKEN_SECRET, (err, user) => {
    if (err)
      return res.json({
        message: "Invalid accessToken (authRequired)",
        error: err,
      });

    req.user = user;

    next();
  });
};
