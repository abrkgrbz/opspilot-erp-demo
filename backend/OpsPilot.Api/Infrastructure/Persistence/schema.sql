create table if not exists sales_orders (
    id uuid primary key,
    number varchar(32) not null unique,
    customer_name varchar(160) not null,
    product_sku varchar(64) not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(18, 2) not null check (unit_price > 0),
    status varchar(32) not null,
    created_at timestamptz not null
);

create index if not exists ix_sales_orders_created_at
    on sales_orders (created_at desc);
