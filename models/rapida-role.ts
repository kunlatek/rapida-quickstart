import mongoose from "mongoose";
import { PermissionR } from "./rapida-permission";

export class RoleR {
  _id?: string;
  user: string;
  permission: PermissionR;

  constructor(data: any) {
    this._id = data._id;
    this.user = data.user;
    this.permission = new PermissionR(data.permission);
  }
}

export const RoleRModel = mongoose.model(
  "__Role",
  new mongoose.Schema(
    {
      user: { type: String, required: true },
      permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "__Permission",
        required: true,
      },
    },
    {
      collection: "__Role",
      timestamps: true,
    }
  )
);
