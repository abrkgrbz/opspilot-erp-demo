using OpsPilot.Api.Domain;

namespace OpsPilot.Api.Features.Orders;

public sealed class OrderService(
    IOrderRepository repository,
    IOrderEventPublisher eventPublisher)
{
    public async Task<IReadOnlyCollection<OrderResponse>> ListAsync(
        CancellationToken cancellationToken)
    {
        var orders = await repository.ListAsync(cancellationToken);
        return orders.Select(OrderResponse.From).ToArray();
    }

    public async Task<OrderResponse?> GetAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        var order = await repository.GetAsync(id, cancellationToken);
        return order is null ? null : OrderResponse.From(order);
    }

    public async Task<OrderResponse> CreateAsync(
        CreateOrderRequest request,
        CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CustomerName);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ProductSku);

        if (request.Quantity <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(request.Quantity),
                "Quantity must be greater than zero.");
        }

        if (request.UnitPrice <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(request.UnitPrice),
                "Unit price must be greater than zero.");
        }

        var now = DateTimeOffset.UtcNow;
        var order = new SalesOrder(
            Guid.NewGuid(),
            $"SO-{now:yyMMdd}-{Random.Shared.Next(1000, 9999)}",
            request.CustomerName.Trim(),
            request.ProductSku.Trim().ToUpperInvariant(),
            request.Quantity,
            request.UnitPrice,
            "Processing",
            now);

        await repository.CreateAsync(order, cancellationToken);
        await eventPublisher.PublishAsync(
            new OrderCreatedEvent(
                order.Id,
                order.Number,
                order.CustomerName,
                order.Total,
                now),
            cancellationToken);

        return OrderResponse.From(order);
    }
}

public interface IOrderRepository
{
    Task<IReadOnlyCollection<SalesOrder>> ListAsync(
        CancellationToken cancellationToken);

    Task<SalesOrder?> GetAsync(Guid id, CancellationToken cancellationToken);

    Task CreateAsync(SalesOrder order, CancellationToken cancellationToken);
}

public interface IOrderEventPublisher
{
    Task PublishAsync(
        OrderCreatedEvent message,
        CancellationToken cancellationToken);
}
