import * as userController from "./rapida-user.controller";
import * as invitationController from "./rapida-invitation.controller";
import * as roleController from "./rapida-role.controller";
import * as profileController from "./rapida-profile.controller";

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await userController.findByEmail(email);

  if (!user) throw new Error("User not found.");

  if (!(await compare(password, user.password!)))
    throw new Error("Invalid password.");

  return sign({ user: user._id?.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const signup = async (
  email: string,
  password: string
): Promise<string> => {
  const [userFound, invitationFound] = await Promise.all([
    userController.findByEmail(email),
    invitationController.findByEmail(email),
  ]);

  if (userFound) throw new Error("Email already exists");
  if (!invitationFound) throw new Error("Only invited user can access the app");

  await userController.create({ email, password });

  const user = await userController.findByEmail(email);

  await Promise.all([
    roleController.create({
      user: user?._id?.toString(),
      permission: invitationFound.permission,
    }),
    invitationController.update(invitationFound._id!, { accepted: true }),
    profileController.create({ user: user?._id }),
  ]);

  return sign({ user: user?._id?.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
