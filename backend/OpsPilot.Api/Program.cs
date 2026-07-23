using Npgsql;
using OpsPilot.Api.Features.Inventory;
using OpsPilot.Api.Features.Orders;
using OpsPilot.Api.Infrastructure.Caching;
using OpsPilot.Api.Infrastructure.Messaging;
using OpsPilot.Api.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var useInfrastructure = builder.Configuration.GetValue<bool>("UseInfrastructure");

if (useInfrastructure)
{
    builder.Services.AddSingleton(sp =>
    {
        var connectionString = sp.GetRequiredService<IConfiguration>()
            .GetConnectionString("PostgreSql")
            ?? throw new InvalidOperationException("PostgreSql connection string is missing.");

        return NpgsqlDataSource.Create(connectionString);
    });
    builder.Services.AddScoped<IOrderRepository, PostgresOrderRepository>();
    builder.Services.AddSingleton<IOrderEventPublisher, RabbitMqOrderEventPublisher>();
    builder.Services.AddSingleton<IInventoryCache, RedisInventoryCache>();
}
else
{
    builder.Services.AddSingleton<IOrderRepository, InMemoryOrderRepository>();
    builder.Services.AddSingleton<IOrderEventPublisher, DemoOrderEventPublisher>();
    builder.Services.AddSingleton<IInventoryCache, DemoInventoryCache>();
}

builder.Services.AddScoped<OrderService>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => Results.Ok(new
{
    service = "OpsPilot API",
    version = "1.0",
    mode = useInfrastructure ? "infrastructure" : "demo",
    docs = "/openapi/v1.json"
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    utc = DateTimeOffset.UtcNow,
    dependencies = useInfrastructure
        ? new[] { "PostgreSQL", "Redis", "RabbitMQ" }
        : new[] { "In-memory demo services" }
}));

var orders = app.MapGroup("/api/orders").WithTags("Orders");

orders.MapGet("/", async (OrderService service, CancellationToken cancellationToken) =>
    Results.Ok(await service.ListAsync(cancellationToken)));

orders.MapGet("/{id:guid}", async (
    Guid id,
    OrderService service,
    CancellationToken cancellationToken) =>
{
    var order = await service.GetAsync(id, cancellationToken);
    return order is null ? Results.NotFound() : Results.Ok(order);
});

orders.MapPost("/", async (
    CreateOrderRequest request,
    OrderService service,
    CancellationToken cancellationToken) =>
{
    var result = await service.CreateAsync(request, cancellationToken);
    return Results.Created($"/api/orders/{result.Id}", result);
});

var inventory = app.MapGroup("/api/inventory").WithTags("Inventory");

inventory.MapGet("/{sku}/stock", async (
    string sku,
    IInventoryCache cache,
    CancellationToken cancellationToken) =>
{
    var stock = await cache.GetAsync(sku, cancellationToken);
    return stock is null
        ? Results.NotFound(new { message = $"Stock for '{sku}' was not found." })
        : Results.Ok(new { sku, available = stock });
});

app.Run();

public partial class Program;
