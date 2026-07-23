using OpsPilot.Api.Features.Orders;

namespace OpsPilot.Api.Infrastructure.Messaging;

public sealed class DemoOrderEventPublisher(
    ILogger<DemoOrderEventPublisher> logger)
    : IOrderEventPublisher
{
    public Task PublishAsync(
        OrderCreatedEvent message,
        CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Demo event {EventName} published for {OrderNumber}",
            "order.created",
            message.Number);

        return Task.CompletedTask;
    }
}
