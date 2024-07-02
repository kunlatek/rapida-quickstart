import mongoose from "mongoose";

export class UserR {
  _id?: string;
  email: string;
  password?: string;

  constructor(data: any) {
    this._id = data._id;
    this.email = data.email;
    this.password = data.password;
  }
}

export const UserRModel = mongoose.model(
  "__User",
  new mongoose.Schema(
    {
      email: { type: String, required: true },
      password: { type: String, required: true },
    },
    {
      collection: "__User",
      timestamps: true,
    }
  )
);
