using MongoDB.Driver;
using MongoDB.Bson;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Models;
using System.Security.Cryptography;

namespace RapidaQuickstart.DotNet.Services
{
    public interface ISmsService
    {
        Task<SmsCode> CreateSmsCodeAsync(CreateSmsCodeDto dto);
        Task<(List<SmsCode> data, int total)> FindAllAsync(SmsCodeFilterDto filterDto);
        Task<SmsCode?> FindSmsCodeByIdAsync(string id);
        Task<SmsCode?> FindSmsCodeByPhoneAsync(string phoneNumber);
        Task<SmsCode> VerifySmsCodeAsync(VerifySmsCodeDto dto);
        Task DeleteSmsCodeAsync(string id);
        Task<bool> IsPhoneVerifiedAsync(string phoneNumber);
    }

    public class SmsService : ISmsService
    {
        private readonly IMongoCollection<SmsCode> _smsCodes;
        private readonly IConfiguration _configuration;

        public SmsService(IMongoDbService mongoDbService, IConfiguration configuration)
        {
            _smsCodes = mongoDbService.GetCollection<SmsCode>("sms-codes");
            _configuration = configuration;
        }

        public async Task<SmsCode> CreateSmsCodeAsync(CreateSmsCodeDto dto)
        {
            // Check if there's already a valid SMS code for this phone number
            var existingCode = await FindSmsCodeByPhoneAsync(dto.PhoneNumber);
            if (existingCode != null && existingCode.IsValid)
            {
                throw new InvalidOperationException("SMS code already sent. Please wait before requesting a new one.");
            }

            // Generate SMS code
            var code = GenerateSmsCode();

            var smsCode = new SmsCode
            {
                PhoneNumber = dto.PhoneNumber,
                Code = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(dto.ExpirationMinutes),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _smsCodes.InsertOneAsync(smsCode);

            // Send SMS (in a real implementation, you would use Twilio or another SMS service)
            await SendSmsAsync(dto.PhoneNumber, code);

            return smsCode;
        }

        public async Task<(List<SmsCode> data, int total)> FindAllAsync(SmsCodeFilterDto filterDto)
        {
            var filter = Builders<SmsCode>.Filter.Eq(s => s.IsDeleted, false);

            // Apply phone number filter
            if (!string.IsNullOrEmpty(filterDto.PhoneNumber))
            {
                filter = Builders<SmsCode>.Filter.And(filter, Builders<SmsCode>.Filter.Eq(s => s.PhoneNumber, filterDto.PhoneNumber));
            }

            // Apply verified filter
            if (filterDto.IsVerified.HasValue)
            {
                filter = Builders<SmsCode>.Filter.And(filter, Builders<SmsCode>.Filter.Eq(s => s.IsVerified, filterDto.IsVerified.Value));
            }

            // Apply expired filter
            if (filterDto.IsExpired.HasValue)
            {
                var now = DateTime.UtcNow;
                if (filterDto.IsExpired.Value)
                {
                    filter = Builders<SmsCode>.Filter.And(filter, Builders<SmsCode>.Filter.Lt(s => s.ExpiresAt, now));
                }
                else
                {
                    filter = Builders<SmsCode>.Filter.And(filter, Builders<SmsCode>.Filter.Gte(s => s.ExpiresAt, now));
                }
            }

            // Build sort
            var sort = filterDto.SortDirection == "desc" 
                ? Builders<SmsCode>.Sort.Descending(filterDto.SortBy)
                : Builders<SmsCode>.Sort.Ascending(filterDto.SortBy);

            // Get total count
            var total = await _smsCodes.CountDocumentsAsync(filter);

            // Get paginated data
            var skip = (filterDto.Page - 1) * filterDto.Limit;
            var data = await _smsCodes.Find(filter)
                .Sort(sort)
                .Skip(skip)
                .Limit(filterDto.Limit)
                .ToListAsync();

            return (data, (int)total);
        }

        public async Task<SmsCode?> FindSmsCodeByIdAsync(string id)
        {
            return await _smsCodes.Find(s => s.Id == id && !s.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<SmsCode?> FindSmsCodeByPhoneAsync(string phoneNumber)
        {
            return await _smsCodes.Find(s => s.PhoneNumber == phoneNumber && !s.IsDeleted)
                .SortByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<SmsCode> VerifySmsCodeAsync(VerifySmsCodeDto dto)
        {
            var smsCode = await FindSmsCodeByPhoneAsync(dto.PhoneNumber);
            if (smsCode == null)
            {
                throw new InvalidOperationException("SMS code not found");
            }

            if (!smsCode.IsValid)
            {
                throw new InvalidOperationException("SMS code is not valid");
            }

            // Increment attempts
            var update = Builders<SmsCode>.Update
                .Inc(s => s.Attempts, 1)
                .Set(s => s.UpdatedAt, DateTime.UtcNow);

            await _smsCodes.UpdateOneAsync(s => s.Id == smsCode.Id, update);

            // Check if code matches
            if (smsCode.Code != dto.Code)
            {
                if (smsCode.Attempts + 1 >= smsCode.MaxAttempts)
                {
                    throw new InvalidOperationException("Maximum verification attempts exceeded");
                }
                throw new InvalidOperationException("Invalid SMS code");
            }

            // Mark as verified
            var verifyUpdate = Builders<SmsCode>.Update
                .Set(s => s.IsVerified, true)
                .Set(s => s.VerifiedAt, DateTime.UtcNow)
                .Set(s => s.UpdatedAt, DateTime.UtcNow);

            await _smsCodes.UpdateOneAsync(s => s.Id == smsCode.Id, verifyUpdate);

            return await FindSmsCodeByIdAsync(smsCode.Id) ?? throw new InvalidOperationException("SMS code not found after verification");
        }

        public async Task DeleteSmsCodeAsync(string id)
        {
            var smsCode = await FindSmsCodeByIdAsync(id);
            if (smsCode == null)
            {
                throw new InvalidOperationException("SMS code not found");
            }

            var update = Builders<SmsCode>.Update
                .Set(s => s.IsDeleted, true)
                .Set(s => s.DeletedAt, DateTime.UtcNow)
                .Set(s => s.UpdatedAt, DateTime.UtcNow);

            await _smsCodes.UpdateOneAsync(s => s.Id == id, update);
        }

        public async Task<bool> IsPhoneVerifiedAsync(string phoneNumber)
        {
            var smsCode = await FindSmsCodeByPhoneAsync(phoneNumber);
            return smsCode != null && smsCode.IsVerified;
        }

        private string GenerateSmsCode()
        {
            var bytes = new byte[2];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }
            var code = BitConverter.ToUInt16(bytes, 0) % 1000000;
            return code.ToString("D6");
        }

        private async Task SendSmsAsync(string phoneNumber, string code)
        {
            // In a real implementation, you would use Twilio or another SMS service
            // For now, we'll just log the SMS code
            Console.WriteLine($"SMS Code for {phoneNumber}: {code}");
            
            // Example Twilio implementation (commented out):
            /*
            var accountSid = _configuration["Twilio:AccountSid"];
            var authToken = _configuration["Twilio:AuthToken"];
            var fromNumber = _configuration["Twilio:FromNumber"];
            
            TwilioClient.Init(accountSid, authToken);
            
            var message = MessageResource.Create(
                body: $"Your verification code is: {code}",
                from: new PhoneNumber(fromNumber),
                to: new PhoneNumber(phoneNumber)
            );
            */
            
            await Task.CompletedTask;
        }
    }
}
