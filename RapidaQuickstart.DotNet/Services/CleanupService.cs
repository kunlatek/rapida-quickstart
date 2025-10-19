using MongoDB.Driver;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.Models;

namespace RapidaQuickstart.DotNet.Services
{
    public interface ICleanupService
    {
        Task<int> RemoveTestUsersAsync();
        Task<int> RemoveExpiredInvitationsAsync();
        Task<int> RemoveExpiredSmsCodesAsync();
        Task<int> RemoveOldLogsAsync(int daysOld = 30);
        Task<CleanupSummary> PerformFullCleanupAsync();
    }

    public class CleanupService : ICleanupService
    {
        private readonly IMongoCollection<TestUser> _testUsers;
        private readonly IMongoCollection<Invitation> _invitations;
        private readonly IMongoCollection<SmsCode> _smsCodes;
        private readonly IMongoCollection<User> _users;

        public CleanupService(IMongoDbService mongoDbService)
        {
            _testUsers = mongoDbService.GetCollection<TestUser>("test-users");
            _invitations = mongoDbService.GetCollection<Invitation>("invitations");
            _smsCodes = mongoDbService.GetCollection<SmsCode>("sms-codes");
            _users = mongoDbService.GetCollection<User>("users");
        }

        public async Task<int> RemoveTestUsersAsync()
        {
            // Remove test users (users with email containing "test" or "example")
            var filter = Builders<User>.Filter.Or(
                Builders<User>.Filter.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression("test", "i")),
                Builders<User>.Filter.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression("example", "i")),
                Builders<User>.Filter.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression("@test\\.", "i")),
                Builders<User>.Filter.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression("@example\\.", "i"))
            );

            var result = await _users.DeleteManyAsync(filter);
            return (int)result.DeletedCount;
        }

        public async Task<int> RemoveExpiredInvitationsAsync()
        {
            var now = DateTime.UtcNow;
            var filter = Builders<Invitation>.Filter.And(
                Builders<Invitation>.Filter.Lt(i => i.ExpiresAt, now),
                Builders<Invitation>.Filter.Eq(i => i.IsAccepted, false),
                Builders<Invitation>.Filter.Eq(i => i.IsDeleted, false)
            );

            var result = await _invitations.DeleteManyAsync(filter);
            return (int)result.DeletedCount;
        }

        public async Task<int> RemoveExpiredSmsCodesAsync()
        {
            var now = DateTime.UtcNow;
            var filter = Builders<SmsCode>.Filter.And(
                Builders<SmsCode>.Filter.Lt(s => s.ExpiresAt, now),
                Builders<SmsCode>.Filter.Eq(s => s.IsDeleted, false)
            );

            var result = await _smsCodes.DeleteManyAsync(filter);
            return (int)result.DeletedCount;
        }

        public async Task<int> RemoveOldLogsAsync(int daysOld = 30)
        {
            // This would typically work with a logging collection
            // For now, we'll return 0 as we don't have a specific logs collection
            await Task.CompletedTask;
            return 0;
        }

        public async Task<CleanupSummary> PerformFullCleanupAsync()
        {
            var summary = new CleanupSummary
            {
                Timestamp = DateTime.UtcNow
            };

            try
            {
                summary.TestUsersRemoved = await RemoveTestUsersAsync();
                summary.ExpiredInvitationsRemoved = await RemoveExpiredInvitationsAsync();
                summary.ExpiredSmsCodesRemoved = await RemoveExpiredSmsCodesAsync();
                summary.OldLogsRemoved = await RemoveOldLogsAsync();

                summary.TotalItemsRemoved = summary.TestUsersRemoved + 
                                         summary.ExpiredInvitationsRemoved + 
                                         summary.ExpiredSmsCodesRemoved + 
                                         summary.OldLogsRemoved;

                summary.Success = true;
            }
            catch (Exception ex)
            {
                summary.Success = false;
                summary.ErrorMessage = ex.Message;
            }

            return summary;
        }
    }

    public class CleanupSummary
    {
        public DateTime Timestamp { get; set; }
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int TestUsersRemoved { get; set; }
        public int ExpiredInvitationsRemoved { get; set; }
        public int ExpiredSmsCodesRemoved { get; set; }
        public int OldLogsRemoved { get; set; }
        public int TotalItemsRemoved { get; set; }
    }
}
