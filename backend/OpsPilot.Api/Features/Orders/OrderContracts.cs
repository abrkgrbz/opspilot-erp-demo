using OpsPilot.Api.Domain;

namespace OpsPilot.Api.Features.Orders;

public sealed record CreateOrderRequest(
    string CustomerName,
    string ProductSku,
    int Quantity,
    decimal UnitPrice,
    string Channel = "B2B Portal");

public sealed record OrderResponse(
    Guid Id,
    string Number,
    string CustomerName,
    string ProductSku,
    int Quantity,
    decimal UnitPrice,
    decimal Total,
    string Status,
    DateTimeOffset CreatedAt)
{
    public static OrderResponse From(SalesOrder order) =>
        new(
            order.Id,
            order.Number,
            order.CustomerName,
            order.ProductSku,
            order.Quantity,
            order.UnitPrice,
            order.Total,
            order.Status,
            order.CreatedAt);
}

public sealed record OrderCreatedEvent(
    Guid OrderId,
    string Number,
    string CustomerName,
    decimal Total,
    DateTimeOffset OccurredAt);
