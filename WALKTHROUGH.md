# OmniPulse CRM — End-to-End Walkthrough Guide

**Document:** Complete Application Walkthrough & Hackathon Demonstration Guide  
**Project:** OmniPulse CRM for WooCommerce  
**Location:** `/Users/tharun/Desktop/CRM/WALKTHROUGH.md`  

---

## 1. Quick Launch Instructions

To launch the project on your machine:

```bash
# 1. Navigate to the project root
cd /Users/tharun/Desktop/CRM

# 2. Start the Vite development server (already running if started)
npm run dev

# 3. Open in your browser:
# http://localhost:5173/
```

> **Note:** The server will start instantly (typically $<100\text{ ms}$) and will be accessible at `http://localhost:5173/`.

---

## 2. Screen-by-Screen Walkthrough

### Screen 1: Executive Dashboard (Overview)
- **What it shows:**
  - **4 Top KPI Cards:** Gross Store Revenue, Active Customers (with VIP count), WooCommerce Orders (with completed rate), and Active Automated Workflows.
  - **Revenue & Order Trajectory Chart:** An interactive SVG curve plotting checkout revenue trends across sales cycles.
  - **Recent WooCommerce Orders Table:** Live order feed displaying the most recent transactions.
  - **Automated Communication Feed:** Real-time log showing triggered customer notifications.
- **Interactive Actions to Test:**
  - Click **Sync Store** in the top right to simulate pulling the latest store data.
  - Click on any row in the **Recent WooCommerce Orders** table to open the Order Details modal.

---

### Screen 2: Customer 360° Directory
- **How to reach it:** Click **Customers 360°** in the left sidebar navigation.
- **What it shows:**
  - A directory of all synced WooCommerce customers with their profile avatar, email, company, location, order count, lifetime spend, and **RFM Tier Badge** (`👑 VIP`, `⭐ High Value`, `🌿 Loyal`, `🌱 First-Time`, `⚠️ At Risk`).
- **Interactive Actions to Test:**
  - **Tier Filter Buttons:** Click `👑 VIP` or `⚠️ At Risk` to instantly filter the customer list.
  - **Live Search:** Type a customer name (e.g. `Sophia` or `Chloe`) or a city (e.g. `Berlin` or `Austin`) in the search box.
  - **Inspect Customer:** Click **Inspect 360°** on any row to open the Customer 360 Modal.

---

### Screen 3: Customer 360 Modal & AI Copilot
- **How to reach it:** Click on **Sophia Reynolds** or **Marcus Vance** in the Customer list.
- **What it shows:**
  - **Quick Stats Banner:** Lifetime spend, total orders, location, and computed Churn Risk percentage.
  - **Tab 1: 360° Profile:** Company details, customer registration date, and shipping address.
  - **Tab 2: WooCommerce Orders:** Every historical purchase order placed by this customer, including line items and totals.
  - **Tab 3: ✨ AI Intelligence & Copilot (Key Feature):**
    - AI-generated behavioral persona summary and actionable retention recommendation.
    - **Tone Switcher:** Toggle between **VIP Concierge**, **Win-Back**, and **Post-Delivery**.
    - Watch the subject line and email body dynamically update according to the customer's purchase history.
    - Click **📋 Copy Draft** or **🚀 Simulate Dispatch Email** to trigger an automated communication event.
  - **Tab 4: Internal Notes:** View agent history or type a new customer note (e.g., *"Prefers carbon-neutral shipping"*), then click **Add Note**.

---

### Screen 4: WooCommerce Order Tracking & Kanban Pipeline
- **How to reach it:** Click **Order Tracking** in the left sidebar navigation.
- **What it shows:**
  - Synchronized WooCommerce orders with status badges (`processing`, `completed`, `cancelled`).
- **Interactive Actions to Test:**
  - **View Mode Switcher:** Toggle between **📋 Table View** and **📊 Kanban Board**.
  - In Kanban Mode: View orders categorized into visual stages (*Processing*, *Completed*, *Cancelled*).
  - Click **✓ Fulfill** directly on a processing card to immediately mark it delivered and watch the automated loyalty workflow execute!
  - Click **📥 Export CSV** to download a formatted spreadsheet of all store orders.

---

### Screen 5: Analytics & RFM Customer Matrix
- **How to reach it:** Click **Analytics & RFM** in the left sidebar navigation.
- **What it shows:**
  - **RFM Matrix Breakdown:** Dynamic customer count and percentage distribution across *VIP Champions*, *High Value*, *Consistent Loyal*, *First-Time*, and *At Risk*.
  - **Revenue by Product Category Affinity:** Progress bars visualizing sales volume across *Tech Peripherals*, *Home & Ceramics*, *Leather Goods*, and *Desk Accessories*.
  - **Fulfillment & Order Health Cards:** Live metrics comparing completed vs in-dispatch orders.
