using Dapper;
using Npgsql;
using OpsPilot.Api.Domain;
using OpsPilot.Api.Features.Orders;

namespace OpsPilot.Api.Infrastructure.Persistence;

public sealed class PostgresOrderRepository(NpgsqlDataSource dataSource)
    : IOrderRepository
{
    public async Task<IReadOnlyCollection<SalesOrder>> ListAsync(
        CancellationToken cancellationToken)
    {
        const string sql = """
            select
                id,
                number,
                customer_name as CustomerName,
                product_sku as ProductSku,
                quantity,
                unit_price as UnitPrice,
                status,
                created_at as CreatedAt
            from sales_orders
            order by created_at desc
            limit 100;
            """;

        await using var connection =
            await dataSource.OpenConnectionAsync(cancellationToken);

        var command = new CommandDefinition(
            sql,
            cancellationToken: cancellationToken);

        var orders = await connection.QueryAsync<SalesOrder>(command);
        return orders.AsList();
    }

    public async Task<SalesOrder?> GetAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        const string sql = """
            select
                id,
                number,
                customer_name as CustomerName,
                product_sku as ProductSku,
                quantity,
                unit_price as UnitPrice,
                status,
                created_at as CreatedAt
            from sales_orders
            where id = @Id;
            """;

        await using var connection =
            await dataSource.OpenConnectionAsync(cancellationToken);

        return await connection.QuerySingleOrDefaultAsync<SalesOrder>(
            new CommandDefinition(
                sql,
                new { Id = id },
                cancellationToken: cancellationToken));
    }

    public async Task CreateAsync(
        SalesOrder order,
        CancellationToken cancellationToken)
    {
        const string sql = """
            insert into sales_orders (
                id,
                number,
                customer_name,
                product_sku,
                quantity,
                unit_price,
                status,
                created_at)
            values (
                @Id,
                @Number,
                @CustomerName,
                @ProductSku,
                @Quantity,
                @UnitPrice,
                @Status,
                @CreatedAt);
            """;

        await using var connection =
            await dataSource.OpenConnectionAsync(cancellationToken);

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                order,
                cancellationToken: cancellationToken));
    }
}
