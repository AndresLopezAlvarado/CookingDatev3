import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      { expiresIn: "10s" },

      (err, accessToken) => {
        if (err) reject(err);

        resolve(accessToken);
      }
    );
  });
}

export function createNewRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET,
      { expiresIn: "20s" },

      (err, refreshToken) => {
        if (err) reject(err);

        resolve(refreshToken);
      }
    );
  });
}
