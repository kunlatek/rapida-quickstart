import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Base schema for all profiles, using "type" as the discriminatorKey.
 * Important: We do NOT define @Prop() for "type", because that would conflict
 * with the Mongoose discriminatorKey. However, we still declare it in TypeScript
 * so that accessing profile.type in the code won't cause compilation errors.
 */
@Schema({
  discriminatorKey: 'type', // Mongoose automatically manages the "type" field internally
  collection: 'profiles', // All profiles in one collection
  timestamps: true, // Adds createdAt, updatedAt
})
export class Profile extends Document {
  /**
   * Mongoose will create and manage the "type" field automatically
   * (for instance, "person" or "company").
   * We declare it here so TypeScript recognizes its existence.
   */
  declare type: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  notes?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
