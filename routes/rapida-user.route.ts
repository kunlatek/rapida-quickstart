import * as userController from "../controllers/rapida-user.controller";

import express from "express";

const router = express.Router();

router.get("/permissions", async (req, res) => {
  try {
    const permissions = await userController.getUserPermissions(
      (req as any).user
    );
    res.status(200).json({ permissions });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const profile = {};
    res.status(200).json({ profile });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
