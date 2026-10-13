// Live WooCommerce Webhook Simulator Modal

import { wooApi } from '../api.js';
import { toast } from './toast.js';

export function openSimulatorModal() {
  const existing = document.getElementById('sim-modal-overlay');
  if (existing) existing.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'sim-modal-overlay';
  modalOverlay.className = 'modal-overlay open';

  let currentPayload = {
    event: 'order.created',
    data: {
      id: `WC-${Math.floor(8930 + Math.random() * 500)}`,
      customer_name: 'Gabriel Santos',
      customer_email: 'gabriel.santos@inboxmail.com',
      total: 320.00,
      currency: 'USD',
      items: [{ name: 'Top-Grain Leather Weekender Bag', quantity: 1, price: 320.00 }]
    }
  };

  const render = () => {
    return `
      <div class="modal-content" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">⚡</span>
              <h3 class="modal-title" style="margin: 0;">WooCommerce Webhook Event Simulator</h3>
            </div>
            <p style="color: var(--text-muted); font-size: 0.84rem; margin-top: 4px;">
              Simulate live real-time webhooks fired from WooCommerce checkout or backend actions.
            </p>
          </div>
          <button class="btn-close" id="sim-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Choose Webhook Preset:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
            <button class="btn btn-secondary sim-preset-btn" data-type="new-order">
              🛒 Standard Order ($149)
            </button>
            <button class="btn btn-secondary sim-preset-btn" data-type="vip-order">
              👑 High-Value VIP Order ($495)
            </button>
            <button class="btn btn-secondary sim-preset-btn" data-type="new-user">
              👤 New Account Registered
            </button>
            <button class="btn btn-secondary sim-preset-btn" data-type="custom-order">
              🎲 Random Customer Purchase
            </button>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Live Webhook Ingestion Payload (JSON):</label>
            <span style="font-size: 0.75rem; color: var(--accent-emerald); font-family: monospace;">POST /wp-json/omnipulse/v1/webhook</span>
          </div>
          <pre id="json-preview" style="background: rgba(0, 0, 0, 0.45); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 14px; color: #a5b4fc; font-size: 0.82rem; font-family: 'Courier New', Courier, monospace; max-height: 220px; overflow-y: auto;">${JSON.stringify(currentPayload, null, 2)}</pre>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button class="btn btn-secondary" id="sim-cancel-btn">Close</button>
          <button class="btn btn-primary" id="sim-dispatch-btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            🚀 Fire Webhook & Trigger Workflows
          </button>
        </div>
      </div>
    `;
  };

  modalOverlay.innerHTML = render();
  document.body.appendChild(modalOverlay);

  const attachEvents = () => {
    const closeBtn = modalOverlay.querySelector('#sim-close-btn');
    if (closeBtn) closeBtn.onclick = () => modalOverlay.remove();

    const cancelBtn = modalOverlay.querySelector('#sim-cancel-btn');
    if (cancelBtn) cancelBtn.onclick = () => modalOverlay.remove();

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };

    modalOverlay.querySelectorAll('.sim-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const type = btn.getAttribute('data-type');
        if (type === 'new-order') {
          currentPayload = {
            event: 'order.created',
            data: {
              id: `WC-${Math.floor(8930 + Math.random() * 500)}`,
              customer_name: 'Julian Thorne',
              customer_email: 'julian.thorne@inboxmail.com',
              total: 149.00,
              items: [{ name: 'Ergonomic Mechanical Keyboard (RGB Pro)', quantity: 1, price: 149.00 }]
            }
          };
        } else if (type === 'vip-order') {
          currentPayload = {
            event: 'order.created',
            data: {
              id: `WC-${Math.floor(8930 + Math.random() * 500)}`,
              customer_name: 'Lady Genevieve',
              customer_email: 'genevieve.l@couture.co.uk',
              total: 495.00,
              items: [{ name: 'Top-Grain Leather Weekender Bag', quantity: 1, price: 495.00 }]
            }
          };
        } else if (type === 'new-user') {
          currentPayload = {
            event: 'customer.created',
            data: {
              name: 'Oliver Hansen',
              email: `oliver.${Date.now() % 1000}@osloenterprises.no`,
              company: 'Oslo Enterprises',
              city: 'Oslo',
              country: 'Norway'
            }
          };
        } else {
          currentPayload = {
            event: 'order.created',
            data: {
              id: `WC-${Math.floor(8930 + Math.random() * 500)}`,
              customer_name: 'Elena Rostova',
              customer_email: 'elena.rostova@designlab.de',
              total: 215.00,
              items: [{ name: 'Nordic Minimalist Oak Desk Lamp', quantity: 1, price: 160.00 }, { name: 'Solid Walnut Wrist Rest', quantity: 1, price: 55.00 }]
            }
          };
        }
        const pre = modalOverlay.querySelector('#json-preview');
        if (pre) pre.textContent = JSON.stringify(currentPayload, null, 2);
      };
    });

    const dispatchBtn = modalOverlay.querySelector('#sim-dispatch-btn');
    if (dispatchBtn) {
      dispatchBtn.onclick = () => {
        wooApi.triggerSimulatedWebhook(currentPayload.event, currentPayload.data);
        toast.show('Webhook Ingested', `Event [${currentPayload.event}] processed successfully!`, 'success');
        modalOverlay.remove();
      };
    }
  };

  attachEvents();
}
