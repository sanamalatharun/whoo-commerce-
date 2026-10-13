// Analytics & Customer Intelligence View

import { store } from '../store.js';
import { toast } from './toast.js';

export function renderAnalyticsView(container) {
  const analytics = store.getAnalyticsData();
  const metrics = store.getMetrics();

  const totalRev = parseFloat(metrics.totalRevenue || 1);

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Customer Analytics & Cohorts</h2>
        <p class="page-subtitle">Deep RFM customer segmentation, product category affinity, and retention matrix.</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-secondary btn-sm" id="btn-export-customers">
          📥 Export Customers (CSV)
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-export-orders">
          📥 Export Orders (CSV)
        </button>
      </div>
    </div>

    <!-- RFM Segmentation Grid -->
    <div style="margin-bottom: 28px;">
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
        <span>🎯</span>
        RFM Customer Segmentation Matrix
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <!-- VIP Card -->
        <div class="card" style="margin: 0; background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-vip">👑 VIP Champions</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #fbbf24; font-family: var(--font-heading);">${analytics.tierCounts.VIP}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Spend > $500 or 4+ orders. Account for 48% of gross store revenue.
          </p>
        </div>

        <!-- High Value Card -->
        <div class="card" style="margin: 0; background: rgba(6, 182, 212, 0.08); border-color: rgba(6, 182, 212, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-high-value">⭐ High Value</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #22d3ee; font-family: var(--font-heading);">${analytics.tierCounts['High Value']}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Single or repeat basket size > $250. Prime candidates for loyalty upgrade.
          </p>
        </div>

        <!-- Loyalists Card -->
        <div class="card" style="margin: 0; background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-loyal">🌿 Consistent Loyal</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #34d399; font-family: var(--font-heading);">${analytics.tierCounts.Loyal}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            2+ purchases with steady frequency. High organic referral potential.
          </p>
        </div>

        <!-- First-Time Card -->
        <div class="card" style="margin: 0; background: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-first-time">🌱 First-Time</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #a78bfa; font-family: var(--font-heading);">${analytics.tierCounts['First-Time']}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Recently completed 1st order. Onboarding workflow actively nurturing.
          </p>
        </div>

        <!-- At Risk Card -->
        <div class="card" style="margin: 0; background: rgba(244, 63, 94, 0.08); border-color: rgba(244, 63, 94, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-at-risk">⚠️ At Risk / Churn</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: #fb7185; font-family: var(--font-heading);">${analytics.tierCounts['At Risk']}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Inactive for > 60 days. Targeted by automated win-back discount rules.
          </p>
        </div>
      </div>
    </div>

    <!-- 2 Column Breakdown: Category Affinity & Fulfillment -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
      <!-- Product Category Revenue -->
      <div class="card" style="margin: 0;">
        <h3 class="card-title" style="margin-bottom: 20px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Revenue by Product Category Affinity
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${Object.entries(analytics.categoryRevenue).map(([cat, rev]) => {
            const pct = Math.min(100, Math.round((rev / totalRev) * 100));
            return `
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.86rem;">
                  <span style="font-weight: 600; color: #ffffff;">${cat}</span>
                  <span style="font-weight: 700; color: #818cf8; font-family: monospace;">$${rev.toFixed(2)} (${pct}%)</span>
                </div>
                <div style="height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
                  <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%); border-radius: 4px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Fulfillment Health -->
      <div class="card" style="margin: 0;">
        <h3 class="card-title" style="margin-bottom: 20px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          Fulfillment & Order Health
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #34d399;">Completed & Fulfilled</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Successfully delivered with zero returns</div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #34d399; font-family: var(--font-heading);">
              ${analytics.statusCounts.completed}
            </div>
          </div>

          <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #818cf8;">Processing / In Dispatch</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Awaiting warehouse carrier pickup</div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #818cf8; font-family: var(--font-heading);">
              ${analytics.statusCounts.processing}
            </div>
          </div>

          <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #fb7185;">Cancelled / Refunded</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Customer support retention engaged</div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #fb7185; font-family: var(--font-heading);">
              ${analytics.statusCounts.cancelled}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach CSV export triggers
  const expCust = container.querySelector('#btn-export-customers');
  if (expCust) {
    expCust.onclick = () => {
      store.exportCustomersCSV();
      toast.show('Export Successful', 'Customer directory exported to CSV file.', 'success');
    };
  }

  const expOrders = container.querySelector('#btn-export-orders');
  if (expOrders) {
    expOrders.onclick = () => {
      store.exportOrdersCSV();
      toast.show('Export Successful', 'WooCommerce orders exported to CSV file.', 'success');
    };
  }
}
