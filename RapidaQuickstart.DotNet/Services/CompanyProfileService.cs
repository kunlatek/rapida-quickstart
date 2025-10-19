using MongoDB.Driver;
using MongoDB.Bson;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Models;

namespace RapidaQuickstart.DotNet.Services
{
    public interface ICompanyProfileService
    {
        Task<CompanyProfile> CreateProfileAsync(CreateCompanyProfileDto dto);
        Task<(List<CompanyProfile> data, int total)> FindAllAsync(CompanyProfileFilterDto filterDto);
        Task<CompanyProfile?> FindProfileByIdAsync(string id);
        Task<CompanyProfile?> FindProfileByUserIdAsync(string userId);
        Task<CompanyProfile> UpdateProfileAsync(string id, UpdateCompanyProfileDto dto, string userId);
        Task DeleteProfileAsync(string id, string userId);
    }

    public class CompanyProfileService : ICompanyProfileService
    {
        private readonly IMongoCollection<CompanyProfile> _profiles;

        public CompanyProfileService(IMongoDbService mongoDbService)
        {
            _profiles = mongoDbService.GetCollection<CompanyProfile>("company-profiles");
        }

        public async Task<CompanyProfile> CreateProfileAsync(CreateCompanyProfileDto dto)
        {
            var profile = new CompanyProfile
            {
                UserId = dto.UserId,
                Cnpj = dto.Cnpj,
                CompanyName = dto.CompanyName,
                BusinessName = dto.BusinessName,
                Birthday = dto.Birthday,
                LegalNature = dto.LegalNature,
                CompanyDescription = dto.CompanyDescription,
                LogoImage = dto.LogoImage,
                CompanyImages = dto.CompanyImages ?? new(),
                TagId = dto.TagId,
                Partners = dto.Partners?.Select(p => new Partner
                {
                    PartnerName = p.PartnerName,
                    PartnerDocument = p.PartnerDocument,
                    PartnerEmail = p.PartnerEmail,
                    PartnerPhone = p.PartnerPhone,
                    ParticipationPercentage = p.ParticipationPercentage,
                    IsMainPartner = p.IsMainPartner
                }).ToList() ?? new(),
                Contacts = dto.Contacts?.Select(c => new Contact
                {
                    ContactType = c.ContactType,
                    ContactValue = c.ContactValue,
                    IsPrimary = c.IsPrimary,
                    Description = c.Description
                }).ToList() ?? new(),
                AddressOneCepBrasilApi = dto.AddressOneCepBrasilApi,
                AddressOneType = dto.AddressOneType,
                AddressOneStreet = dto.AddressOneStreet,
                AddressOneNumber = dto.AddressOneNumber,
                AddressOneComplement = dto.AddressOneComplement,
                AddressOneCity = dto.AddressOneCity,
                AddressOneState = dto.AddressOneState,
                AddressTwoCepBrasilApi = dto.AddressTwoCepBrasilApi,
                AddressTwoType = dto.AddressTwoType,
                AddressTwoStreet = dto.AddressTwoStreet,
                AddressTwoNumber = dto.AddressTwoNumber,
                AddressTwoComplement = dto.AddressTwoComplement,
                AddressTwoCity = dto.AddressTwoCity,
                AddressTwoState = dto.AddressTwoState,
                BankDataOne = dto.BankDataOne != null ? new BankData
                {
                    BankName = dto.BankDataOne.BankName,
                    BankCode = dto.BankDataOne.BankCode,
                    AgencyNumber = dto.BankDataOne.AgencyNumber,
                    AccountNumber = dto.BankDataOne.AccountNumber,
                    AccountType = dto.BankDataOne.AccountType,
                    AccountHolderName = dto.BankDataOne.AccountHolderName,
                    AccountHolderDocument = dto.BankDataOne.AccountHolderDocument
                } : null,
                BankDataTwo = dto.BankDataTwo != null ? new BankData
                {
                    BankName = dto.BankDataTwo.BankName,
                    BankCode = dto.BankDataTwo.BankCode,
                    AgencyNumber = dto.BankDataTwo.AgencyNumber,
                    AccountNumber = dto.BankDataTwo.AccountNumber,
                    AccountType = dto.BankDataTwo.AccountType,
                    AccountHolderName = dto.BankDataTwo.AccountHolderName,
                    AccountHolderDocument = dto.BankDataTwo.AccountHolderDocument
                } : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _profiles.InsertOneAsync(profile);
            return profile;
        }

        public async Task<(List<CompanyProfile> data, int total)> FindAllAsync(CompanyProfileFilterDto filterDto)
        {
            var filter = Builders<CompanyProfile>.Filter.Eq(p => p.IsDeleted, false);

            // Apply search filter
            if (!string.IsNullOrEmpty(filterDto.Search))
            {
                var searchFilter = Builders<CompanyProfile>.Filter.Or(
                    Builders<CompanyProfile>.Filter.Regex(p => p.CompanyName, new BsonRegularExpression(filterDto.Search, "i")),
                    Builders<CompanyProfile>.Filter.Regex(p => p.BusinessName, new BsonRegularExpression(filterDto.Search, "i")),
                    Builders<CompanyProfile>.Filter.Regex(p => p.CompanyDescription, new BsonRegularExpression(filterDto.Search, "i"))
                );
                filter = Builders<CompanyProfile>.Filter.And(filter, searchFilter);
            }

            // Apply legal nature filter
            if (!string.IsNullOrEmpty(filterDto.LegalNature))
            {
                filter = Builders<CompanyProfile>.Filter.And(filter, Builders<CompanyProfile>.Filter.Eq(p => p.LegalNature, filterDto.LegalNature));
            }

            // Apply tag filter
            if (filterDto.TagIds != null && filterDto.TagIds.Any())
            {
                filter = Builders<CompanyProfile>.Filter.And(filter, Builders<CompanyProfile>.Filter.AnyIn(p => p.TagId, filterDto.TagIds));
            }

            // Build sort
            var sort = filterDto.SortDirection == "desc" 
                ? Builders<CompanyProfile>.Sort.Descending(filterDto.SortBy)
                : Builders<CompanyProfile>.Sort.Ascending(filterDto.SortBy);

            // Get total count
            var total = await _profiles.CountDocumentsAsync(filter);

            // Get paginated data
            var skip = (filterDto.Page - 1) * filterDto.Limit;
            var data = await _profiles.Find(filter)
                .Sort(sort)
                .Skip(skip)
                .Limit(filterDto.Limit)
                .ToListAsync();

            return (data, (int)total);
        }

        public async Task<CompanyProfile?> FindProfileByIdAsync(string id)
        {
            return await _profiles.Find(p => p.Id == id && !p.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<CompanyProfile?> FindProfileByUserIdAsync(string userId)
        {
            return await _profiles.Find(p => p.UserId == userId && !p.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<CompanyProfile> UpdateProfileAsync(string id, UpdateCompanyProfileDto dto, string userId)
        {
            var existingProfile = await FindProfileByIdAsync(id);
            if (existingProfile == null)
            {
                throw new InvalidOperationException("Profile not found");
            }

            if (existingProfile.UserId != userId)
            {
                throw new UnauthorizedAccessException("You can only update your own profile");
            }

            // Update fields
            var update = Builders<CompanyProfile>.Update
                .Set(p => p.Cnpj, dto.Cnpj)
                .Set(p => p.CompanyName, dto.CompanyName)
                .Set(p => p.BusinessName, dto.BusinessName)
                .Set(p => p.Birthday, dto.Birthday)
                .Set(p => p.LegalNature, dto.LegalNature)
                .Set(p => p.CompanyDescription, dto.CompanyDescription)
                .Set(p => p.LogoImage, dto.LogoImage)
                .Set(p => p.CompanyImages, dto.CompanyImages ?? new())
                .Set(p => p.TagId, dto.TagId)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            // Update other fields as needed...
            await _profiles.UpdateOneAsync(p => p.Id == id, update);

            return await FindProfileByIdAsync(id) ?? throw new InvalidOperationException("Profile not found after update");
        }

        public async Task DeleteProfileAsync(string id, string userId)
        {
            var profile = await FindProfileByIdAsync(id);
            if (profile == null)
            {
                throw new InvalidOperationException("Profile not found");
            }

            if (profile.UserId != userId)
            {
                throw new UnauthorizedAccessException("You can only delete your own profile");
            }

            var update = Builders<CompanyProfile>.Update
                .Set(p => p.IsDeleted, true)
                .Set(p => p.DeletedAt, DateTime.UtcNow)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _profiles.UpdateOneAsync(p => p.Id == id, update);
        }
    }
}
