using System.Collections.Concurrent;
using OpsPilot.Api.Features.Inventory;

namespace OpsPilot.Api.Infrastructure.Caching;

public sealed class DemoInventoryCache : IInventoryCache
{
    private readonly ConcurrentDictionary<string, int> _stock =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["CHR-OAK-01"] = 8,
            ["TBL-WAL-04"] = 3,
            ["LMP-BRS-12"] = 11,
            ["DSK-WHT-08"] = 26
        };

    public Task<int?> GetAsync(
        string sku,
        CancellationToken cancellationToken)
    {
        var found = _stock.TryGetValue(sku, out var available);
        return Task.FromResult<int?>(found ? available : null);
    }

    public Task SetAsync(
        string sku,
        int available,
        TimeSpan lifetime,
        CancellationToken cancellationToken)
    {
        _stock[sku] = available;
        return Task.CompletedTask;
    }
}
