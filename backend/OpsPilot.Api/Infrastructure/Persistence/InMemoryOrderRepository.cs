using OpsPilot.Api.Domain;
using OpsPilot.Api.Features.Orders;

namespace OpsPilot.Api.Infrastructure.Persistence;

public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly List<SalesOrder> _orders =
    [
        Seed(
            "SO-1048",
            "Northwind Atelier",
            "CHR-OAK-01",
            8,
            535m,
            "Processing",
            10),
        Seed(
            "SO-1047",
            "Horizon Office",
            "DSK-WHT-08",
            3,
            620m,
            "Ready",
            32),
        Seed(
            "SO-1046",
            "Aster & Co.",
            "TBL-WAL-04",
            6,
            1120m,
            "Shipped",
            68),
    ];

    public Task<IReadOnlyCollection<SalesOrder>> ListAsync(
        CancellationToken cancellationToken)
    {
        lock (_orders)
        {
            return Task.FromResult<IReadOnlyCollection<SalesOrder>>(
                _orders.OrderByDescending(order => order.CreatedAt).ToArray());
        }
    }

    public Task<SalesOrder?> GetAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        lock (_orders)
        {
            return Task.FromResult(_orders.SingleOrDefault(order => order.Id == id));
        }
    }

    public Task CreateAsync(
        SalesOrder order,
        CancellationToken cancellationToken)
    {
        lock (_orders)
        {
            _orders.Add(order);
        }

        return Task.CompletedTask;
    }

    private static SalesOrder Seed(
        string number,
        string customer,
        string sku,
        int quantity,
        decimal unitPrice,
        string status,
        int minutesAgo) =>
        new(
            Guid.NewGuid(),
            number,
            customer,
            sku,
            quantity,
            unitPrice,
            status,
            DateTimeOffset.UtcNow.AddMinutes(-minutesAgo));
}
