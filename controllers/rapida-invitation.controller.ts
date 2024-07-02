import { InvitationR, InvitationRModel } from "../models/rapida-invitation";

export const create = async (data: any): Promise<void> => {
  const invitation = new InvitationRModel(data);
  await invitation.save();
};

export const findAll = async ({
  filter,
  limit,
  page,
}: {
  filter?: any;
  limit?: number;
  page?: number;
}): Promise<InvitationR[]> => {
  return (
    await InvitationRModel.find({ ...(filter ?? {}) })
      .limit(limit ?? 100)
      .skip((page ?? 0) * (limit ?? 100))
  ).map((el: any) => new InvitationR(el));
};

export const count = async (): Promise<number> => {
  return await InvitationRModel.find().countDocuments();
};

export const findById = async (id: string): Promise<InvitationR> => {
  const invitation = await InvitationRModel.findById(id);
  if (!invitation) throw new Error("Invitation not found");
  return new InvitationR(invitation);
};

export const findByEmail = async (
  email: string
): Promise<InvitationR | null> => {
  const invitation = await InvitationRModel.findOne({ email });
  return invitation && new InvitationR(invitation);
};

export const update = async (id: string, data: any): Promise<void> => {
  await InvitationRModel.findByIdAndUpdate(id, data);
};

export const remove = async (id: string): Promise<void> => {
  await InvitationRModel.findByIdAndDelete(id);
};
