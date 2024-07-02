import mongoose from "mongoose";

export class InvitationR {
  _id?: string;
  email: string;
  permission: string;
  accepted?: boolean;

  constructor(data: any) {
    this._id = data._id;
    this.email = data.email;
    this.permission = data.permission;
    this.accepted = data.accepted ?? false;
  }
}

export const InvitationRModel = mongoose.model(
  "__Invitation",
  new mongoose.Schema(
    {
      email: { type: String, required: true },
      permission: { type: String, required: true },
      accepted: { type: Boolean, default: false },
    },
    {
      collection: "__Invitation",
      timestamps: true,
    }
  )
);
