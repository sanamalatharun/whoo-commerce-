# OmniPulse CRM — Comprehensive Functional Specification

**Document:** Functional Specification & System Architecture  
**Project:** OmniPulse CRM for WooCommerce  
**Version:** 1.0.0 (Hackathon Release)  
**Location:** `/Users/tharun/Desktop/CRM/FUNCTIONAL_SPECIFICATION.md`  

---

## 1. Architectural Overview

OmniPulse CRM is built on an event-driven, reactive model that interfaces with WooCommerce stores through two synchronization vectors:
1. **REST API v3 Layer:** Pulls historical customers and order entities using Basic Authentication (`ck_...` and `cs_...`).
2. **Webhook Ingestion Engine:** Listens to real-time events (`order.created`, `order.completed`, `customer.created`) and triggers the automated communication pipeline.

```
+-----------------------------------------------------------------------+
|                           User Interface                              |
|   [Dashboard]    [Customers 360]    [Orders]    [Workflows]    [API]  |
+------------------------------------+----------------------------------+
                                     | Event Subscriptions
                                     v
+-----------------------------------------------------------------------+
|                    OmniPulse Reactive Core Store                      |
|                                                                       |
|   State Management        RFM Tier Engine          Workflow Engine    |
|   - customers[]           - Recency                - Rule Evaluator   |
|   - orders[]              - Frequency              - Condition Match  |
|   - workflows[]           - Monetary               - Execution Logs   |
|   - logs[]                                                            |
|   - settings{}            AI Copilot Engine                           |
|                           - Churn Risk Analyzer                       |
|                           - Tailored Email Drafter                    |
+------------------------------------+----------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------+
|                    WooCommerce Integration Layer                      |
|                                                                       |
|   Live REST API Client                 Real-time Webhook Simulator    |
|   - /wp-json/wc/v3/customers           - Event generator              |
|   - /wp-json/wc/v3/orders              - JSON payload preview         |
|   - /wp-json/wc/v3/system_status       - Zero-latency sandbox bridge  |
+-----------------------------------------------------------------------+
```

---

## 2. Core Functional Modules & Functions

### Module A: Reactive State Store (`src/store.js`)

The store acts as the single source of truth, persisting data in `localStorage` while broadcasting state transitions to active UI views.

#### 1. `loadState()`
- **Purpose:** Restores persisted state from `localStorage` under key `omnipulse_crm_state_v1`.
- **Fallback:** If no existing state is detected or parsing errors occur, loads default curated seed data (8 customers, 9 orders, 4 automation workflows, 3 audit logs).

#### 2. `saveState()`
- **Purpose:** Serializes the current state (`customers`, `orders`, `workflows`, `logs`, `settings`) to `localStorage` and triggers `this.notify()`.

#### 3. `subscribe(callback)` / `notify()`
- **Purpose:** Observer pattern implementation. Components register listener callbacks that re-render views whenever data updates.

#### 4. `getMetrics()`
- **Purpose:** Computes high-level business intelligence KPIs:
  - `totalRevenue`: Sum of order totals excluding `cancelled` and `refunded` orders.
  - `totalOrders`: Count of all synchronized orders.
  - `completedOrders`: Count of fulfilled orders.
  - `activeCustomers`: Count of registered customer accounts.
  - `aov`: Average Order Value = `totalRevenue / validOrderCount`.
  - `vipCustomers`: Count of customers currently categorized in the `VIP` tier.
  - `activeWorkflowsCount`: Count of enabled automation rules.

#### 5. `getCustomersWithStats()`
- **Purpose:** Enriches raw customer data with dynamic order aggregations and RFM tier scoring:
  - Aggregates matching orders by `customer_id` and `customer_email`.
  - Computes `total_spent` and `orders_count`.
  - **Dynamic RFM Tier Classification Algorithm:**
    - `VIP`: Lifetime spend $\ge \$500$ OR $\ge 4$ completed orders.
    - `High Value`: Lifetime spend $\ge \$250$.
    - `Loyal`: Orders count $\ge 2$.
    - `First-Time`: Orders count $= 1$.
    - `At Risk`: Inactive for $> 60$ days with previous order history.

#### 6. `getCustomerById(id)`
- **Purpose:** Retrieves a single enriched customer record for the Customer 360° modal.

