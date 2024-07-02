import * as permissionController from "../controllers/rapida-permission.controller";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ModulePermission:
 *       type: object
 *       required:
 *         - module
 *         - permissionActions
 *       properties:
 *         module:
 *           type:
 *             '#/components/schemas/Module'
 *         permissionActions:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         module: module-id
 *         permissionActions: [GET]
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isAdminPermission:
 *           type: boolean
 *         modulePermissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ModulePermission'
 *       example:
 *         _id: 'id'
 *         name: Example
 *         description: Example
 *         isAdminPermission: false
 *         modulePermissions: [{
 *           "module": {
 *             "_id": "module-id",
 *             "name": "Example",
 *             "description": "Example",
 *             "route": "Example",
 *             "icon": "Example",
 *           },
 *           "permissionActions": ["GET"]
 *         }]
 */

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: The permissions managing API
 */

/**
 * @swagger
 * /v1/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - modulePermissions
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isAdminPermission:
 *                 type: boolean
 *               modulePermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                     permissionActions:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               name: Example
 *               description: Example
 *               isAdminPermission: false
 *               modulePermissions: [{
 *                 "module": "module-id",
 *                 "permissionActions": ["GET"]
 *               }]
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
    await permissionController.create({
      name: req.body.name,
      description: req.body.description,
      isAdminPermission: req.body.isAdminPermission,
      modulePermissions: req.body.modulePermissions.map(
        (modulePermission: any) => {
          return {
            module: modulePermission.module,
            permissionActions: modulePermission.permissionActions,
          };
        }
      ),
    });
    res.status(201).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/permissions:
 *   get:
 *     summary: Returns the list of all the permissions
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: object
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
 *         description: The list of the permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 */
router.get("/", async (req, res) => {
  try {
    const [result, total] = await Promise.all([
      permissionController.findAll({
        filter: req.query.filter,
        limit: parseInt(req.query.limit as string),
        page: parseInt(req.query.page as string),
      }),
      permissionController.count(),
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
 * /v1/permissions/{id}:
 *   get:
 *     summary: Return a permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The permission id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A specific permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 */
router.get("/:id", async (req, res) => {
  try {
    const module = await permissionController.findById(req.params.id);
    res.status(200).json(module);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/permissions/{id}:
 *   patch:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - modulePermissions
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isAdminPermission:
 *                 type: boolean
 *               modulePermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                     permissionActions:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               name: Example
 *               description: Example
 *               isAdminPermission: false
 *               modulePermissions: [{
 *                 "module": "module-id",
 *                 "permissionActions": ["GET"]
 *               }]
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
    await permissionController.update(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      isAdminPermission: req.body.isAdminPermission,
      modulePermissions: req.body.modulePermissions.map(
        (modulePermission: any) => {
          return {
            module: modulePermission.module,
            permissionActions: modulePermission.permissionActions,
          };
        }
      ),
    });

    res.status(204).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @swagger
 * /v1/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The permission id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The permission was successfully deleted
 *       400:
 *         description: Something went wrong
 */
router.delete("/:id", async (req, res) => {
  try {
    await permissionController.remove(req.params.id);
    res.status(200).json({});
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
