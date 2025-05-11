import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ required: true })
    role: string;

    @Prop({ default: false })
    accepted: boolean;

    @Prop()
    acceptedAt?: Date;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite); 