#### 7. `addCustomerNote(customerId, text, author = 'Agent')`
- **Purpose:** Appends a timestamped internal note to the customer’s interaction timeline and persists state.

#### 8. `getOrderById(id)`
- **Purpose:** Finds an order by its WooCommerce identifier (e.g., `WC-8924`).

#### 9. `updateOrderStatus(orderId, newStatus)`
- **Purpose:** Updates order status (`processing` $\rightarrow$ `completed` $\rightarrow$ `cancelled`).
- **Trigger Hooks:**
  - Emits `order.status_changed`.
  - If `newStatus === 'completed'`, automatically executes `processWorkflows('order.completed', { order })`.
  - If `newStatus === 'cancelled'`, automatically executes `processWorkflows('order.cancelled', { order })`.
  - Re-calculates and persists customer metrics.

#### 10. `ingestWebhookEvent(eventType, payload)`
- **Purpose:** Ingests incoming WooCommerce webhook payloads.
- **Behavior for `order.created`:**
  1. Checks if the buyer already exists by email; if not, automatically registers a new customer profile.
  2. Generates an order record and appends it to `orders[]`.
  3. Re-calculates customer lifetime spend and RFM classification.
  4. Dispatches the event to `processWorkflows('order.created', { order, customer })`.
- **Behavior for `customer.created`:**
  1. Creates a new prospect record with registered details and tags them as `Active Prospect`.
  2. Dispatches `processWorkflows('customer.created', { customer })`.

#### 11. `processWorkflows(triggerEvent, eventData)`
- **Purpose:** Core rule-engine evaluator:
  1. Filters enabled workflows matching the `triggerEvent`.
  2. Evaluates rule conditions:
     - `always`: Unconditional trigger.
     - `order.total >= X`: Evaluates if order amount exceeds threshold $X.
     - `inactive_days >= Y`: Evaluates customer dormancy.
  3. Increments workflow `executions_count` and updates `last_triggered`.
  4. Generates an immutable entry in `logs[]` recording the timestamp, trigger, recipient, and dispatched message.

#### 12. `toggleWorkflow(workflowId)`
- **Purpose:** Inverts the `enabled` boolean state of a workflow rule.

#### 13. `addWorkflow(workflowData)`
- **Purpose:** Creates a new automation rule with custom triggers, conditions, and action channels.

#### 14. `getAnalyticsData()`
- **Purpose:** Compiles RFM tier distribution counters, category affinity revenue allocations, and order status fulfillment proportions.

#### 15. `issueCustomerDiscount(customerId, code, percent)`
- **Purpose:** Generates single-use loyalty coupon codes, appends them to customer activity notes, and executes `discount.issued` automation workflows.

#### 16. `exportCustomersCSV()` / `exportOrdersCSV()`
- **Purpose:** Generates formatted RFC 4180-compliant CSV files directly in-browser and triggers automatic download without server overhead.

#### 17. `resetToDefault()`
- **Purpose:** Clears `localStorage` and restores factory demo records for clean presentations.

---

### Module B: WooCommerce Integration Layer (`src/api.js`)

#### 1. `WooCommerceAPI.getAuthHeader()`
- **Purpose:** Generates HTTP Basic Auth headers using `btoa(consumerKey:consumerSecret)`.

#### 2. `WooCommerceAPI.testConnection(url, key, secret)`
- **Purpose:** Performs an asynchronous health check against the WooCommerce REST API endpoint (`/wp-json/wc/v3/system_status`).
- **Resilience:** If CORS or network restrictions occur, falls back cleanly to the verified Sandbox Webhook Bridge to ensure uninterrupted demo presentation.

#### 3. `WooCommerceAPI.triggerSimulatedWebhook(eventType, customData)`
- **Purpose:** Simulates realistic incoming webhook events with generated IDs, timestamps, product items, and customer information.

---

### Module C: AI Customer Intelligence Copilot (`src/ai.js`)

#### 1. `AICopilot.analyzeCustomer(customer)`
- **Purpose:** Evaluates customer activity and generates predictive analytics:
  - **Churn Risk Assessment:** Analyzes days elapsed since the last order relative to customer tier. Returns Risk Tier (`Low`, `Moderate`, `High`), numeric score (0–100%), and rationale.
  - **Category Affinity:** Examines purchased line items to determine primary interest (e.g., *Custom Tech & Peripherals*, *Luxury Leather Goods*, *Artisan Ceramics*).
  - **Executive Bullet Summary:** Produces 3 tailored insights covering Customer Persona, Lifetime Value profile, and Recommended Next Best Action.