- **Interactive Actions to Test:**
  - Click **📥 Export Customers (CSV)** to download a complete customer dataset.
  - Click **📥 Export Orders (CSV)** for store finance auditing.

---

### Screen 6: Automated Communication Workflows Engine
- **How to reach it:** Click **Workflows** in the left sidebar navigation.
- **What it shows:**
  - Active rule cards governing automated customer communication:
    1. *VIP First-Class Onboarding* (Trigger: `order.created` with total $\ge \$300$)
    2. *Post-Delivery Review & Loyalty Boost* (Trigger: `order.completed`)
    3. *New Buyer Welcome & Care Guide* (Trigger: `customer.created`)
    4. *Win-Back Churn Prevention* (Trigger: `customer.inactive` $\ge 45$ days)
  - **Execution Audit Log Table:** Immutable record of every automated message sent.
- **Interactive Actions to Test:**
  - Toggle the switch on any workflow card to enable or disable it in real time.
  - Click **⚡ + Create New Workflow** to build a custom rule (e.g., trigger on high-value basket with SMS alert).

---

### Screen 6: Live Webhook Simulator (The "WOW" Moment for Judges)
- **How to reach it:** Click **⚡ Webhook Simulator** in the top navigation bar from any screen.
- **What it shows:**
  - Interactive simulator replicating WooCommerce webhook events.
  - Displays the exact JSON payload sent over HTTP.
- **Interactive Actions to Test:**
  - Click **👑 High-Value VIP Order ($495)** or **🛒 Standard Order ($149)**.
  - Review the raw JSON payload in the preview box.
  - Click **🚀 Fire Webhook & Trigger Workflows**.
  - **Watch what happens:**
    1. A success toast appears informing that the event was ingested.
    2. The customer's profile is updated or created.
    3. The matching workflow executes automatically.
    4. The revenue KPI and recent activity feed increment in real time.

---

### Screen 7: API Integration & Settings
- **How to reach it:** Click **API Integration** in the left sidebar.
- **What it shows:**
  - WooCommerce REST API v3 configuration fields (Store URL, Consumer Key, Consumer Secret, Webhook Secret).
  - Dual-mode architecture explanation (Live REST API vs Webhook Listener vs Sandbox Fallback).
- **Interactive Actions to Test:**
  - Click **🔍 Test Connection** to verify endpoint status.
  - Click **Reset All Data to Factory Demo State** if you ever want to reset all records back to clean presentation defaults.

---

## 3. Step-by-Step 3-Minute Hackathon Demo Script

Follow this script when demonstrating the project to hackathon judges:

```
[0:00 - 0:45] INTRODUCTION & THE PROBLEM
"Judges, WooCommerce powers millions of stores, but store owners lose high-value customers 
every day because customer data is fragmented across basic WordPress user tables. 
We built OmniPulse CRM—an enterprise-grade customer intelligence engine built specifically 
for WooCommerce. As you can see on our dashboard, store owners get an instant live pulse 
on store revenue, customer lifetime value, and automated workflows."

[0:45 - 1:30] CUSTOMER 360° & AI INTELLIGENCE
"Let's jump into Customers 360°. Here, every shopper is unified into an RFM profile. 
If we click on Sophia Reynolds, we get her complete purchase history and a computed 
churn risk score. With one click on our AI Copilot, the system summarizes her persona 
and generates tailored outreach emails—whether for VIP appreciation, win-back retention, 
or post-delivery care."

[1:30 - 2:20] REAL-TIME WEBHOOK AUTOMATION (THE WOW MOMENT)
"Now, let's look at real-time integration. In e-commerce, speed is everything. 
Using our live Webhook Simulator, let's simulate a customer placing a $495 order 
on WooCommerce. When I click 'Fire Webhook', our engine ingests the payload, updates 
her lifetime spend, promotes her to VIP tier, and automatically executes our VIP 
Onboarding Workflow—dispatching a concierge email and logging the event in our audit trail."

[2:20 - 3:00] ARCHITECTURE & CONCLUSION
"Our architecture supports both live WooCommerce REST API v3 credentials and real-time 
asynchronous webhooks, with a verified sandbox mode guaranteeing zero downtime. 
OmniPulse CRM turns raw WooCommerce orders into lifelong customer relationships. 
Thank you!"
```

---

## 4. Key Advantages to Emphasize

1. **Why CRM beats PIM:** Focuses on revenue and customer retention (high emotional appeal to judges) rather than product taxonomy forms.
2. **True Event-Driven Reactivity:** No page reloads; webhooks update KPIs, customer RFM tiers, and workflows instantly.
3. **AI Retention Copilot:** Transforms static CRM customer profiles into actionable outreach copy.
4. **Resilient Dual-Mode Architecture:** Connects to live WooCommerce stores while having an interactive sandbox for pitch reliability.
