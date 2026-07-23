# OpsPilot — ERP Operations Demo

OpsPilot is a portfolio-ready order and inventory management demo for growing
B2B businesses. It combines a polished interactive dashboard with a reference
ASP.NET Core backend that demonstrates the architecture behind a production
business application.

## What the demo shows

- Operations dashboard with revenue, order pipeline and stock alerts
- Searchable sales order list
- Interactive order creation workflow
- Inventory availability and reorder monitoring
- Architecture view explaining the application design
- Responsive desktop and mobile layouts

## Technology

### Live dashboard

- Next.js and TypeScript
- Responsive CSS design system
- Cloudflare Workers-compatible vinext build

### Reference backend

- ASP.NET Core 9 minimal APIs
- PostgreSQL with Dapper
- Redis inventory caching
- RabbitMQ integration events
- Demo-mode adapters for running without external infrastructure
- Docker Compose environment for the complete stack

## Architecture

The backend uses feature-focused application services and explicit
infrastructure boundaries:

```text
Next.js dashboard
       │ REST
ASP.NET Core API
       ├── PostgreSQL + Dapper
       ├── Redis cache
       └── RabbitMQ events
```

The API runs in safe in-memory demo mode by default. Set
`UseInfrastructure=true` or start the Docker Compose stack to use PostgreSQL,
Redis and RabbitMQ.

## Run the dashboard

```bash
npm install
npm run dev
```

## Run the API in demo mode

```bash
dotnet run --project backend/OpsPilot.Api
```

The API exposes:

- `GET /health`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `GET /api/inventory/{sku}/stock`
- `GET /openapi/v1.json` in development

## Run the complete infrastructure

```bash
docker compose up --build
```

- API: `http://localhost:8080`
- RabbitMQ management: `http://localhost:15672`

## Portfolio context

This demo was designed to show how complex ERP workflows can be presented as a
clear, maintainable product. The sample data is fictional.
