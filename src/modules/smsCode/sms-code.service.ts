import { Injectable } from "@nestjs/common";
import { SmsCodeDocument } from "./sms-code.schema";
import { SmsCode } from "./sms-code.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateSmsCodeDto } from "./dto/create-sms-code.dto";
import { VerifySmsCodeDto } from "./dto/verify-sms-code.dto";
import { Twilio } from "twilio";

@Injectable()
export class SmsCodeService {
    private twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    constructor(@InjectModel(SmsCode.name) private smsCodeModel: Model<SmsCodeDocument>) {}

    async createSmsCode(payload: CreateSmsCodeDto): Promise<SmsCodeDocument> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const smsCode = new this.smsCodeModel({
            phone: payload.phone,
            code,
            expiresAt,
        });

        return smsCode.save();
    }

    async sendSms(payload: CreateSmsCodeDto): Promise<void> {
        const smsCode = await this.createSmsCode(payload);
        await this.twilio.messages.create({
            body: `Your verification code is ${smsCode.code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: payload.phone,
        });
    }

    async verifySmsCode(payload: VerifySmsCodeDto): Promise<void> {
        const smsCode = await this.smsCodeModel.findOne({
            phone: payload.phone,
        });
        
        if (!smsCode) {
            throw new Error('SMS code not found');
        }

        if (smsCode.code !== payload.code) {
            throw new Error('Invalid SMS code');
        }

        if (smsCode.expiresAt < new Date()) {
            throw new Error('SMS code expired');
        }

        if (smsCode.used) {
            throw new Error('SMS code already used');
        }
    }

    async validateSmsCode(payload: VerifySmsCodeDto): Promise<void> {
        await this.verifySmsCode(payload);

        await this.smsCodeModel.findOneAndUpdate({
            phone: payload.phone,
        }, {
            used: true,
        });
    }
}
