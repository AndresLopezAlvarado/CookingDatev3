import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { createAccessToken, createNewRefreshToken } from "../libs/jwt.js";
import { REFRESH_TOKEN_SECRET } from "../config/config.js";

export const signUp = async (req, res) => {
  const cookies = req.cookies;
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });

    const userSaved = await newUser.save();

    const accessToken = await createAccessToken({ id: userSaved._id });

    const newRefreshToken = await createNewRefreshToken({ id: userSaved._id });

    let newRefreshTokenArray = !cookies?.refreshToken
      ? userSaved.refreshToken
      : userSaved.refreshToken.filter((rt) => rt !== cookies.refreshToken);

    if (cookies?.refreshToken) {
      const refreshToken = cookies.refreshToken;

      const tokenFound = await User.findOne({ refreshToken });

      if (!tokenFound) newRefreshTokenArray = [];

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    userSaved.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await userSaved.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      Partitioned: true,
    });

    res.json({ user: userSaved, accessToken });
  } catch (error) {
    console.error({
      message: "Something went wrong on sign up (signUp)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on sign up (signUp)",
      error: error,
    });
  }
};

export const signIn = async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({ message: "User no found (signIn)" });

    const isPasswordMatch = await bcrypt.compare(password, userFound.password);

    if (!isPasswordMatch)
      return res.status(400).json({ message: "Incorrect password (signIn)" });

    const accessToken = await createAccessToken({ id: userFound._id });

    const newRefreshToken = await createNewRefreshToken({ id: userFound._id });

    let newRefreshTokenArray = !cookies?.refreshToken
      ? userFound.refreshToken
      : userFound.refreshToken.filter((rt) => rt !== cookies.refreshToken);

    if (cookies?.refreshToken) {
      const refreshToken = cookies.refreshToken;

      const tokenFound = await User.findOne({ refreshToken });

      if (!tokenFound) newRefreshTokenArray = [];

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await userFound.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      Partitioned: true,
    });

    res.json({ user: userFound, accessToken });
  } catch (error) {
    console.error({
      message: "Something went wrong on sign in (signIn)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on sign in (signIn)",
      error: error,
    });
  }
};

export const logOut = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(400).json({ message: "refreshToken no found (logOut)" });

  const refreshToken = cookies.refreshToken;

  try {
    const userFound = await User.findOne({ refreshToken });

    if (!userFound) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.sendStatus(204);
    }

    userFound.refreshToken = userFound.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    await userFound.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.sendStatus(204);
  } catch (error) {
    console.error({
      message: "Something went wrong on log out (logOut)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on log out (logOut)",
      error: error,
    });
  }
};

export const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(400).json({ message: "refreshToken no found (refresh)" });

  const refreshToken = cookies.refreshToken;

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  try {
    const userFound = await User.findOne({ refreshToken });

    if (!userFound) {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        //Quizá esta parte no funcione
        const hackedUser = await User.findOne({ email: decoded.email });

        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
      });

      return res.sendStatus(403);
    }

    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        userFound.refreshToken = [...newRefreshTokenArray];
        await userFound.save();
      }

      //decoded es undefined si err existe, así que cierra la sesion por cualquier causa y no especifimente porque el token haya expirado.
      // if (err || userFound._id !== decoded.id) return res.sendStatus(403);
      //Entonces comenté la linea superior y en el createAccessToken debería estar pasando decoded.id

      const accessToken = await createAccessToken({ id: userFound._id });

      const newRefreshToken = await createNewRefreshToken({
        id: userFound._id,
      });

      userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await userFound.save();

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        max: 24 * 60 * 60 * 1000,
      });

      res.json({ user: userFound, accessToken });
    });
  } catch (error) {
    console.error({
      message: "Something went wrong on refresh token (refresh)",
      error: error,
    });
    res.status(500).json({
      message: "Something went wrong on refresh token (refresh)",
      error: error,
    });
  }
};
