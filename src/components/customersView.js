// Customers View (Customer 360 Management)

import { store } from '../store.js';
import { openCustomerModal } from './customerModal.js';

let currentFilter = 'ALL';
let searchQuery = '';

export function renderCustomersView(container) {
  const customers = store.getCustomersWithStats();

  const filtered = customers.filter(c => {
    // Filter by tier
    if (currentFilter !== 'ALL') {
      if (currentFilter === 'VIP' && c.rfm_tier !== 'VIP') return false;
      if (currentFilter === 'HIGH_VALUE' && c.rfm_tier !== 'High Value') return false;
      if (currentFilter === 'LOYAL' && c.rfm_tier !== 'Loyal') return false;
      if (currentFilter === 'FIRST_TIME' && c.rfm_tier !== 'First-Time') return false;
      if (currentFilter === 'AT_RISK' && c.rfm_tier !== 'At Risk') return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (c.name || '').toLowerCase().includes(q);
      const matchEmail = (c.email || '').toLowerCase().includes(q);
      const matchCompany = (c.company || '').toLowerCase().includes(q);
      const matchCity = (c.city || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchCompany || matchCity;
    }
    return true;
  });

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Customer 360° Directory</h2>
        <p class="page-subtitle">Unified customer identities synchronized directly from WooCommerce accounts & checkouts.</p>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted);">
        Showing <strong>${filtered.length}</strong> of ${customers.length} registered customers
      </div>
    </div>

    <!-- Filter & Search Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-sm filter-btn ${currentFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" data-filter="ALL">All Customers</button>
        <button class="btn btn-sm filter-btn ${currentFilter === 'VIP' ? 'btn-primary' : 'btn-secondary'}" data-filter="VIP">👑 VIP</button>
        <button class="btn btn-sm filter-btn ${currentFilter === 'HIGH_VALUE' ? 'btn-primary' : 'btn-secondary'}" data-filter="HIGH_VALUE">⭐ High Value</button>
        <button class="btn btn-sm filter-btn ${currentFilter === 'LOYAL' ? 'btn-primary' : 'btn-secondary'}" data-filter="LOYAL">🌿 Loyal</button>
        <button class="btn btn-sm filter-btn ${currentFilter === 'FIRST_TIME' ? 'btn-primary' : 'btn-secondary'}" data-filter="FIRST_TIME">🌱 First-Time</button>
        <button class="btn btn-sm filter-btn ${currentFilter === 'AT_RISK' ? 'btn-primary' : 'btn-secondary'}" data-filter="AT_RISK">⚠️ At Risk</button>
      </div>

      <div class="search-box" style="width: 280px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="customer-search-input" placeholder="Search by name, email, city..." value="${searchQuery}">
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card" style="margin: 0;">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Location</th>
              <th>WooCommerce Orders</th>
              <th>Total Spend</th>
              <th>RFM Tier</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 ? filtered.map(c => `
              <tr class="customer-row" data-customer-id="${c.id}">
                <td>
                  <div class="customer-cell">
                    <img src="${c.avatar}" class="avatar" alt="${c.name}">
                    <div>
                      <div class="customer-name">${c.name}</div>
                      <div class="customer-sub">${c.email} • ${c.company || 'Direct Buyer'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="color: #ffffff; font-size: 0.85rem;">${c.city || 'Online Store'}</div>
                  <div style="font-size: 0.74rem; color: var(--text-dim);">${c.country}</div>
                </td>
                <td style="font-weight: 600; color: #ffffff;">
                  ${c.orders_count} orders
                </td>
                <td>
                  <div style="font-family: var(--font-heading); font-weight: 700; color: var(--accent-cyan); font-size: 1rem;">
                    $${c.total_spent}
                  </div>
                </td>
                <td>
                  <span class="badge ${getBadgeClass(c.rfm_tier)}">${c.rfm_tier}</span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm inspect-btn" data-customer-id="${c.id}">
                    Inspect 360°
                  </button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-dim);">
                  No customers found matching the selected filter.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach search & filter handlers
  const searchInput = container.querySelector('#customer-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      searchQuery = e.target.value;
      renderCustomersView(container);
    };
  }

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.getAttribute('data-filter');
      renderCustomersView(container);
    };
  });

  container.querySelectorAll('.customer-row, .inspect-btn').forEach(elem => {
    elem.onclick = (e) => {
      const id = elem.getAttribute('data-customer-id');
      if (id) {
        e.stopPropagation();
        openCustomerModal(id);
      }
    };
  });
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
