import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    createdBy: string;

    @Prop({ required: true })
    ownerId: string;

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

export const InvitationSchema = SchemaFactory.createForClass(Invitation); 