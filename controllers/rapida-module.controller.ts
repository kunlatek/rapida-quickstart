import { ModuleR, ModuleRModel } from "../models/rapida-module";

export const create = async (data: any): Promise<void> => {
  const module = new ModuleRModel(data);
  await module.save();
};

export const findAll = async ({
  filter,
  limit,
  page,
}: {
  filter?: any;
  limit?: number;
  page?: number;
}): Promise<ModuleR[]> => {
  return (
    await ModuleRModel.find({ ...(filter ?? {}) })
      .limit(limit ?? 100)
      .skip((page ?? 0) * (limit ?? 100))
  ).map((el: any) => new ModuleR(el));
};

export const count = async (): Promise<number> => {
  return await ModuleRModel.find().countDocuments();
};

export const findById = async (id: string): Promise<ModuleR> => {
  const module = await ModuleRModel.findById(id);
  if (!module) throw new Error("Module not found");
  return new ModuleR(module);
};

export const update = async (id: string, data: any): Promise<void> => {
  await ModuleRModel.findByIdAndUpdate(id, data);
};

export const remove = async (id: string): Promise<void> => {
  await ModuleRModel.findByIdAndDelete(id);
};
