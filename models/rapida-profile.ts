import mongoose from "mongoose";

export class ProfileR {
  _id?: string;
  user: string;
  fullname?: string;
  phone?: string;
  birthday?: number;
  uniqueId?: string;

  constructor(data: any) {
    this._id = data._id;
    this.user = data.user;
    this.fullname = data.fullname;
    this.phone = data.phone;
    this.birthday = data.birthday;
    this.uniqueId = data.uniqueId;
  }
}

export const ProfileRModel = mongoose.model(
  "__Profile",
  new mongoose.Schema(
    {
      user: { type: String, required: true },
      fullname: { type: String },
      phone: { type: String },
      birthday: { type: Number },
      uniqueId: { type: String },
    },
    {
      collection: "__Profile",
      timestamps: true,
    }
  )
);