#### 2. `AICopilot.generateOutreachDraft(customer, tone)`
- **Purpose:** Drafts hyper-personalized outreach copy with tailored subject line and body:
  - `tone = 'vip'`: High-touch executive gratitude, VIP points grant, and concierge contact offer.
  - `tone = 'winback'`: Friendly check-in referencing previous purchases with an automated discount coupon code.
  - `tone = 'followup'`: Post-delivery care check-in with review request and loyalty points reward.

---

### Module D: UI Components & Modal Controllers

| Component File | Function | Primary Role |
| :--- | :--- | :--- |
| `src/components/dashboardView.js` | `renderDashboardView()` | Mounts 4 KPI cards, interactive SVG trajectory curve, recent orders list, and live workflow feed. |
| `src/components/customersView.js` | `renderCustomersView()` | Customer 360° directory with multi-tier filter buttons, instant keyword search, and modal inspection triggers. |
| `src/components/ordersView.js` | `renderOrdersView()` | WooCommerce orders pipeline supporting both Table View and Kanban Board with 1-click fulfillment. |
| `src/components/analyticsView.js` | `renderAnalyticsView()` | RFM segmentation matrix, revenue by product category, order fulfillment health, and CSV export buttons. |
| `src/components/workflowsView.js` | `renderWorkflowsView()` | Automation engine cards with real-time toggle switches and execution audit log table. |
| `src/components/settingsView.js` | `renderSettingsView()` | REST API v3 configuration forms, endpoint documentation, and factory reset trigger. |
| `src/components/customerModal.js` | `openCustomerModal(id)` | Opens 4-tab Customer 360° modal with VIP coupon generation, order history, AI Copilot, and notes. |
| `src/components/orderModal.js` | `openOrderModal(id)` | Displays order line items, totals, shipping info, and status lifecycle updater. |
| `src/components/workflowModal.js` | `openWorkflowModal()` | Custom rule creator modal with trigger, condition, and template fields. |
| `src/components/simulatorModal.js` | `openSimulatorModal()` | Live Webhook event simulator with JSON preview and one-click dispatch. |
| `src/components/toast.js` | `toast.show()` | Floating audio-visual notifications with auto-dismissal. |

---

## 3. Data Dictionary

### Customer Entity
```json
{
  "id": 101,
  "name": "Sophia Reynolds",
  "email": "sophia.reynolds@example.com",
  "phone": "+1 (555) 234-8901",
  "avatar": "https://images.unsplash.com/...",
  "company": "Studio Lumina",
  "country": "United States",
  "city": "San Francisco, CA",
  "registered_at": "2024-03-12",
  "last_active": "2026-10-12",
  "rfm_tier": "VIP",
  "tag": "VIP Customer",
  "notes": [
    { "id": 1, "text": "Prefers carbon-neutral packaging.", "author": "Alex", "date": "2026-09-14" }
  ]
}
```

### Order Entity
```json
{
  "id": "WC-8924",
  "customer_id": 101,
  "customer_name": "Sophia Reynolds",
  "customer_email": "sophia.reynolds@example.com",
  "total": 420.00,
  "status": "completed",
  "payment_method": "Apple Pay",
  "date": "2026-10-12 14:15",
  "currency": "USD",
  "shipping_address": "450 Mission St, San Francisco, CA 94105",
  "items": [
    { "id": "SKU-890", "name": "Nordic Minimalist Oak Desk Lamp", "quantity": 2, "price": 160.00 }
  ]
}
```

### Automation Workflow Entity
```json
{
  "id": "wf-1",
  "name": "VIP First-Class Onboarding",
  "description": "Triggered when a customer reaches VIP status or spends over $300.",
  "trigger": "order.created",
  "condition": "order.total >= 300",
  "action": "send_email",
  "actionDetails": {
    "subject": "Welcome to the VIP Circle — Exclusive Concierge Access Inside 👑",
    "channel": "Email + Agent Task",
    "template": "vip_welcome"
  },
  "enabled": true,
  "executions_count": 14,
  "last_triggered": "2026-10-12 14:15"
}
```
