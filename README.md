# OmniPulse CRM — WooCommerce Intelligence & Automation

[![WooCommerce REST API v3](https://img.shields.io/badge/WooCommerce-REST%20API%20v3-96588a?style=flat-square&logo=woocommerce)](https://woocommerce.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise-grade Customer Relationship Management (CRM) dashboard purpose-built for WooCommerce. OmniPulse bridges the e-commerce retention gap by transforming raw customer accounts and orders into unified 360° profiles, real-time RFM cohorts, and automated multi-channel communication workflows.

---

## 🌟 Key Features

- **360° Customer Profiles & RFM Segmentation:** Unified customer view with lifetime spend, order count, order history, and dynamic categorization across `VIP Champions`, `High Value`, `Consistent Loyal`, `First-Time`, and `At Risk`.
- **Order Tracking & Kanban Pipeline:** Interactive order lifecycle tracking with a switcher between **Table View** and **Kanban Board** (`Processing` ➡️ `Completed` ➡️ `Cancelled`) featuring 1-click fulfillment.
- **Automated Communication Workflows:** Rule-based event triggers on `order.created`, `order.completed`, `customer.created`, and customer dormancy that automatically dispatch transactional emails, SMS alerts, and loyalty rewards with an audit log.
- **AI Customer Intelligence Copilot:** Behavioral persona analyzer, churn risk score predictor, and instant outreach email drafter tailored across three tones: *VIP Concierge*, *Win-Back*, and *Post-Delivery*.
- **Interactive Webhook Simulator:** Built-in event generator to test incoming WooCommerce webhook events (`order.created`, `customer.created`) in real time with live JSON payload preview.
- **Data Export & Reporting:** 1-click CSV data exports for both customers and orders.
- **Dual-Mode Integration:** Connects directly to live WooCommerce REST API v3 credentials (`ck_...` / `cs_...`) with sandboxed fallback for offline reliability.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/sanamalatharun/whoo-commerce-.git
cd whoo-commerce-

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 📁 Repository Structure

```
.
├── PROJECT_PLAN.md               # Architecture design & hackathon roadmap
├── FUNCTIONAL_SPECIFICATION.md   # Complete functional specifications & data schemas
├── WALKTHROUGH.md                # Screen-by-screen testing guide & demo pitch script
├── index.html                    # Root semantic HTML layout
├── package.json                  # Dependencies and scripts
└── src/
    ├── main.js                   # Application router & reactive event controller
    ├── style.css                 # Dark glassmorphism design system
    ├── store.js                  # Reactive state store, RFM engine & CSV generator
    ├── api.js                    # WooCommerce REST API v3 client & webhook simulator
    ├── ai.js                     # AI Customer Intelligence Copilot
    └── components/
        ├── dashboardView.js      # Executive KPI cards & revenue trajectory curve
        ├── customersView.js      # Customer 360 directory & tier filter
        ├── ordersView.js         # Orders tracking (Table & Kanban pipeline)
        ├── analyticsView.js      # RFM segmentation matrix & category breakdown
        ├── workflowsView.js      # Rule cards & execution audit trail
        ├── settingsView.js       # WooCommerce API credentials & status health
        ├── customerModal.js      # Customer 360 drawer with AI copilot & coupon generator
        ├── orderModal.js         # Order line items & status lifecycle updater
        ├── workflowModal.js      # Custom rule creator modal
        ├── simulatorModal.js     # Webhook simulator modal
        └── toast.js              # Real-time notifications
```

---

## 🛠️ Technology Stack

- **Frontend Core:** Modern HTML5, ES6+ Modular JavaScript
- **Styling:** Custom CSS3 (Design tokens, CSS variables, dark glassmorphism, responsive)
- **Tooling:** Vite
- **Typography:** Outfit & Plus Jakarta Sans

---

## 📄 Documentation

- [Project Plan](PROJECT_PLAN.md)
- [Functional Specification](FUNCTIONAL_SPECIFICATION.md)
- [Walkthrough & Pitch Script](WALKTHROUGH.md)
