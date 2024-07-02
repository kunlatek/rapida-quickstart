import mongoose from "mongoose";

export class ModuleR {
  _id?: string;
  name: string;
  description?: string;
  route: string;
  icon: string;

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.route = data.route;
    this.icon = data.icon;
  }
}

export const ModuleRModel = mongoose.model(
  "__Module",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      route: { type: String, required: true },
      icon: { type: String, required: true },
    },
    {
      collection: "__Module",
      timestamps: true,
    }
  )
);
