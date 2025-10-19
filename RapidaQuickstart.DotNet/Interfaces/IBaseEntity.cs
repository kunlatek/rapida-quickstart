namespace RapidaQuickstart.DotNet.Interfaces
{
    public interface IBaseEntity
    {
        string Id { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
        bool IsDeleted { get; set; }
        DateTime? DeletedAt { get; set; }
    }
}
