import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // timestamps adiciona createdAt e updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, default: null }) // Campo para soft delete
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Adiciona um filtro global para excluir documentos com deletedAt definido
UserSchema.pre(/^find/, function (next) {
  (this as any).setQuery({ ...(this as any).getQuery(), deletedAt: null });
  next();
});
