// OmniPulse CRM — Main Application Controller

import { store } from './store.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderCustomersView } from './components/customersView.js';
import { renderOrdersView } from './components/ordersView.js';
import { renderWorkflowsView } from './components/workflowsView.js';
import { renderAnalyticsView } from './components/analyticsView.js';
import { renderSettingsView } from './components/settingsView.js';
import { openSimulatorModal } from './components/simulatorModal.js';
import { toast } from './components/toast.js';

let activeView = 'dashboard';
const contentContainer = document.getElementById('main-content');

function renderActiveView() {
  if (!contentContainer) return;

  switch (activeView) {
    case 'dashboard':
      renderDashboardView(contentContainer);
      break;
    case 'customers':
      renderCustomersView(contentContainer);
      break;
    case 'orders':
      renderOrdersView(contentContainer);
      break;
    case 'workflows':
      renderWorkflowsView(contentContainer);
      break;
    case 'analytics':
      renderAnalyticsView(contentContainer);
      break;
    case 'settings':
      renderSettingsView(contentContainer);
      break;
    default:
      renderDashboardView(contentContainer);
  }

  // Update navigation button active state
  document.querySelectorAll('.nav-links button').forEach(btn => {
    const view = btn.getAttribute('data-view');
    if (view === activeView) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Navigation event bindings
document.querySelectorAll('.nav-links button').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.getAttribute('data-view');
    if (view) {
      activeView = view;
      renderActiveView();
    }
  });
});

// Top bar controls
const topbarSimBtn = document.getElementById('topbar-sim-btn');
if (topbarSimBtn) {
  topbarSimBtn.addEventListener('click', () => {
    openSimulatorModal();
  });
}

const topbarSyncBtn = document.getElementById('topbar-sync-btn');
if (topbarSyncBtn) {
  topbarSyncBtn.addEventListener('click', () => {
    toast.show('WooCommerce Synchronized', 'Retrieved latest store events from WooCommerce REST API v3', 'success');
    renderActiveView();
  });
}

// Global search input
const globalSearch = document.getElementById('global-search-input');
if (globalSearch) {
  globalSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = globalSearch.value.trim();
      if (q) {
        activeView = 'customers';
        renderActiveView();
        const custSearch = document.getElementById('customer-search-input');
        if (custSearch) {
          custSearch.value = q;
          custSearch.dispatchEvent(new Event('input'));
        }
      }
    }
  });
}

// Subscribe to store updates for automatic reactivity
store.subscribe(() => {
  renderActiveView();
});

// Initial Render
renderActiveView();

console.log('OmniPulse CRM Initialized successfully.');
