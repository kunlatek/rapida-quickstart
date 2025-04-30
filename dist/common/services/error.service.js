"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorService = void 0;
const common_1 = require("@nestjs/common");
let ErrorService = class ErrorService {
    getErrorMessage(code, context) {
        const messages = {
            USER_NOT_FOUND: 'User with the given ID was not found.',
            INVALID_CREDENTIALS: 'Invalid email or password.',
            UNAUTHORIZED: 'You are not authorized to perform this action.',
            FORBIDDEN: 'You are not allowed to perform this action.',
            INVALID_DATE_RANGE: 'Invalid date range provided.',
            INVALID_EMAIL: 'Invalid email address.',
            EMAIL_IN_USE: 'Email address is already in use.',
            INVALID_PASSWORD: 'Password must be at least 6 characters long.',
            INVALID_ZIP_CODE: 'Invalid ZIP code.',
            INVALID_PHONE_NUMBER: 'Invalid phone number.',
            PROFILE_ALREADY_EXISTS: 'Profile already exists for this user.',
            PROFILE_NOT_FOUND: 'Profile not found.',
            MINIMUM_AGE_REQUIRED: '18 years or older required.',
        };
        let message = messages[code] || 'An unexpected error occurred.';
        if (context) {
            Object.keys(context).forEach((key) => {
                message = message.replace(`{{${key}}}`, context[key]);
            });
        }
        return message;
    }
};
exports.ErrorService = ErrorService;
exports.ErrorService = ErrorService = __decorate([
    (0, common_1.Injectable)()
], ErrorService);
//# sourceMappingURL=error.service.js.map