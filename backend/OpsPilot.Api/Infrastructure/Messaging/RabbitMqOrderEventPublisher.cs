using System.Text.Json;
using OpsPilot.Api.Features.Orders;
using RabbitMQ.Client;

namespace OpsPilot.Api.Infrastructure.Messaging;

public sealed class RabbitMqOrderEventPublisher(
    IConfiguration configuration,
    ILogger<RabbitMqOrderEventPublisher> logger)
    : IOrderEventPublisher
{
    private const string Exchange = "opspilot.events";

    public async Task PublishAsync(
        OrderCreatedEvent message,
        CancellationToken cancellationToken)
    {
        var factory = new ConnectionFactory
        {
            Uri = new Uri(
                configuration.GetConnectionString("RabbitMq")
                ?? "amqp://guest:guest@localhost:5672"),
            AutomaticRecoveryEnabled = true
        };

        await using var connection =
            await factory.CreateConnectionAsync("opspilot-api", cancellationToken);
        await using var channel =
            await connection.CreateChannelAsync(cancellationToken: cancellationToken);

        await channel.ExchangeDeclareAsync(
            exchange: Exchange,
            type: ExchangeType.Topic,
            durable: true,
            autoDelete: false,
            cancellationToken: cancellationToken);

        var body = JsonSerializer.SerializeToUtf8Bytes(message);

        await channel.BasicPublishAsync(
            exchange: Exchange,
            routingKey: "order.created",
            mandatory: false,
            body: body,
            cancellationToken: cancellationToken);

        logger.LogInformation(
            "Published order.created event for {OrderNumber}",
            message.Number);
    }
}
