import mongoose from "mongoose";
import { ModuleR } from "./rapida-module";

export class ModulePermissionR {
  module: ModuleR;
  permissionActions: string[];

  constructor(data: any) {
    this.module = new ModuleR(data.module);
    this.permissionActions = data.permissionActions;
  }
}

export class PermissionR {
  _id?: string;
  name: string;
  description?: string;
  isAdminPermission?: boolean;
  modulePermissions: ModulePermissionR[];

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.isAdminPermission = data.isAdminPermission ?? false;
    this.modulePermissions = (data.modulePermissions ?? []).map(
      (modulePermission: any) => new ModulePermissionR(modulePermission)
    );
  }
}

const ModulePermissionSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "__Module",
    required: true,
  },

  permissionActions: [String],
});

export const PermissionModelR = mongoose.model(
  "__Permission",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      isAdminPermission: { type: Boolean, default: false },
      modulePermissions: [ModulePermissionSchema],
    },
    {
      collection: "__Permission",
      timestamps: true,
    }
  )
);
