import * as authController from "../controllers/rapida-auth.controller";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               password: Example
 *     responses:
 *       200:
 *         description: Successfull loggin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authToken:
 *                   type: string
 *       400:
 *         description: Something went wrong
 */
router.post("/login", async (req, res) => {
  try {
    const authToken = await authController.login(
      req.body.email,
      req.body.password
    );
    res.status(200).json({ authToken });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/auth/signup:
 *   post:
 *     summary: Register a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               password: Example
 *     responses:
 *       200:
 *         description: Successfull registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authToken:
 *                   type: string
 *       400:
 *         description: Something went wrong
 */
router.post("/signup", async (req, res) => {
  try {
    const authToken = await authController.signup(
      req.body.email,
      req.body.password
    );
    res.status(200).json({ authToken });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
