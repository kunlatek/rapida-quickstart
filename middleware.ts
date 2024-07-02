import { verify, type JwtPayload } from "jsonwebtoken";

import * as roleController from "./controllers/rapida-role.controller";
import * as permissionController from "./controllers/rapida-permission.controller";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    if (!req.headers.authorization)
      throw new Error("Missing authentication token");

    const token = req.headers.authorization.split(" ")[1];

    const { user } = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const route = req.originalUrl.split("/")[2];
    const method = req.method;
    if (!(await userHasPermission(user, route, method)))
      throw new Error("unauthorized user");

    req.user = user;
    next();
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

const userHasPermission = async (
  user: string,
  route: string,
  method: string
) => {
  const role = await roleController.findByUser(user);
  const permission = await permissionController.findById(role.permission._id!);

  if (permission.isAdminPermission) return true;

  return permission.modulePermissions.reduce((prev, current) => {
    if (
      current.module.route === route &&
      current.permissionActions.includes(method)
    ) {
      prev = true;
    }
    return prev;
  }, false);
};
