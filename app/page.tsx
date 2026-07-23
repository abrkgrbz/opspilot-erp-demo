"use client";

import { useMemo, useState } from "react";

type View = "overview" | "orders" | "inventory" | "architecture";

type Order = {
  id: string;
  customer: string;
  initials: string;
  total: number;
  status: "Processing" | "Ready" | "Shipped";
  channel: "B2B Portal" | "Sales Team" | "Marketplace";
  time: string;
};

const initialOrders: Order[] = [
  {
    id: "SO-1048",
    customer: "Northwind Atelier",
    initials: "NA",
    total: 4280,
    status: "Processing",
    channel: "B2B Portal",
    time: "10 min ago",
  },
  {
    id: "SO-1047",
    customer: "Horizon Office",
    initials: "HO",
    total: 1860,
    status: "Ready",
    channel: "Sales Team",
    time: "32 min ago",
  },
  {
    id: "SO-1046",
    customer: "Aster & Co.",
    initials: "AC",
    total: 6720,
    status: "Shipped",
    channel: "Marketplace",
    time: "1 hr ago",
  },
  {
    id: "SO-1045",
    customer: "Mira Living",
    initials: "ML",
    total: 2940,
    status: "Processing",
    channel: "B2B Portal",
    time: "2 hrs ago",
  },
];

const inventory = [
  { sku: "CHR-OAK-01", product: "Oak Dining Chair", stock: 8, reorder: 20 },
  { sku: "TBL-WAL-04", product: "Walnut Meeting Table", stock: 3, reorder: 8 },
  { sku: "LMP-BRS-12", product: "Brass Floor Lamp", stock: 11, reorder: 15 },
  { sku: "DSK-WHT-08", product: "Studio Work Desk", stock: 26, reorder: 18 },
  { sku: "SHF-BLK-02", product: "Modular Display Shelf", stock: 34, reorder: 20 },
];

