// Orders View (WooCommerce Order Tracking & Kanban Pipeline)

import { store } from '../store.js';
import { openOrderModal } from './orderModal.js';
import { toast } from './toast.js';

let currentOrderStatusFilter = 'ALL';
let currentDisplayMode = 'table'; // 'table' or 'kanban'

export function renderOrdersView(container) {
  const orders = store.orders;

  const filtered = orders.filter(o => {
    if (currentOrderStatusFilter === 'ALL') return true;
    return o.status === currentOrderStatusFilter;
  });

  const processingOrders = orders.filter(o => o.status === 'processing');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">WooCommerce Orders Pipeline</h2>
        <p class="page-subtitle">Synchronized purchase orders, line item fulfillments & real-time lifecycle tracking.</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <!-- View Mode Switcher -->
        <div style="background: rgba(0,0,0,0.3); padding: 4px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; gap: 4px;">
          <button class="btn btn-sm ${currentDisplayMode === 'table' ? 'btn-primary' : 'btn-secondary'} mode-btn" data-mode="table">
            📋 Table View
          </button>
          <button class="btn btn-sm ${currentDisplayMode === 'kanban' ? 'btn-primary' : 'btn-secondary'} mode-btn" data-mode="kanban">
            📊 Kanban Board
          </button>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-export-orders-csv">
          📥 Export CSV
        </button>
      </div>
    </div>

    ${currentDisplayMode === 'table' ? `
      <!-- Table View Controls -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
        <button class="btn btn-sm order-filter-btn ${currentOrderStatusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" data-status="ALL">All Orders (${orders.length})</button>
        <button class="btn btn-sm order-filter-btn ${currentOrderStatusFilter === 'processing' ? 'btn-primary' : 'btn-secondary'}" data-status="processing">⚡ Processing (${processingOrders.length})</button>
        <button class="btn btn-sm order-filter-btn ${currentOrderStatusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}" data-status="completed">✓ Completed (${completedOrders.length})</button>
        <button class="btn btn-sm order-filter-btn ${currentOrderStatusFilter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}" data-status="cancelled">✕ Cancelled (${cancelledOrders.length})</button>
      </div>

      <!-- Orders Table -->
      <div class="card" style="margin: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment Method</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length > 0 ? filtered.map(order => `
                <tr class="order-table-row" data-order-id="${order.id}">
                  <td>
                    <span style="font-family: monospace; font-weight: 700; color: #a5b4fc; font-size: 0.95rem;">${order.id}</span>
                    <div style="font-size: 0.74rem; color: var(--text-dim);">${order.date}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600; color: #ffffff;">${order.customer_name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">${order.customer_email}</div>
                  </td>
                  <td>
                    <div style="font-size: 0.84rem; color: #e2e8f0; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${(order.items || []).map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">${order.payment_method}</div>
                  </td>
                  <td>
                    <div style="font-family: var(--font-heading); font-weight: 700; color: #ffffff; font-size: 1.05rem;">
                      $${Number(order.total).toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <span class="badge ${getStatusBadge(order.status)}">${order.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm inspect-order-btn" data-order-id="${order.id}">
                      View Order
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-dim);">
                    No orders found for this status.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <!-- Kanban Pipeline Board -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <!-- Processing Column -->
        <div class="card" style="margin: 0; background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="pulse-dot"></span>
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0;">Processing (${processingOrders.length})</h3>
            </div>
            <span class="badge badge-processing">In Prep</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${processingOrders.map(o => `
              <div class="card" style="margin: 0; padding: 14px; background: rgba(19, 29, 51, 0.8); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.dispatchOrderInspect('${o.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-family: monospace; font-weight: 700; color: #818cf8;">${o.id}</span>
                  <span style="font-family: var(--font-heading); font-weight: 700; color: #ffffff;">$${Number(o.total).toFixed(2)}</span>
                </div>
                <div style="font-weight: 600; color: #ffffff; font-size: 0.88rem;">${o.customer_name}</div>
                <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 10px;">${(o.items || []).map(i => i.name).join(', ')}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                  <span style="font-size: 0.74rem; color: var(--text-muted);">${o.date.split(' ')[0]}</span>
                  <button class="btn btn-sm btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); window.dispatchQuickFulfill('${o.id}')">
                    ✓ Fulfill
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Completed Column -->
        <div class="card" style="margin: 0; background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #34d399;">✓</span>
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0;">Completed (${completedOrders.length})</h3>
            </div>
            <span class="badge badge-completed">Delivered</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; max-height: 650px; overflow-y: auto;">
            ${completedOrders.map(o => `
              <div class="card" style="margin: 0; padding: 14px; background: rgba(19, 29, 51, 0.8); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.dispatchOrderInspect('${o.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-family: monospace; font-weight: 700; color: #34d399;">${o.id}</span>
                  <span style="font-family: var(--font-heading); font-weight: 700; color: #ffffff;">$${Number(o.total).toFixed(2)}</span>
                </div>
                <div style="font-weight: 600; color: #ffffff; font-size: 0.88rem;">${o.customer_name}</div>
                <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 8px;">${(o.items || []).map(i => i.name).join(', ')}</div>
                <div style="font-size: 0.74rem; color: #34d399; display: flex; align-items: center; gap: 4px;">
                  <span>✓ Loyalty review workflow triggered</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cancelled Column -->
        <div class="card" style="margin: 0; background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #fb7185;">✕</span>
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0;">Cancelled (${cancelledOrders.length})</h3>
            </div>
            <span class="badge badge-cancelled">Refunded</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${cancelledOrders.map(o => `
              <div class="card" style="margin: 0; padding: 14px; background: rgba(19, 29, 51, 0.8); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.dispatchOrderInspect('${o.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-family: monospace; font-weight: 700; color: #fb7185;">${o.id}</span>
                  <span style="font-family: var(--font-heading); font-weight: 700; color: #ffffff;">$${Number(o.total).toFixed(2)}</span>
                </div>
                <div style="font-weight: 600; color: #ffffff; font-size: 0.88rem;">${o.customer_name}</div>
                <div style="font-size: 0.78rem; color: var(--text-dim);">Follow-up task created in CRM.</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `}
  `;

  // Global hooks for inline card handlers
  window.dispatchOrderInspect = (id) => openOrderModal(id);
  window.dispatchQuickFulfill = (id) => {
    store.updateOrderStatus(id, 'completed');
    toast.show('Order Fulfilled', `Order ${id} fulfilled! Review workflow triggered.`, 'success');
    renderOrdersView(container);
  };

  // Attach handlers
  container.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = () => {
      currentDisplayMode = btn.getAttribute('data-mode');
      renderOrdersView(container);
    };
  });

  const exportBtn = container.querySelector('#btn-export-orders-csv');
  if (exportBtn) {
    exportBtn.onclick = () => {
      store.exportOrdersCSV();
      toast.show('Export Successful', 'WooCommerce orders exported to CSV.', 'success');
    };
  }

  container.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.onclick = () => {
      currentOrderStatusFilter = btn.getAttribute('data-status');
      renderOrdersView(container);
    };
  });

  container.querySelectorAll('.order-table-row, .inspect-order-btn').forEach(elem => {
    elem.onclick = (e) => {
      const id = elem.getAttribute('data-order-id');
      if (id) {
        e.stopPropagation();
        openOrderModal(id);
      }
    };
  });
}

function getStatusBadge(status) {
  switch (status) {
    case 'completed': return 'badge-completed';
    case 'processing': return 'badge-processing';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-first-time';
  }
}
