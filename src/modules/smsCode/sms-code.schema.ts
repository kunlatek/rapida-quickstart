import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SmsCodeDocument = SmsCode & Document

@Schema({ timestamps: true })
export class SmsCode {
    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    used: boolean;
}

export const SmsCodeSchema = SchemaFactory.createForClass(SmsCode);