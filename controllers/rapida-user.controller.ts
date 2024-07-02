import { hash } from "bcryptjs";
import { UserR, UserRModel } from "../models/rapida-user";
import * as roleController from "./rapida-role.controller";
import * as permissionController from "./rapida-permission.controller";
import type { ModulePermissionR } from "../models/rapida-permission";

export const create = async (data: any): Promise<void> => {
  data.password = await hash(data.password, 10);
  const user = new UserRModel(data);
  await user.save();
};

export const findById = async (id: string): Promise<UserR> => {
  const user = await UserRModel.findById(id);
  if (!user) throw new Error("User not found");
  return new UserR(user);
};

export const findByEmail = async (email: string): Promise<UserR | null> => {
  return await UserRModel.findOne({ email });
};

export const getUserPermissions = async (
  user: string
): Promise<ModulePermissionR[]> => {
  const role = await roleController.findByUser(user);
  return (await permissionController.findById(role.permission._id!))
    .modulePermissions;
};
