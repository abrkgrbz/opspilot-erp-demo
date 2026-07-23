namespace OpsPilot.Api.Domain;

public sealed record SalesOrder(
    Guid Id,
    string Number,
    string CustomerName,
    string ProductSku,
    int Quantity,
    decimal UnitPrice,
    string Status,
    DateTimeOffset CreatedAt)
{
    public decimal Total => Quantity * UnitPrice;
}
