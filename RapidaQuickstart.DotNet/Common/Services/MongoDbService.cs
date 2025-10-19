using MongoDB.Driver;

namespace RapidaQuickstart.DotNet.Common.Services
{
    public interface IMongoDbService
    {
        IMongoDatabase Database { get; }
        IMongoCollection<T> GetCollection<T>(string collectionName);
    }

    public class MongoDbService : IMongoDbService
    {
        public IMongoDatabase Database { get; }

        public MongoDbService(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDB") 
                ?? throw new ArgumentNullException("MongoDB connection string not found");
            
            var client = new MongoClient(connectionString);
            Database = client.GetDatabase("rapida_quickstart");
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return Database.GetCollection<T>(collectionName);
        }
    }
}
