import { ProfileR, ProfileRModel } from "../models/rapida-profile";

export const create = async (data: any): Promise<void> => {
  const profile = new ProfileRModel(data);
  await profile.save();
};

export const findById = async (id: string): Promise<ProfileR> => {
  const profile = await ProfileRModel.findById(id);
  if (!profile) throw new Error("Profile not found");
  return new ProfileR(profile);
};

export const findByUser = async (user: string): Promise<ProfileR | null> => {
  const profile = await ProfileRModel.findOne({ user });
  return profile && new ProfileR(profile);
};

export const update = async (id: string, data: any): Promise<void> => {
  await ProfileRModel.findByIdAndUpdate(id, data);
};

export const updateByUser = async (user: string, data: any): Promise<void> => {
  await ProfileRModel.findOneAndUpdate({ user }, data);
};

export const remove = async (id: string): Promise<void> => {
  await ProfileRModel.findByIdAndDelete(id);
};
