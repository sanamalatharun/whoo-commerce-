// Order Details Modal with Status Lifecycle & Customer Link

import { store } from '../store.js';
import { toast } from './toast.js';
import { openCustomerModal } from './customerModal.js';

export function openOrderModal(orderId) {
  const order = store.getOrderById(orderId);
  if (!order) return;

  const existing = document.getElementById('order-modal-overlay');
  if (existing) existing.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'order-modal-overlay';
  modalOverlay.className = 'modal-overlay open';

  const renderContent = () => {
    return `
      <div class="modal-content" style="max-width: 650px;">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 class="modal-title" style="margin: 0; font-family: monospace;">Order ${order.id}</h3>
              <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.84rem; margin-top: 4px;">
              Synced from WooCommerce • Placed on ${order.date}
            </p>
          </div>
          <button class="btn-close" id="order-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Customer Summary Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.25); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Customer</div>
            <div style="font-weight: 600; color: #ffffff;">${order.customer_name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${order.customer_email}</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-view-customer-profile">
            👤 View Customer 360
          </button>
        </div>

        <!-- Order Items Table -->
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">Line Items</h4>
          <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
            ${(order.items || []).map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02);">
                <div>
                  <div style="font-weight: 600; color: #ffffff; font-size: 0.88rem;">${item.name}</div>
                  <div style="font-size: 0.78rem; color: var(--text-dim);">Qty: ${item.quantity} × $${Number(item.price).toFixed(2)}</div>
                </div>
                <div style="font-weight: 700; color: #ffffff; font-family: var(--font-heading);">$${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            `).join('')}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: rgba(0,0,0,0.3);">
              <span style="font-weight: 600; color: var(--text-muted);">Total Order Value</span>
              <span style="font-size: 1.35rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-heading);">$${Number(order.total).toFixed(2)} ${order.currency || 'USD'}</span>
            </div>
          </div>
        </div>

        <!-- Shipping & Payment Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px;">
          <div style="background: rgba(255,255,255,0.02); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Payment Gateway</div>
            <div style="font-size: 0.88rem; color: #ffffff; margin-top: 4px; font-weight: 500;">${order.payment_method || 'Credit Card'}</div>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Shipping Destination</div>
            <div style="font-size: 0.88rem; color: #ffffff; margin-top: 4px;">${order.shipping_address || 'Customer Profile Address'}</div>
          </div>
        </div>

        <!-- Update Order Status Controls -->
        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: var(--radius-md); padding: 16px;">
          <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
            Synchronize WooCommerce Order Status:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-sm ${order.status === 'processing' ? 'btn-primary' : 'btn-secondary'} status-toggle" data-status="processing">Processing</button>
            <button class="btn btn-sm ${order.status === 'completed' ? 'btn-primary' : 'btn-secondary'} status-toggle" data-status="completed">Completed (Fulfill)</button>
            <button class="btn btn-sm ${order.status === 'cancelled' ? 'btn-primary' : 'btn-secondary'} status-toggle" data-status="cancelled">Cancelled</button>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
            💡 Updating to <strong>Completed</strong> automatically triggers the Post-Delivery Review & Loyalty workflow.
          </p>
        </div>
      </div>
    `;
  };

  modalOverlay.innerHTML = renderContent();
  document.body.appendChild(modalOverlay);

  const attachEvents = () => {
    const closeBtn = modalOverlay.querySelector('#order-close-btn');
    if (closeBtn) closeBtn.onclick = () => modalOverlay.remove();

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };

    const customerBtn = modalOverlay.querySelector('#btn-view-customer-profile');
    if (customerBtn) {
      customerBtn.onclick = () => {
        modalOverlay.remove();
        openCustomerModal(order.customer_id);
      };
    }

    modalOverlay.querySelectorAll('.status-toggle').forEach(btn => {
      btn.onclick = () => {
        const newStatus = btn.getAttribute('data-status');
        store.updateOrderStatus(order.id, newStatus);
        toast.show('WooCommerce Status Updated', `Order ${order.id} status changed to ${newStatus.toUpperCase()}`, 'success');
        modalOverlay.innerHTML = renderContent();
        attachEvents();
      };
    });
  };

  attachEvents();
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'completed': return 'badge-completed';
    case 'processing': return 'badge-processing';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-first-time';
  }
}
