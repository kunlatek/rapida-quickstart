using MongoDB.Driver;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.Models;

namespace RapidaQuickstart.DotNet.Services
{
    public interface ICleanupService
    {
        Task<int> RemoveTestUserAsync();
    }

    public class CleanupService : ICleanupService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<PersonProfile> _personProfiles;
        private readonly IMongoCollection<CompanyProfile> _companyProfiles;

        public CleanupService(IMongoDbService mongoDbService)
        {
            _users = mongoDbService.GetCollection<User>("users");
            _personProfiles = mongoDbService.GetCollection<PersonProfile>("person-profiles");
            _companyProfiles = mongoDbService.GetCollection<CompanyProfile>("company-profiles");
        }

        public async Task<int> RemoveTestUserAsync()
        {
            // Remove specific test user as in NestJS
            var testEmail = "zeninguem@email.com";
            
            // Find the user with the specified email
            var user = await _users.Find(u => u.Email == testEmail).FirstOrDefaultAsync();
            if (user == null)
            {
                return 0; // User not found
            }

            var userId = user.Id;

            // Delete all related person profiles
            var deletedPersonProfiles = await _personProfiles.DeleteManyAsync(p => p.UserId == userId);

            // Delete all related company profiles
            var deletedCompanyProfiles = await _companyProfiles.DeleteManyAsync(p => p.UserId == userId);

            // Delete the user
            var deletedUser = await _users.DeleteOneAsync(u => u.Id == userId);

            return (int)deletedUser.DeletedCount;
        }
    }
}