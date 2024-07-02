import { RoleR, RoleRModel } from "../models/rapida-role";

export const create = async (data: any): Promise<void> => {
  const role = new RoleRModel(data);
  await role.save();
};

export const findByUser = async (user: string): Promise<RoleR> => {
  const role = await RoleRModel.findOne({ user }).populate("permission");
  if (!role) throw new Error("Role not found");
  return new RoleR(role);
};

export const update = async (id: string, data: any): Promise<void> => {
  await RoleRModel.findByIdAndUpdate(id, data);
};

export const remove = async (id: string): Promise<void> => {
  await RoleRModel.findByIdAndDelete(id);
};
