import * as invitationController from "../controllers/rapida-invitation.controller";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Invitation:
 *       type: object
 *       required:
 *         - email
 *         - permission
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         permission:
 *           type: string
 *         accepted:
 *           type: boolean
 *       example:
 *         _id: 'id'
 *         email: example@example.com
 *         permission: permission-id
 *         accepted: false
 */

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: The invitations managing API
 */

/**
 * @swagger
 * /v1/invitations:
 *   post:
 *     summary: Create a new invitation
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - permission
 *             properties:
 *               email:
 *                 type: string
 *               permission:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               permission: permission-id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: The permission was successfully created
 *       400:
 *         description: Something went wrong
 */
router.post("/", async (req, res) => {
  try {
    await invitationController.create({
      email: req.body.email,
      permission: req.body.permission,
      accepted: req.body.accepted ?? false,
    });
    res.status(201).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/invitations:
 *   get:
 *     summary: Returns the list of all the invitations
 *     tags: [Invitations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the invitations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invitation'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 */
router.get("/", async (req, res) => {
  try {
    const [result, total] = await Promise.all([
      invitationController.findAll(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string)
      ),
      invitationController.count(),
    ]);

    res.status(200).json({
      result,
      total,
      page: parseInt((req.query.page as string) ?? "0"),
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/invitations/{id}:
 *   get:
 *     summary: Return a invitation
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invitation id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A specific invitation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invitation'
 */
router.get("/:id", async (req, res) => {
  try {
    const module = await invitationController.findById(req.params.id);
    res.status(200).json(module);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/invitations/{id}:
 *   patch:
 *     summary: Update a invitation
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - permission
 *             properties:
 *               email:
 *                 type: string
 *               permission:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               permission: permission-id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The invitation was successfully updated
 *       400:
 *         description: Something went wrong
 */
router.patch("/:id", async (req, res) => {
  try {
    await invitationController.update(req.params.id, {
      email: req.body.email,
      permission: req.body.permission,
      accepted: req.body.accepted ?? false,
    });

    res.status(204).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/invitations/{id}:
 *   delete:
 *     summary: Delete a invitation
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invitation id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The invitation was successfully deleted
 *       400:
 *         description: Something went wrong
 */
router.delete("/:id", async (req, res) => {
  try {
    await invitationController.remove(req.params.id);
    res.status(200).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
