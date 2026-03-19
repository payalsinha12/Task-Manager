import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";import { AuthRequest } from "../middleware/auth.middleware";

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   const accessToken = generateAccessToken(user.id);
const refreshToken = generateRefreshToken(user.id);

// save refresh token in DB
await prisma.user.update({
  where: { id: user.id },
data: { refreshToken },
});

res.json({
  accessToken,
  refreshToken,
});
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

// ✅ GET ME
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

import { verifyRefreshToken } from "../utils/jwt";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // verify token
    const decoded = verifyRefreshToken(refreshToken);

    // find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // generate new access token
    const newAccessToken = generateAccessToken(user.id);

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};



export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // remove refresh token from DB
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout error" });
  }
};