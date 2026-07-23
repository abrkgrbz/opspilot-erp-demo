using OpsPilot.Api.Features.Inventory;
using StackExchange.Redis;

namespace OpsPilot.Api.Infrastructure.Caching;

public sealed class RedisInventoryCache : IInventoryCache, IAsyncDisposable
{
    private readonly Lazy<Task<ConnectionMultiplexer>> _connection;

    public RedisInventoryCache(IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("Redis") ?? "localhost:6379";

        _connection = new Lazy<Task<ConnectionMultiplexer>>(
            () => ConnectionMultiplexer.ConnectAsync(connectionString));
    }

    public async Task<int?> GetAsync(
        string sku,
        CancellationToken cancellationToken)
    {
        var database = (await _connection.Value).GetDatabase();
        var value = await database.StringGetAsync($"inventory:{sku}:available");

        return value.HasValue && int.TryParse(value.ToString(), out var available)
            ? available
            : null;
    }

    public async Task SetAsync(
        string sku,
        int available,
        TimeSpan lifetime,
        CancellationToken cancellationToken)
    {
        var database = (await _connection.Value).GetDatabase();
        await database.StringSetAsync(
            $"inventory:{sku}:available",
            available,
            lifetime);
    }

    public async ValueTask DisposeAsync()
    {
        if (_connection.IsValueCreated)
        {
            (await _connection.Value).Dispose();
        }
    }
}
