// Customer 360 Modal with AI Copilot & Order Timeline

import { store } from '../store.js';
import { AICopilot } from '../ai.js';
import { toast } from './toast.js';

export function openCustomerModal(customerId) {
  const customer = store.getCustomerById(customerId);
  if (!customer) return;

  const existing = document.getElementById('customer-modal-overlay');
  if (existing) existing.remove();

  const aiAnalysis = AICopilot.analyzeCustomer(customer);
  let currentTone = 'vip';
  let emailDraft = AICopilot.generateOutreachDraft(customer, currentTone);

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'customer-modal-overlay';
  modalOverlay.className = 'modal-overlay open';

  const renderContent = (activeTab = 'overview') => {
    return `
      <div class="modal-content" style="max-width: 840px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            <img src="${customer.avatar}" class="avatar" style="width: 52px; height: 52px; border: 2px solid var(--primary);" alt="${customer.name}">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h3 class="modal-title" style="margin: 0;">${customer.name}</h3>
                <span class="badge ${getBadgeClass(customer.rfm_tier)}">${customer.rfm_tier}</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.84rem; margin-top: 2px;">
                ${customer.email} • ${customer.phone}
              </p>
            </div>
          </div>
          <button class="btn-close" id="modal-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Quick Stats Banner -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; background: rgba(0,0,0,0.25); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Lifetime Spend</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: #ffffff; font-family: var(--font-heading);">$${customer.total_spent}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Total Orders</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-cyan); font-family: var(--font-heading);">${customer.orders_count}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Location</div>
            <div style="font-size: 0.95rem; font-weight: 600; color: #ffffff;">${customer.city || customer.country}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Churn Risk</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: ${aiAnalysis.churnRisk === 'High' ? '#fb7185' : '#34d399'};">
              ${aiAnalysis.churnRisk} (${aiAnalysis.riskScore}%)
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-header">
          <button class="tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">360° Profile</button>
          <button class="tab-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">WooCommerce Orders (${customer.recent_orders?.length || 0})</button>
          <button class="tab-btn ${activeTab === 'ai' ? 'active' : ''}" data-tab="ai">✨ AI Intelligence & Copilot</button>
          <button class="tab-btn ${activeTab === 'notes' ? 'active' : ''}" data-tab="notes">Internal Notes (${customer.notes?.length || 0})</button>
        </div>

        <!-- Tab 1: Overview -->
        <div class="tab-pane" id="tab-overview" style="display: ${activeTab === 'overview' ? 'block' : 'none'};">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="card" style="margin: 0; padding: 18px; background: rgba(255,255,255,0.02);">
              <h4 style="font-size: 0.92rem; color: #818cf8; margin-bottom: 12px;">Contact & Account Details</h4>
              <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Company:</strong> ${customer.company || 'Private Individual'}</p>
              <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Customer Since:</strong> ${customer.registered_at}</p>
              <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Last Active Store Visit:</strong> ${customer.last_active}</p>
              <p style="font-size: 0.85rem;"><strong>RFM Classification:</strong> ${customer.tag}</p>
            </div>
            <div class="card" style="margin: 0; padding: 18px; background: rgba(255,255,255,0.02);">
              <h4 style="font-size: 0.92rem; color: #818cf8; margin-bottom: 12px;">Shipping & Quick Actions</h4>
              <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Country:</strong> ${customer.country}</p>
              <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong>City / Region:</strong> ${customer.city}</p>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Synced from WooCommerce customer account.</p>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-sm btn-primary" id="btn-issue-voucher">
                  🎁 Issue 15% VIP Coupon
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Orders -->
        <div class="tab-pane" id="tab-orders" style="display: ${activeTab === 'orders' ? 'block' : 'none'};">
          ${customer.recent_orders && customer.recent_orders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${customer.recent_orders.map(o => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-weight: 700; color: #ffffff; font-family: monospace;">${o.id}</span>
                      <span class="badge ${getStatusBadgeClass(o.status)}">${o.status}</span>
                    </div>
                    <div style="font-weight: 700; color: #ffffff; font-family: var(--font-heading);">$${Number(o.total).toFixed(2)}</div>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                    Date: ${o.date} • Paid via ${o.payment_method}
                  </div>
                  <div style="font-size: 0.82rem; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px;">
                    <strong>Items:</strong> ${(o.items || []).map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              No past orders recorded in WooCommerce yet.
            </div>
          `}
        </div>

        <!-- Tab 3: AI Intelligence -->
        <div class="tab-pane" id="tab-ai" style="display: ${activeTab === 'ai' ? 'block' : 'none'};">
          <div class="ai-copilot-card">
            <div class="ai-header">
              <span class="ai-badge">AI Customer Insight</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Model: OmniPulse Smart Engine</span>
            </div>
            <div style="margin-bottom: 16px;">
              ${aiAnalysis.summary.map(s => `<p style="font-size: 0.86rem; margin-bottom: 6px; line-height: 1.5;">${s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`).join('')}
            </div>
          </div>

          <!-- Dynamic Email Generator -->
          <div class="card" style="margin: 0; padding: 20px; background: rgba(0,0,0,0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h4 style="font-size: 0.95rem; font-weight: 600; color: #ffffff;">Generate Tailored Outreach Email</h4>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm tone-btn ${currentTone === 'vip' ? 'btn-primary' : 'btn-secondary'}" data-tone="vip">VIP Concierge</button>
                <button class="btn btn-sm tone-btn ${currentTone === 'winback' ? 'btn-primary' : 'btn-secondary'}" data-tone="winback">Win-Back</button>
                <button class="btn btn-sm tone-btn ${currentTone === 'followup' ? 'btn-primary' : 'btn-secondary'}" data-tone="followup">Post-Delivery</button>
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase;">Subject Line</label>
              <input type="text" id="ai-email-subject" value="${emailDraft.subject}" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 8px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase;">Email Body</label>
              <textarea id="ai-email-body" rows="6" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-family: var(--font-body); font-size: 0.85rem; line-height: 1.5; margin-top: 4px; resize: vertical;">${emailDraft.body}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button class="btn btn-secondary btn-sm" id="btn-copy-email">
                📋 Copy Draft
              </button>
              <button class="btn btn-primary btn-sm" id="btn-send-email">
                🚀 Simulate Dispatch Email
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 4: Notes -->
        <div class="tab-pane" id="tab-notes" style="display: ${activeTab === 'notes' ? 'block' : 'none'};">
          <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px;">
              <input type="text" id="new-note-input" placeholder="Type an internal customer note (e.g., Prefers phone calls on Tuesdays)..." style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 10px 14px; color: #ffffff; font-size: 0.88rem;">
              <button class="btn btn-primary" id="btn-save-note">Add Note</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;" id="notes-list">
            ${customer.notes && customer.notes.length > 0 ? customer.notes.map(n => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px;">
                <p style="font-size: 0.88rem; color: #ffffff; margin-bottom: 4px;">${n.text}</p>
                <div style="font-size: 0.75rem; color: var(--text-dim);">By ${n.author} • ${n.date}</div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: 30px; color: var(--text-dim);">
                No notes logged yet. Add one above.
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  };

  modalOverlay.innerHTML = renderContent();
  document.body.appendChild(modalOverlay);

  // Attach interactive events
  const attachEvents = (currentTab = 'overview') => {
    // Close modal
    const closeBtn = modalOverlay.querySelector('#modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => modalOverlay.remove();
    }
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };

    // Tabs
    modalOverlay.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute('data-tab');
        modalOverlay.innerHTML = renderContent(tab);
        attachEvents(tab);
      };
    });

    // Tone switcher
    modalOverlay.querySelectorAll('.tone-btn').forEach(btn => {
      btn.onclick = () => {
        currentTone = btn.getAttribute('data-tone');
        emailDraft = AICopilot.generateOutreachDraft(customer, currentTone);
        const subjInput = modalOverlay.querySelector('#ai-email-subject');
        const bodyInput = modalOverlay.querySelector('#ai-email-body');
        if (subjInput) subjInput.value = emailDraft.subject;
        if (bodyInput) bodyInput.value = emailDraft.body;

        modalOverlay.querySelectorAll('.tone-btn').forEach(b => {
          b.className = b.getAttribute('data-tone') === currentTone ? 'btn btn-sm tone-btn btn-primary' : 'btn btn-sm tone-btn btn-secondary';
        });
      };
    });

    // Copy draft
    const copyBtn = modalOverlay.querySelector('#btn-copy-email');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const bodyInput = modalOverlay.querySelector('#ai-email-body');
        if (bodyInput) {
          navigator.clipboard.writeText(bodyInput.value);
          toast.show('Draft Copied', 'Outreach email copied to clipboard.', 'success');
        }
      };
    }

    // Send email simulation
    const sendBtn = modalOverlay.querySelector('#btn-send-email');
    if (sendBtn) {
      sendBtn.onclick = () => {
        toast.show('Email Dispatched', `AI communication sent to ${customer.email}!`, 'success');
        store.addCustomerNote(customer.id, `Dispatched outreach email: "${emailDraft.subject}"`, 'AI Outreach Engine');
        modalOverlay.innerHTML = renderContent('notes');
        attachEvents('notes');
      };
    }

    // Save note
    const saveNoteBtn = modalOverlay.querySelector('#btn-save-note');
    if (saveNoteBtn) {
      saveNoteBtn.onclick = () => {
        const input = modalOverlay.querySelector('#new-note-input');
        if (input && input.value.trim()) {
          store.addCustomerNote(customer.id, input.value.trim(), 'Current Agent');
          toast.show('Note Saved', 'Customer activity note updated.', 'success');
          modalOverlay.innerHTML = renderContent('notes');
          attachEvents('notes');
        }
      };
    }

    // Issue VIP Voucher
    const voucherBtn = modalOverlay.querySelector('#btn-issue-voucher');
    if (voucherBtn) {
      voucherBtn.onclick = () => {
        const voucher = store.issueCustomerDiscount(customer.id);
        toast.show('Voucher Generated', `Coupon code [${voucher.code}] (15% OFF) sent to ${customer.email}!`, 'success');
        modalOverlay.innerHTML = renderContent('notes');
        attachEvents('notes');
      };
    }
  };

  attachEvents();
}

function getBadgeClass(tier) {
  switch (tier) {
    case 'VIP': return 'badge-vip';
    case 'High Value': return 'badge-high-value';
    case 'Loyal': return 'badge-loyal';
    case 'First-Time': return 'badge-first-time';
    default: return 'badge-at-risk';
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'completed': return 'badge-completed';
    case 'processing': return 'badge-processing';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-first-time';
  }
}
