import * as moduleController from "../controllers/rapida-module.controller";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - name
 *         - route
 *         - icon
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         route:
 *           type: string
 *         icon:
 *           type: string
 *       example:
 *         _id: 'id'
 *         name: Example
 *         description: Example
 *         route: Example
 *         icon: Example
 */

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: The modules managing API
 */

/**
 * @swagger
 * /v1/modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - route
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               route:
 *                 type: string
 *               icon:
 *                 type: string
 *             example:
 *               name: Example
 *               description: Example
 *               route: Example
 *               icon: Example
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: The module was successfully created
 *       400:
 *         description: Something went wrong
 */
router.post("/", async (req, res) => {
  try {
    await moduleController.create({
      name: req.body.name,
      description: req.body.description,
      route: req.body.route,
      icon: req.body.icon,
    });
    res.status(201).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/modules:
 *   get:
 *     summary: Returns the list of all the modules
 *     tags: [Modules]
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
 *         description: The list of the modules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 */
router.get("/", async (req, res) => {
  try {
    const [result, total] = await Promise.all([
      moduleController.findAll(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string)
      ),
      moduleController.count(),
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
 * /v1/modules/{id}:
 *   get:
 *     summary: Return a module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The module id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A specific module
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 */
router.get("/:id", async (req, res) => {
  try {
    const module = await moduleController.findById(req.params.id);
    res.status(200).json(module);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/modules/{id}:
 *   patch:
 *     summary: Update a module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - route
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               route:
 *                 type: string
 *               icon:
 *                 type: string
 *             example:
 *               name: Example
 *               description: Example
 *               route: Example
 *               icon: Example
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The module was successfully updated
 *       400:
 *         description: Something went wrong
 */
router.patch("/:id", async (req, res) => {
  try {
    await moduleController.update(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      route: req.body.route,
      icon: req.body.icon,
    });

    res.status(204).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The module id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The module was successfully deleted
 *       400:
 *         description: Something went wrong
 */
router.delete("/:id", async (req, res) => {
  try {
    await moduleController.remove(req.params.id);
    res.status(200).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