const navItems: Array<{ id: View; label: string; icon: string }> = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "inventory", label: "Inventory", icon: "□" },
  { id: "architecture", label: "Architecture", icon: "⌘" },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Home() {
  const [activeView, setActiveView] = useState<View>("overview");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query),
    );
  }, [orders, search]);

  function createOrder() {
    const next: Order = {
      id: `SO-${1045 + orders.length}`,
      customer: "Atlas Workspace",
      initials: "AW",
      total: 3480,
      status: "Processing",
      channel: "B2B Portal",
      time: "just now",
    };
    setOrders((current) => [next, ...current]);
    setShowOrderForm(false);
    setActiveView("orders");
    setNotice(`${next.id} created and inventory reservation queued.`);
    window.setTimeout(() => setNotice(""), 4200);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">O</span>
          <div>
            <strong>OpsPilot</strong>
            <small>Business OS</small>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <p className="nav-caption">Workspace</p>
          {navItems.map((item) => (
            <button
              className={activeView === item.id ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => setActiveView(item.id)}
              type="button"
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "inventory" && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>

        <div className="system-card">
          <div className="system-card-head">
            <span className="pulse-dot" />
            <span>All systems operational</span>
          </div>
          <div className="system-row">
            <span>API latency</span>
            <strong>42 ms</strong>
          </div>
          <div className="system-row">
            <span>Queue depth</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="profile-chip">
          <span className="avatar">AG</span>
          <div>
            <strong>Anil G.</strong>
            <small>Administrator</small>
          </div>
          <span className="chevron">⌄</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">OPERATIONS / LIVE DEMO</p>
            <h1>{navItems.find((item) => item.id === activeView)?.label}</h1>
          </div>
          <div className="top-actions">
            <label className="search-field">
              <span>⌕</span>
              <input
                aria-label="Search orders or customers"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders, customers…"
                value={search}
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="primary-button"
              onClick={() => setShowOrderForm(true)}
              type="button"
            >
              <span>＋</span> New order
            </button>
          </div>
        </header>

        {activeView === "overview" && (
          <Overview
            orders={filteredOrders}
            onInventoryClick={() => setActiveView("inventory")}
            onOrdersClick={() => setActiveView("orders")}
          />
        )}
        {activeView === "orders" && <Orders orders={filteredOrders} />}
        {activeView === "inventory" && <Inventory />}
        {activeView === "architecture" && <Architecture />}

        <footer className="demo-footer">
          <span>OpsPilot portfolio demo</span>
          <span>ASP.NET Core · PostgreSQL · Dapper · Redis · RabbitMQ · Next.js</span>
        </footer>
      </section>

      {showOrderForm && (
        <div
          aria-label="Create new order"
          aria-modal="true"
          className="modal-backdrop"
          role="dialog"
        >
          <div className="order-modal">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">NEW SALES ORDER</p>
                <h2>Create order</h2>
              </div>
              <button
                aria-label="Close order form"
                className="close-button"
                onClick={() => setShowOrderForm(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <label>
                Customer
                <select defaultValue="Atlas Workspace">
                  <option>Atlas Workspace</option>
                  <option>Northwind Atelier</option>
                  <option>Mira Living</option>
                </select>
              </label>
              <label>
                Sales channel
                <select defaultValue="B2B Portal">
                  <option>B2B Portal</option>
                  <option>Sales Team</option>
                  <option>Marketplace</option>
                </select>
              </label>
              <label className="wide-field">
                Product
                <select defaultValue="Studio Work Desk">
                  <option>Studio Work Desk</option>
                  <option>Oak Dining Chair</option>
                  <option>Walnut Meeting Table</option>
                </select>
              </label>
              <label>
                Quantity
                <input defaultValue="4" min="1" type="number" />
              </label>
              <label>
                Unit price
                <input defaultValue="$870" />
              </label>
            </div>

            <div className="order-summary">
              <span>Order total</span>
              <strong>$3,480</strong>
            </div>
            <p className="modal-note">
              Creating this order reserves stock and publishes an
              <code> order.created</code> event to RabbitMQ.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowOrderForm(false)}
                type="button"
              >
                Cancel
              </button>
              <button className="primary-button" onClick={createOrder} type="button">
                Create order
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

function Overview({
  orders,
  onOrdersClick,
  onInventoryClick,
}: {
  orders: Order[];
  onOrdersClick: () => void;
  onInventoryClick: () => void;
}) {
  return (
    <div className="content-stack">
      <section className="intro-row">
        <div>
          <h2>Good afternoon, Anil.</h2>
          <p>Here is what is happening across your operations today.</p>
        </div>
        <div className="sync-pill">
          <span className="pulse-dot" /> Live data
          <small>Updated now</small>
        </div>
      </section>

      <section className="metric-grid" aria-label="Key business metrics">
        <Metric
          accent="violet"
          change="+12.4%"
          detail="vs. last month"
          label="Net revenue"
          value="$84,260"
        />
        <Metric
          accent="blue"
          change="+8.2%"
          detail="18 need attention"
          label="Open orders"
          value="128"
        />
        <Metric
          accent="green"
          change="96.8%"
          detail="on-time this month"
          label="Fulfilment rate"
          value="94.2%"
        />
        <Metric
          accent="amber"
          change="3 items"
          detail="below safety stock"
          label="Low stock"
          value="03"
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel revenue-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">REVENUE PERFORMANCE</p>
              <h3>$84,260</h3>
              <span className="positive">↑ 12.4%</span>
            </div>
            <select aria-label="Revenue period" defaultValue="6 months">
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <div className="chart-wrap" aria-label="Monthly revenue bar chart">
            <div className="chart-gridline line-one" />
            <div className="chart-gridline line-two" />
            {[
              ["Feb", 36],
              ["Mar", 48],
              ["Apr", 44],
              ["May", 66],
              ["Jun", 61],
              ["Jul", 84],
            ].map(([label, value], index) => (
              <div className="bar-column" key={label}>
                <div
                  className={index === 5 ? "chart-bar highlighted" : "chart-bar"}
                  style={{ height: `${value}%` }}
                >
                  {index === 5 && <span>$84k</span>}
                </div>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel fulfilment-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">ORDER PIPELINE</p>
              <h3>Today&apos;s flow</h3>
            </div>
            <button className="text-button" onClick={onOrdersClick} type="button">
              View orders ↗
            </button>
          </div>
          <div className="pipeline">
            <PipelineItem color="violet" label="New" value="24" width="82%" />
            <PipelineItem color="blue" label="Processing" value="18" width="65%" />
            <PipelineItem color="amber" label="Ready" value="11" width="44%" />
            <PipelineItem color="green" label="Shipped" value="36" width="94%" />
          </div>
          <div className="automation-callout">
            <span className="automation-icon">↻</span>
            <div>
              <strong>Automation healthy</strong>
              <p>89 events processed with no retries today.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid lower-grid">
        <RecentOrders orders={orders.slice(0, 4)} onViewAll={onOrdersClick} />
        <LowStock onViewAll={onInventoryClick} />
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  change,
  detail,
  accent,
}: {
  label: string;
  value: string;
  change: string;
  detail: string;
  accent: string;
}) {
  return (
    <article className={`metric-card ${accent}`}>
      <div className="metric-top">
        <span>{label}</span>
        <button aria-label={`More options for ${label}`} type="button">
          ···
        </button>
      </div>
      <strong>{value}</strong>
      <div className="metric-detail">
        <span>{change}</span>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function PipelineItem({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div className="pipeline-row">
      <span>{label}</span>
      <div className="pipeline-track">
        <i className={color} style={{ width }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function Status({ value }: { value: Order["status"] }) {
  return <span className={`status status-${value.toLowerCase()}`}>{value}</span>;
}

function RecentOrders({
  orders,
  onViewAll,
}: {
  orders: Order[];
  onViewAll: () => void;
}) {
  return (
    <article className="panel orders-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">RECENT ACTIVITY</p>
          <h3>Latest orders</h3>
        </div>
        <button className="text-button" onClick={onViewAll} type="button">
          View all ↗
        </button>
      </div>
      <div className="compact-orders">
        {orders.map((order) => (
          <div className="compact-order" key={order.id}>
            <span className="customer-avatar">{order.initials}</span>
            <div className="order-customer">
              <strong>{order.customer}</strong>
              <small>
                {order.id} · {order.time}
              </small>
            </div>
            <Status value={order.status} />
            <strong>{money.format(order.total)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function LowStock({ onViewAll }: { onViewAll: () => void }) {
  return (
    <article className="panel stock-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">INVENTORY ALERTS</p>
          <h3>Low stock</h3>
        </div>
        <button className="text-button" onClick={onViewAll} type="button">
          Manage ↗
        </button>
      </div>
      {inventory.slice(0, 3).map((item) => (
        <div className="stock-row" key={item.sku}>
          <div className="product-glyph">◆</div>
          <div>
            <strong>{item.product}</strong>
            <small>{item.sku}</small>
          </div>
          <div className="stock-amount">
            <strong>{item.stock}</strong>
            <small>of {item.reorder}</small>
          </div>
        </div>
      ))}
      <div className="stock-note">
        <span>!</span>
        Purchase suggestions are ready for review.
      </div>
    </article>
  );
}

function Orders({ orders }: { orders: Order[] }) {
  return (
    <div className="content-stack page-view">
      <section className="intro-row">
        <div>
          <h2>Sales orders</h2>
          <p>Track every order from reservation to fulfilment.</p>
        </div>
        <div className="filter-pills">
          <button className="active" type="button">
            All {orders.length}
          </button>
          <button type="button">Processing</button>
          <button type="button">Ready</button>
          <button type="button">Shipped</button>
        </div>
      </section>
      <article className="panel table-panel">
        <div className="data-table">
          <div className="table-row table-head">
            <span>Order</span>
            <span>Customer</span>
            <span>Channel</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {orders.map((order) => (
            <div className="table-row" key={order.id}>
              <strong>{order.id}</strong>
              <span className="customer-cell">
                <i>{order.initials}</i>
                {order.customer}
              </span>
              <span>{order.channel}</span>
              <Status value={order.status} />
              <strong>{money.format(order.total)}</strong>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function Inventory() {
  return (
    <div className="content-stack page-view">
      <section className="intro-row">
        <div>
          <h2>Inventory control</h2>
          <p>Live availability, reorder points and reservation status.</p>
        </div>
        <div className="sync-pill">
          <span className="pulse-dot" /> Redis cache
          <small>42 ms response</small>
        </div>
      </section>
      <section className="inventory-summary">
        <article>
          <span>Total SKUs</span>
          <strong>1,284</strong>
        </article>
        <article>
          <span>Inventory value</span>
          <strong>$428,900</strong>
        </article>
        <article>
          <span>Reserved units</span>
          <strong>186</strong>
        </article>
      </section>
      <article className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">WAREHOUSE 01</p>
            <h3>Stock levels</h3>
          </div>
          <button className="secondary-button" type="button">
            Export CSV
          </button>
        </div>
        <div className="data-table inventory-table">
          <div className="table-row table-head">
            <span>SKU</span>
            <span>Product</span>
            <span>Available</span>
            <span>Reorder point</span>
            <span>Health</span>
          </div>
          {inventory.map((item) => {
            const low = item.stock < item.reorder;
            return (
              <div className="table-row" key={item.sku}>
                <strong>{item.sku}</strong>
                <span>{item.product}</span>
                <strong>{item.stock}</strong>
                <span>{item.reorder}</span>
                <span className={low ? "stock-health low" : "stock-health good"}>
                  {low ? "Reorder" : "Healthy"}
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function Architecture() {
  return (
    <div className="content-stack page-view">
      <section className="intro-row architecture-intro">
        <div>
          <h2>Built for reliable operations</h2>
          <p>
            A portfolio-ready reference architecture for transactional business
            software.
          </p>
        </div>
        <span className="demo-badge">REFERENCE IMPLEMENTATION</span>
      </section>

      <section className="architecture-map">
        <div className="arch-layer client-layer">
          <p>CLIENT</p>
          <strong>Next.js dashboard</strong>
          <span>Responsive UI · TypeScript · Optimistic interactions</span>
        </div>
        <div className="connector-line">
          <i />
          <span>REST / JSON</span>
          <i />
        </div>
        <div className="arch-layer api-layer">
          <p>APPLICATION</p>
          <strong>ASP.NET Core API</strong>
          <span>Vertical slices · Validation · OpenAPI · Health checks</span>
        </div>
        <div className="connector-fan">
          <i />
          <i />
          <i />
        </div>
        <div className="service-grid">
          <div className="arch-layer">
            <p>DATA</p>
            <strong>PostgreSQL</strong>
            <span>Dapper · Transactions · Outbox</span>
          </div>
          <div className="arch-layer">
            <p>CACHE</p>
            <strong>Redis</strong>
            <span>Read-through · TTL · Invalidation</span>
          </div>
          <div className="arch-layer">
            <p>MESSAGING</p>
            <strong>RabbitMQ</strong>
            <span>Events · Retry · Dead-letter queue</span>
          </div>
        </div>
      </section>

      <section className="decision-grid">
        <article className="panel">
          <span className="decision-index">01</span>
          <h3>Fast reads, safe writes</h3>
          <p>
            Transactional writes stay in PostgreSQL while frequently accessed
            catalogue data is served through Redis.
          </p>
        </article>
        <article className="panel">
          <span className="decision-index">02</span>
          <h3>Resilient workflows</h3>
          <p>
            Order events are published through an outbox pattern, preventing
            lost messages during partial failures.
          </p>
        </article>
        <article className="panel">
          <span className="decision-index">03</span>
          <h3>Maintainable delivery</h3>
          <p>
            Feature-focused application services keep business rules explicit
            and easy to test.
          </p>
        </article>
      </section>
    </div>
  );
}
