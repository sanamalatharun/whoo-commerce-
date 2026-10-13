// Workflows View (Automated Communication Engine)

import { store } from '../store.js';
import { openWorkflowModal } from './workflowModal.js';
import { toast } from './toast.js';

export function renderWorkflowsView(container) {
  const workflows = store.workflows;
  const logs = store.logs;

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Automated Communication Workflows</h2>
        <p class="page-subtitle">Rule-based event triggers that automatically engage customers via email, SMS, and loyalty rewards.</p>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-create-wf">
          ⚡ + Create New Workflow
        </button>
      </div>
    </div>

    <!-- Active Workflows Grid -->
    <div class="workflow-grid">
      ${workflows.map(wf => `
        <div class="workflow-card ${wf.enabled ? '' : 'disabled'}" data-wf-id="${wf.id}">
          <div class="workflow-top">
            <h3 class="workflow-title">${wf.name}</h3>
            <label class="switch">
              <input type="checkbox" class="wf-toggle" data-wf-id="${wf.id}" ${wf.enabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px;">
            ${wf.description}
          </p>

          <div class="wf-steps">
            <div class="wf-step">
              <span class="wf-step-label">Trigger:</span>
              <span class="wf-tag" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">${wf.trigger}</span>
            </div>
            <div class="wf-step">
              <span class="wf-step-label">Condition:</span>
              <span class="wf-tag" style="background: rgba(6, 182, 212, 0.2); color: #22d3ee;">${wf.condition}</span>
            </div>
            <div class="wf-step">
              <span class="wf-step-label">Action:</span>
              <span class="wf-tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">${wf.actionDetails.channel || wf.action}</span>
            </div>
          </div>

          <div style="font-size: 0.78rem; color: #ffffff; background: rgba(0,0,0,0.25); padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            📩 <em>"${wf.actionDetails.subject || 'Automated message'}"</em>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Fired <strong>${wf.executions_count || 0}</strong> times</span>
            <span>Last: ${wf.last_triggered || 'Recently'}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Workflow Execution Audit Trail -->
    <div class="card" style="margin: 0;">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Execution Audit Log
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Traceability log of automated actions dispatched to customers.</p>
        </div>
        <span class="badge badge-loyal">${logs.length} Logged Events</span>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Workflow Rule</th>
              <th>Event</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Message Dispatched</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(log => `
              <tr>
                <td style="font-family: monospace; font-size: 0.78rem; color: var(--text-dim);">${log.timestamp}</td>
                <td style="font-weight: 600; color: #ffffff;">${log.workflowName}</td>
                <td><span class="wf-tag">${log.event}</span></td>
                <td style="font-size: 0.84rem; color: #e2e8f0;">${log.target}</td>
                <td><span class="badge badge-completed">${log.status}</span></td>
                <td style="font-size: 0.8rem; color: var(--text-muted); max-width: 250px;">${log.message}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach handlers
  const createBtn = container.querySelector('#btn-create-wf');
  if (createBtn) {
    createBtn.onclick = () => openWorkflowModal();
  }

  container.querySelectorAll('.wf-toggle').forEach(toggle => {
    toggle.onchange = (e) => {
      const id = toggle.getAttribute('data-wf-id');
      const isEnabled = store.toggleWorkflow(id);
      toast.show('Workflow Updated', `Workflow has been ${isEnabled ? 'ENABLED' : 'DISABLED'}`, 'info');
      renderWorkflowsView(container);
    };
  });
}
