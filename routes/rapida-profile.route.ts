import * as profileController from "../controllers/rapida-profile.controller";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         fullname:
 *           type: string
 *         phone:
 *           type: string
 *         birthday:
 *           type: string
 *         uniqueId:
 *           type: string
 *       example:
 *         _id: 'id'
 *         user: user-id
 *         fullname: Example
 *         phone: 99999999999
 *         birthday: 99999999999
 *         uniqueId: 99999999999
 */

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: The profiles managing API
 */

/**
 * @swagger
 * /v1/profile:
 *   get:
 *     summary: Return a profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A specific profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 */
router.get("/profile", async (req, res) => {
  try {
    const module = await profileController.findByUser((req as any).user);
    res.status(200).json(module);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/profile:
 *   patch:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *               uniqueId:
 *                 type: string
 *             example:
 *               fullname: Example
 *               phone: 99999999999
 *               birthday: 99999999999
 *               uniqueId: 99999999999
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The profile was successfully updated
 *       400:
 *         description: Something went wrong
 */
router.patch("/profile", async (req, res) => {
  try {
    await profileController.updateByUser((req as any).user, {
      email: req.body.email,
      permission: req.body.permission,
      accepted: req.body.accepted ?? false,
    });

    res.status(204).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
