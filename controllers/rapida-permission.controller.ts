import { PermissionR, PermissionModelR } from "../models/rapida-permission";

export const create = async (data: any): Promise<void> => {
  const permission = new PermissionModelR(data);
  await permission.save();
};

export const findAll = async ({
  filter,
  limit,
  page,
}: {
  filter?: any;
  limit?: number;
  page?: number;
}): Promise<PermissionR[]> => {
  return (
    await PermissionModelR.find({ ...(filter ?? {}) })
      .limit(limit ?? 100)
      .skip((page ?? 0) * (limit ?? 100))
      .populate("modulePermissions.module")
  ).map((el: any) => new PermissionR(el));
};

export const count = async (): Promise<number> => {
  return await PermissionModelR.find().countDocuments();
};

export const findById = async (id: string): Promise<PermissionR> => {
  const permission = await PermissionModelR.findById(id).populate(
    "modulePermissions.module"
  );
  if (!permission) throw new Error("Permission not found");
  return new PermissionR(permission);
};

export const update = async (id: string, data: any): Promise<void> => {
  await PermissionModelR.findByIdAndUpdate(id, data);
};

export const remove = async (id: string): Promise<void> => {
  await PermissionModelR.findByIdAndDelete(id);
};
