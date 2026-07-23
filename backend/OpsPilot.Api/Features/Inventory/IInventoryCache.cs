namespace OpsPilot.Api.Features.Inventory;

public interface IInventoryCache
{
    Task<int?> GetAsync(string sku, CancellationToken cancellationToken);

    Task SetAsync(
        string sku,
        int available,
        TimeSpan lifetime,
        CancellationToken cancellationToken);
}
