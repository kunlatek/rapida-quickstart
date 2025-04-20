import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorService {
  getErrorMessage(code: string, context?: Record<string, any>): string {
    const messages: Record<string, string> = {
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
}
