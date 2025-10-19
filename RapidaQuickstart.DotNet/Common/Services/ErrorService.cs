using RapidaQuickstart.DotNet.Enums;

namespace RapidaQuickstart.DotNet.Common.Services
{
    public interface IErrorService
    {
        string GetErrorMessage(ErrorCode errorCode);
    }

    public class ErrorService : IErrorService
    {
        private readonly Dictionary<ErrorCode, string> _errorMessages = new()
        {
            { ErrorCode.UNAUTHORIZED, "Unauthorized access" },
            { ErrorCode.FORBIDDEN, "Access forbidden" },
            { ErrorCode.NOT_FOUND, "Resource not found" },
            { ErrorCode.VALIDATION_ERROR, "Validation error" },
            { ErrorCode.INTERNAL_ERROR, "Internal server error" },
            { ErrorCode.EMAIL_ALREADY_EXISTS, "Email already exists" },
            { ErrorCode.INVALID_CREDENTIALS, "Invalid credentials" },
            { ErrorCode.TOKEN_EXPIRED, "Token has expired" },
            { ErrorCode.USER_NOT_FOUND, "User not found" },
            { ErrorCode.PROFILE_NOT_FOUND, "Profile not found" },
            { ErrorCode.INVITATION_NOT_FOUND, "Invitation not found" },
            { ErrorCode.INVITATION_EXPIRED, "Invitation has expired" },
            { ErrorCode.SMS_CODE_INVALID, "SMS code is invalid" },
            { ErrorCode.SMS_CODE_EXPIRED, "SMS code has expired" }
        };

        public string GetErrorMessage(ErrorCode errorCode)
        {
            return _errorMessages.TryGetValue(errorCode, out var message) 
                ? message 
                : "Unknown error";
        }
    }
}
