// Settings View (WooCommerce REST API & Integration Layer)

import { store } from '../store.js';
import { wooApi } from '../api.js';
import { toast } from './toast.js';

export function renderSettingsView(container) {
  const settings = store.settings;

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">WooCommerce Integration & API Settings</h2>
        <p class="page-subtitle">Configure live WooCommerce REST API v3 keys, webhook listeners, and synchronization parameters.</p>
      </div>
      <div>
        <span class="badge badge-loyal" style="font-size: 0.82rem; padding: 6px 12px;">
          🟢 ${settings.status}
        </span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
      <!-- Left: Credentials Form -->
      <div class="card" style="margin: 0;">
        <h3 class="card-title" style="margin-bottom: 20px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M12 2a10 10 0 0 0-7.07 17.07l-1.41 1.41a1 1 0 0 0 1.41 1.41l1.41-1.41A10 10 0 1 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"></path></svg>
          API v3 Credentials
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Store Base URL</label>
            <input type="text" id="cfg-url" value="${settings.storeUrl}" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px;">
            <div style="font-size: 0.74rem; color: var(--text-dim); margin-top: 3px;">Endpoint root for /wp-json/wc/v3</div>
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Consumer Key (ck_...)</label>
            <input type="text" id="cfg-key" value="${settings.consumerKey}" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px; font-family: monospace;">
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Consumer Secret (cs_...)</label>
            <input type="password" id="cfg-secret" value="${settings.consumerSecret}" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px; font-family: monospace;">
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Webhook Signature Secret</label>
            <input type="text" id="cfg-webhook" value="${settings.webhookSecret}" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 10px 12px; color: #ffffff; font-size: 0.88rem; margin-top: 4px; font-family: monospace;">
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="btn btn-secondary" id="btn-test-conn">
              🔍 Test Connection
            </button>
            <button class="btn btn-primary" id="btn-save-settings">
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Architecture & Webhook Documentation -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="card" style="margin: 0; background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.25);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #818cf8; margin-bottom: 8px;">
            📡 Dual-Mode Integration Architecture
          </h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
            OmniPulse supports both <strong>direct WooCommerce REST API sync</strong> and <strong>asynchronous Webhook ingestion</strong>.
          </p>
          <ul style="font-size: 0.8rem; color: #cbd5e1; padding-left: 18px; line-height: 1.6;">
            <li><strong>REST API Client:</strong> Pulls historic customers and orders on schedule.</li>
            <li><strong>Webhook Listener:</strong> Real-time triggers on <code>order.created</code>, <code>order.completed</code>, and <code>customer.created</code>.</li>
            <li><strong>Fallback Sandbox Mode:</strong> Built-in instant simulator ensures presentation continuity even without network dependencies during hackathon judging.</li>
          </ul>
        </div>

        <div class="card" style="margin: 0;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
            ⚠️ Reset & Demo Management
          </h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px;">
            Need to reset sample data back to the clean demonstration state for judges?
          </p>
          <button class="btn btn-secondary btn-sm" id="btn-reset-demo" style="border-color: rgba(244, 63, 94, 0.4); color: #fb7185;">
            Reset All Data to Factory Demo State
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  const saveBtn = container.querySelector('#btn-save-settings');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const storeUrl = container.querySelector('#cfg-url').value.trim();
      const consumerKey = container.querySelector('#cfg-key').value.trim();
      const consumerSecret = container.querySelector('#cfg-secret').value.trim();
      const webhookSecret = container.querySelector('#cfg-webhook').value.trim();

      store.updateSettings({ storeUrl, consumerKey, consumerSecret, webhookSecret });
      toast.show('Settings Saved', 'WooCommerce API credentials updated successfully.', 'success');
    };
  }

  const testBtn = container.querySelector('#btn-test-conn');
  if (testBtn) {
    testBtn.onclick = async () => {
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
      const storeUrl = container.querySelector('#cfg-url').value.trim();
      const consumerKey = container.querySelector('#cfg-key').value.trim();
      const consumerSecret = container.querySelector('#cfg-secret').value.trim();

      const res = await wooApi.testConnection(storeUrl, consumerKey, consumerSecret);
      testBtn.disabled = false;
      testBtn.textContent = '🔍 Test Connection';

      if (res.success) {
        toast.show('Connection Status', res.message, 'success');
      } else {
        toast.show('Connection Failed', res.message, 'warning');
      }
    };
  }

  const resetBtn = container.querySelector('#btn-reset-demo');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Reset all customers, orders, and workflows to default demo data?')) {
        store.resetToDefault();
        toast.show('Data Reset', 'Demo database restored to default state.', 'info');
        renderSettingsView(container);
      }
    };
  }
}
