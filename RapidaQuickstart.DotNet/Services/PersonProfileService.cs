using MongoDB.Driver;
using MongoDB.Bson;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Models;

namespace RapidaQuickstart.DotNet.Services
{
    public interface IPersonProfileService
    {
        Task<PersonProfile> CreateProfileAsync(CreatePersonProfileDto dto);
        Task<(List<PersonProfile> data, int total)> FindAllAsync(PersonProfileFilterDto filterDto);
        Task<PersonProfile?> FindProfileByIdAsync(string id);
        Task<PersonProfile?> FindProfileByUserIdAsync(string userId);
        Task<PersonProfile> UpdateProfileAsync(string id, UpdatePersonProfileDto dto, string userId);
        Task DeleteProfileAsync(string id, string userId);
    }

    public class PersonProfileService : IPersonProfileService
    {
        private readonly IMongoCollection<PersonProfile> _profiles;

        public PersonProfileService(IMongoDbService mongoDbService)
        {
            _profiles = mongoDbService.GetCollection<PersonProfile>("person-profiles");
        }

        public async Task<PersonProfile> CreateProfileAsync(CreatePersonProfileDto dto)
        {
            var profile = new PersonProfile
            {
                UserId = dto.UserId,
                PersonName = dto.PersonName,
                PersonNickname = dto.PersonNickname,
                Gender = dto.Gender,
                Birthday = dto.Birthday,
                MaritalStatus = dto.MaritalStatus,
                MotherName = dto.MotherName,
                FatherName = dto.FatherName,
                TagId = dto.TagId,
                PersonDescription = dto.PersonDescription,
                Cpf = dto.Cpf,
                CpfFile = dto.CpfFile,
                Rg = dto.Rg,
                RgIssuingAuthority = dto.RgIssuingAuthority,
                RgIssuanceDate = dto.RgIssuanceDate,
                RgState = dto.RgState,
                RgFile = dto.RgFile,
                Passport = dto.Passport,
                PassportIssuanceDate = dto.PassportIssuanceDate,
                PassportExpirationDate = dto.PassportExpirationDate,
                PassportFile = dto.PassportFile,
                PhoneNumberOne = dto.PhoneNumberOne,
                PhoneNumberTwo = dto.PhoneNumberTwo,
                EmailOne = dto.EmailOne,
                EmailTwo = dto.EmailTwo,
                Linkedin = dto.Linkedin,
                Instagram = dto.Instagram,
                Facebook = dto.Facebook,
                X = dto.X,
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
                PersonJobs = dto.PersonJobs?.Select(j => new PersonJob
                {
                    CompanyName = j.CompanyName,
                    Position = j.Position,
                    StartDate = j.StartDate,
                    EndDate = j.EndDate,
                    IsCurrentJob = j.IsCurrentJob,
                    Description = j.Description
                }).ToList() ?? new(),
                PersonEducations = dto.PersonEducations?.Select(e => new PersonEducation
                {
                    InstitutionName = e.InstitutionName,
                    CourseName = e.CourseName,
                    EducationLevel = e.EducationLevel,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCompleted = e.IsCompleted,
                    Description = e.Description
                }).ToList() ?? new(),
                PersonCourses = dto.PersonCourses?.Select(c => new PersonCourse
                {
                    CourseName = c.CourseName,
                    InstitutionName = c.InstitutionName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    IsCompleted = c.IsCompleted,
                    Description = c.Description
                }).ToList() ?? new(),
                PersonLanguages = dto.PersonLanguages ?? new(),
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
                RelatedFiles = dto.RelatedFiles?.Select(f => new RelatedFile
                {
                    FileName = f.FileName,
                    FileUrl = f.FileUrl,
                    FileType = f.FileType,
                    FileSize = f.FileSize,
                    UploadDate = f.UploadDate,
                    Description = f.Description,
                    RelatedFilesDateYear = f.RelatedFilesDateYear
                }).ToList() ?? new(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _profiles.InsertOneAsync(profile);
            return profile;
        }

        public async Task<(List<PersonProfile> data, int total)> FindAllAsync(PersonProfileFilterDto filterDto)
        {
            var filter = Builders<PersonProfile>.Filter.Eq(p => p.IsDeleted, false);

            // Apply search filter
            if (!string.IsNullOrEmpty(filterDto.Search))
            {
                var searchFilter = Builders<PersonProfile>.Filter.Or(
                    Builders<PersonProfile>.Filter.Regex(p => p.PersonName, new BsonRegularExpression(filterDto.Search, "i")),
                    Builders<PersonProfile>.Filter.Regex(p => p.PersonDescription, new BsonRegularExpression(filterDto.Search, "i"))
                );
                filter = Builders<PersonProfile>.Filter.And(filter, searchFilter);
            }

            // Apply gender filter
            if (filterDto.Gender.HasValue)
            {
                filter = Builders<PersonProfile>.Filter.And(filter, Builders<PersonProfile>.Filter.Eq(p => p.Gender, filterDto.Gender.Value));
            }

            // Apply marital status filter
            if (filterDto.MaritalStatus.HasValue)
            {
                filter = Builders<PersonProfile>.Filter.And(filter, Builders<PersonProfile>.Filter.Eq(p => p.MaritalStatus, filterDto.MaritalStatus.Value));
            }

            // Apply tag filter
            if (filterDto.TagIds != null && filterDto.TagIds.Any())
            {
                filter = Builders<PersonProfile>.Filter.And(filter, Builders<PersonProfile>.Filter.AnyIn(p => p.TagId, filterDto.TagIds));
            }

            // Build sort
            var sort = filterDto.SortDirection == "desc" 
                ? Builders<PersonProfile>.Sort.Descending(filterDto.SortBy)
                : Builders<PersonProfile>.Sort.Ascending(filterDto.SortBy);

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

        public async Task<PersonProfile?> FindProfileByIdAsync(string id)
        {
            return await _profiles.Find(p => p.Id == id && !p.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<PersonProfile?> FindProfileByUserIdAsync(string userId)
        {
            return await _profiles.Find(p => p.UserId == userId && !p.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<PersonProfile> UpdateProfileAsync(string id, UpdatePersonProfileDto dto, string userId)
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
            var update = Builders<PersonProfile>.Update
                .Set(p => p.PersonName, dto.PersonName)
                .Set(p => p.PersonNickname, dto.PersonNickname)
                .Set(p => p.Gender, dto.Gender)
                .Set(p => p.Birthday, dto.Birthday)
                .Set(p => p.MaritalStatus, dto.MaritalStatus)
                .Set(p => p.MotherName, dto.MotherName)
                .Set(p => p.FatherName, dto.FatherName)
                .Set(p => p.TagId, dto.TagId)
                .Set(p => p.PersonDescription, dto.PersonDescription)
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

            var update = Builders<PersonProfile>.Update
                .Set(p => p.IsDeleted, true)
                .Set(p => p.DeletedAt, DateTime.UtcNow)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _profiles.UpdateOneAsync(p => p.Id == id, update);
        }
    }
}
