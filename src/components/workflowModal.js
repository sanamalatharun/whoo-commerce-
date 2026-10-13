// Create Custom Automation Workflow Modal

import { store } from '../store.js';
import { toast } from './toast.js';

export function openWorkflowModal() {
  const existing = document.getElementById('wf-create-modal-overlay');
  if (existing) existing.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'wf-create-modal-overlay';
  modalOverlay.className = 'modal-overlay open';

  const render = () => {
    return `
      <div class="modal-content" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title" style="margin: 0;">⚡ Create Communication Workflow</h3>
            <p style="color: var(--text-muted); font-size: 0.84rem; margin-top: 4px;">
              Automate multi-channel customer messaging powered by WooCommerce lifecycle events.
            </p>
          </div>
          <button class="btn-close" id="wf-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Workflow Name</label>
            <input type="text" id="wf-name-input" placeholder="e.g., Summer VIP Welcome Bonus" value="High-Basket Thank You Campaign" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.9rem; margin-top: 4px;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Event Trigger</label>
              <select id="wf-trigger-select" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px;">
                <option value="order.created">WooCommerce Order Created</option>
                <option value="order.completed">WooCommerce Order Completed</option>
                <option value="customer.created">New Customer Registered</option>
                <option value="customer.inactive">Customer Inactive (> 30 Days)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Rule Condition</label>
              <select id="wf-condition-select" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px;">
                <option value="always">Always Trigger (Any Value)</option>
                <option value="order.total >= 100">Order Total >= $100</option>
                <option value="order.total >= 250">Order Total >= $250 (High Value)</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Action Type & Channel</label>
            <select id="wf-action-select" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px;">
              <option value="send_email">Transactional Email Notification</option>
              <option value="send_discount">Automated Discount Voucher Generator</option>
              <option value="sms_alert">SMS Delivery Notification</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Message Subject / Title</label>
            <input type="text" id="wf-subject-input" value="Your exclusive gift is waiting inside! ✨" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.9rem; margin-top: 4px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button class="btn btn-secondary" id="wf-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="wf-save-btn">
            Save & Activate Workflow
          </button>
        </div>
      </div>
    `;
  };

  modalOverlay.innerHTML = render();
  document.body.appendChild(modalOverlay);

  const attachEvents = () => {
    const closeBtn = modalOverlay.querySelector('#wf-close-btn');
    if (closeBtn) closeBtn.onclick = () => modalOverlay.remove();

    const cancelBtn = modalOverlay.querySelector('#wf-cancel-btn');
    if (cancelBtn) cancelBtn.onclick = () => modalOverlay.remove();

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };

    const saveBtn = modalOverlay.querySelector('#wf-save-btn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const name = modalOverlay.querySelector('#wf-name-input').value.trim();
        const trigger = modalOverlay.querySelector('#wf-trigger-select').value;
        const condition = modalOverlay.querySelector('#wf-condition-select').value;
        const action = modalOverlay.querySelector('#wf-action-select').value;
        const subject = modalOverlay.querySelector('#wf-subject-input').value.trim();

        if (!name) {
          toast.show('Validation Error', 'Please enter a workflow title.', 'warning');
          return;
        }

        store.addWorkflow({
          name,
          trigger,
          condition,
          action,
          subject,
          channel: action === 'sms_alert' ? 'SMS Gateway' : 'Transactional Email'
        });

        toast.show('Workflow Created', `Automation rule "${name}" is now active!`, 'success');
        modalOverlay.remove();
      };
    }
  };

  attachEvents();
}
