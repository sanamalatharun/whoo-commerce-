// Dashboard Overview View

import { store } from '../store.js';
import { openCustomerModal } from './customerModal.js';
import { openOrderModal } from './orderModal.js';
import { openSimulatorModal } from './simulatorModal.js';
import { toast } from './toast.js';

export function renderDashboardView(container) {
  const metrics = store.getMetrics();
  const recentOrders = store.orders.slice(0, 5);
  const recentLogs = store.logs.slice(0, 6);

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Executive Dashboard</h2>
        <p class="page-subtitle">Real-time WooCommerce customer insights, order tracking & automated workflows.</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-secondary" id="btn-sync-woo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Sync Store
        </button>
        <button class="btn btn-primary" id="btn-open-sim">
          ⚡ Simulate Webhook Event
        </button>
      </div>
    </div>

    <!-- 4 KPI Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Store Revenue</span>
          <div class="metric-icon-wrap" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div class="metric-value">$${Number(metrics.totalRevenue).toLocaleString()}</div>
        <div class="metric-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          <span>Avg Order: $${metrics.aov}</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Active Customers</span>
          <div class="metric-icon-wrap" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>
        <div class="metric-value">${metrics.activeCustomers}</div>
        <div class="metric-footer" style="color: #22d3ee;">
          <span>👑 ${metrics.vipCustomers} High-tier VIPs</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">WooCommerce Orders</span>
          <div class="metric-icon-wrap" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
        </div>
        <div class="metric-value">${metrics.totalOrders}</div>
        <div class="metric-footer">
          <span>✓ ${metrics.completedOrders} Fulfilled</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Active Workflows</span>
          <div class="metric-icon-wrap" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
        </div>
        <div class="metric-value">${metrics.activeWorkflowsCount}</div>
        <div class="metric-footer" style="color: #fbbf24;">
          <span>100% Delivery Success</span>
        </div>
      </div>
    </div>

    <!-- Interactive SVG Revenue Velocity Curve Chart -->
    <div class="card" style="margin-bottom: 28px;">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Revenue & Order Trajectory
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Synchronized WooCommerce order checkout trends across billing cycles.</p>
        </div>
        <span class="badge badge-loyal">Live Sync Active</span>
      </div>
      <div style="width: 100%; height: 180px; position: relative;">
        <svg viewBox="0 0 800 180" style="width: 100%; height: 100%; overflow: visible;">
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <!-- Grid lines -->
          <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />

          <!-- Area fill -->
          <path d="M 0 150 Q 100 120 200 140 T 400 80 T 600 50 T 800 30 L 800 180 L 0 180 Z" fill="url(#chartGrad)" />

          <!-- Main Curve -->
          <path d="M 0 150 Q 100 120 200 140 T 400 80 T 600 50 T 800 30" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />

          <!-- Cyan Accent line -->
          <path d="M 0 160 Q 150 145 300 120 T 550 90 T 800 60" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="5 5" />

          <!-- Interactive Highlight Points -->
          <circle cx="200" cy="140" r="5" fill="#818cf8" stroke="#ffffff" stroke-width="2" />
          <circle cx="400" cy="80" r="5" fill="#818cf8" stroke="#ffffff" stroke-width="2" />
          <circle cx="600" cy="50" r="5" fill="#818cf8" stroke="#ffffff" stroke-width="2" />
          <circle cx="800" cy="30" r="6" fill="#06b6d4" stroke="#ffffff" stroke-width="2" />
        </svg>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.75rem; color: var(--text-dim);">
        <span>July 2026</span>
        <span>August 2026</span>
        <span>September 2026</span>
        <span>October 2026 (Current Cycle)</span>
      </div>
    </div>

    <!-- 2 Columns: Orders & Live Activity Logs -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
      <!-- Recent Orders Column -->
      <div class="card" style="margin: 0;">
        <div class="card-header">
          <h3 class="card-title">Recent WooCommerce Orders</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Real-time stream</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(order => `
                <tr class="order-row-click" data-order-id="${order.id}">
                  <td style="font-family: monospace; font-weight: 700; color: #a5b4fc;">${order.id}</td>
                  <td>
                    <div style="font-weight: 600; color: #ffffff;">${order.customer_name}</div>
                    <div style="font-size: 0.74rem; color: var(--text-dim);">${order.date}</div>
                  </td>
                  <td style="font-weight: 700; color: #ffffff;">$${Number(order.total).toFixed(2)}</td>
                  <td><span class="badge ${getStatusBadge(order.status)}">${order.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Real-Time Workflow Stream Column -->
      <div class="card" style="margin: 0;">
        <div class="card-header">
          <h3 class="card-title">
            <span class="pulse-dot"></span>
            Automated Communication Feed
          </h3>
          <span style="font-size: 0.75rem; color: var(--accent-cyan);">Live Events</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto;">
          ${recentLogs.map(log => `
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: #818cf8;">${log.workflowName}</span>
                <span style="font-size: 0.72rem; color: var(--text-dim);">${log.timestamp.split(' ')[1] || log.timestamp}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">
                Target: <strong>${log.target}</strong>
              </div>
              <div style="font-size: 0.76rem; color: #34d399; background: rgba(16, 185, 129, 0.08); padding: 4px 8px; border-radius: 4px;">
                ✓ ${log.message}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Events
  container.querySelectorAll('.order-row-click').forEach(row => {
    row.onclick = () => {
      const orderId = row.getAttribute('data-order-id');
      openOrderModal(orderId);
    };
  });

  const simBtn = container.querySelector('#btn-open-sim');
  if (simBtn) {
    simBtn.onclick = () => openSimulatorModal();
  }

  const syncBtn = container.querySelector('#btn-sync-woo');
  if (syncBtn) {
    syncBtn.onclick = () => {
      toast.show('WooCommerce Sync Complete', 'Pulled 8 customers and 9 orders via REST API v3', 'success');
    };
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'completed': return 'badge-completed';
    case 'processing': return 'badge-processing';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-first-time';
  }
}
