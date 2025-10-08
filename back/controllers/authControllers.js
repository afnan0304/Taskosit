import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: process.env.ACCESS_EXPIRES || "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET || "your_refresh_secret",
    { expiresIn: process.env.REFRESH_EXPIRES || "7d" }
  );
};

const hashToken = (token) => {
  const secret = process.env.REFRESH_TOKEN_HASH_SECRET || "refresh_hash_secret";
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(hashToken(refreshToken));
    if (user.refreshTokens.length > 10)
      user.refreshTokens = user.refreshTokens.slice(-10);
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_SECRET || "your_refresh_secret"
      );
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "Invalid token user" });

    const hashed = hashToken(token);
    if (!user.refreshTokens || !user.refreshTokens.includes(hashed)) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    const newRefreshToken = createRefreshToken(user);
    const newHashed = hashToken(newRefreshToken);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
    user.refreshTokens.push(newHashed);
    if (user.refreshTokens.length > 10)
      user.refreshTokens = user.refreshTokens.slice(-10);
    await user.save();

    const accessToken = createAccessToken(user);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_SECRET || "your_refresh_secret"
      );
    } catch (err) {
      return res.status(200).json({ message: "Logged out" });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(200).json({ message: "Logged out" });

    const hashed = hashToken(token);
    user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== hashed);
    await user.save();
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
