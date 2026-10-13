// Reactive Store & WooCommerce Data Layer for OmniPulse CRM

const STORAGE_KEY = 'omnipulse_crm_state_v1';

const INITIAL_CUSTOMERS = [
  {
    id: 101,
    name: 'Sophia Reynolds',
    email: 'sophia.reynolds@example.com',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    company: 'Studio Lumina',
    country: 'United States',
    city: 'San Francisco, CA',
    registered_at: '2024-03-12',
    last_active: '2026-10-12',
    rfm_tier: 'VIP',
    tag: 'VIP Customer',
    notes: [
      { id: 1, text: 'Prefers carbon-neutral packaging. Loves limited edition releases.', author: 'Alex (Support)', date: '2026-09-14' },
      { id: 2, text: 'Enquired about upcoming winter catalog.', author: 'System', date: '2026-10-02' }
    ]
  },
  {
    id: 102,
    name: 'Marcus Vance',
    email: 'marcus.v@technova.io',
    phone: '+1 (555) 789-4321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'TechNova Global',
    country: 'Canada',
    city: 'Toronto, ON',
    registered_at: '2024-06-20',
    last_active: '2026-10-10',
    rfm_tier: 'High Value',
    tag: 'High Value',
    notes: [
      { id: 1, text: 'Corporate bulk purchaser. Inquire about annual contract discounts.', author: 'Priya (Sales)', date: '2026-08-11' }
    ]
  },
  {
    id: 103,
    name: 'Elena Rostova',
    email: 'elena.rostova@designlab.de',
    phone: '+49 170 555 4321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'DesignLab Berlin',
    country: 'Germany',
    city: 'Berlin',
    registered_at: '2024-09-01',
    last_active: '2026-10-09',
    rfm_tier: 'Loyal',
    tag: 'Loyal Customer',
    notes: []
  },
  {
    id: 104,
    name: 'David Chen',
    email: 'david.chen@apexhardware.com',
    phone: '+1 (555) 341-9876',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    company: 'Apex Hardware',
    country: 'United States',
    city: 'Austin, TX',
    registered_at: '2025-01-15',
    last_active: '2026-07-20',
    rfm_tier: 'At Risk',
    tag: 'At Risk / Churn',
    notes: [
      { id: 1, text: 'Haven’t ordered in over 80 days. Win-back campaign triggered.', author: 'System', date: '2026-08-30' }
    ]
  },
  {
    id: 105,
    name: 'Amara Okafor',
    email: 'amara.okafor@stride.ng',
    phone: '+234 803 123 4567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Stride Logistics',
    country: 'Nigeria',
    city: 'Lagos',
    registered_at: '2025-08-10',
    last_active: '2026-10-13',
    rfm_tier: 'First-Time',
    tag: 'First-Time Buyer',
    notes: [
      { id: 1, text: 'Found us via Instagram Summer Campaign.', author: 'System', date: '2026-10-13' }
    ]
  },
  {
    id: 106,
    name: 'Liam Gallagher',
    email: 'liam.g@celticcraft.ie',
    phone: '+353 87 654 3210',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    company: 'Celtic Craft',
    country: 'Ireland',
    city: 'Dublin',
    registered_at: '2025-05-18',
    last_active: '2026-09-28',
    rfm_tier: 'Loyal',
    tag: 'Loyal Customer',
    notes: []
  },
  {
    id: 107,
    name: 'Chloe Dubois',
    email: 'chloe.dubois@parislux.fr',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    company: 'Paris Lux Atelier',
    country: 'France',
    city: 'Paris',
    registered_at: '2025-11-04',
    last_active: '2026-10-11',
    rfm_tier: 'VIP',
    tag: 'VIP Customer',
    notes: [
      { id: 1, text: 'Sent handwritten note with Order #WC-8921.', author: 'Alex (Support)', date: '2026-10-11' }
    ]
  },
  {
    id: 108,
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@neo-kyoto.jp',
    phone: '+81 90 1234 5678',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    company: 'Neo Kyoto Dynamics',
    country: 'Japan',
    city: 'Kyoto',
    registered_at: '2026-02-19',
    last_active: '2026-08-05',
    rfm_tier: 'At Risk',
    tag: 'At Risk / Churn',
    notes: []
  }
];

const INITIAL_ORDERS = [
  {
    id: 'WC-8925',
    customer_id: 105,
    customer_name: 'Amara Okafor',
    customer_email: 'amara.okafor@stride.ng',
    total: 189.50,
    status: 'processing',
    payment_method: 'Stripe Credit Card',
    date: '2026-10-13 18:42',
    currency: 'USD',
    shipping_address: 'Plot 14 Victoria Island, Lagos, Nigeria',
    items: [
      { id: 'SKU-770', name: 'Ergonomic Mechanical Keyboard (RGB Pro)', quantity: 1, price: 149.00 },
      { id: 'SKU-102', name: 'Custom Coiled Aviator Cable (Midnight Blue)', quantity: 1, price: 40.50 }
    ]
  },
  {
    id: 'WC-8924',
    customer_id: 101,
    customer_name: 'Sophia Reynolds',
    customer_email: 'sophia.reynolds@example.com',
    total: 420.00,
    status: 'completed',
    payment_method: 'Apple Pay',
    date: '2026-10-12 14:15',
    currency: 'USD',
    shipping_address: '450 Mission St, San Francisco, CA 94105',
    items: [
      { id: 'SKU-890', name: 'Nordic Minimalist Oak Desk Lamp', quantity: 2, price: 160.00 },
      { id: 'SKU-441', name: 'Italian Ceramic Pour-Over Set', quantity: 1, price: 100.00 }
    ]
  },
  {
    id: 'WC-8923',
    customer_id: 107,
    customer_name: 'Chloe Dubois',
    customer_email: 'chloe.dubois@parislux.fr',
    total: 615.00,
    status: 'completed',
    payment_method: 'PayPal Express',
    date: '2026-10-11 09:30',
    currency: 'USD',
    shipping_address: '12 Rue de la Paix, 75002 Paris, France',
    items: [
      { id: 'SKU-992', name: 'Top-Grain Leather Weekender Bag', quantity: 1, price: 495.00 },
      { id: 'SKU-312', name: 'Brass Luggage Tag & Key Fob', quantity: 2, price: 60.00 }
    ]
  },
  {
    id: 'WC-8922',
    customer_id: 102,
    customer_name: 'Marcus Vance',
    customer_email: 'marcus.v@technova.io',
    total: 350.00,
    status: 'completed',
    payment_method: 'WooCommerce Invoicing',
    date: '2026-10-10 16:40',
    currency: 'USD',
    shipping_address: '88 King St W, Toronto, ON M5H 1J9, Canada',
    items: [
      { id: 'SKU-612', name: 'Smart Noise-Canceling Conference Speaker', quantity: 1, price: 280.00 },
      { id: 'SKU-105', name: 'Magnetic Desk Cable Organizers (Pack of 4)', quantity: 2, price: 35.00 }
    ]
  },
  {
    id: 'WC-8921',
    customer_id: 103,
    customer_name: 'Elena Rostova',
    customer_email: 'elena.rostova@designlab.de',
    total: 135.00,
    status: 'completed',
    payment_method: 'Klarna Pay Now',
    date: '2026-10-09 11:22',
    currency: 'USD',
    shipping_address: 'Friedrichstraße 180, 10117 Berlin, Germany',
    items: [
      { id: 'SKU-204', name: 'Wool Felt Desk Mat (Charcoal Grey)', quantity: 1, price: 75.00 },
      { id: 'SKU-205', name: 'Solid Walnut Wrist Rest', quantity: 1, price: 60.00 }
    ]
  },
  {
    id: 'WC-8920',
    customer_id: 106,
    customer_name: 'Liam Gallagher',
    customer_email: 'liam.g@celticcraft.ie',
    total: 210.00,
    status: 'completed',
    payment_method: 'Stripe Credit Card',
    date: '2026-09-28 13:05',
    currency: 'USD',
    shipping_address: '24 Grafton Street, Dublin 2, Ireland',
    items: [
      { id: 'SKU-770', name: 'Ergonomic Mechanical Keyboard (RGB Pro)', quantity: 1, price: 149.00 },
      { id: 'SKU-205', name: 'Solid Walnut Wrist Rest', quantity: 1, price: 61.00 }
    ]
  },
  {
    id: 'WC-8919',
    customer_id: 101,
    customer_name: 'Sophia Reynolds',
    customer_email: 'sophia.reynolds@example.com',
    total: 310.00,
    status: 'completed',
    payment_method: 'Apple Pay',
    date: '2026-09-14 17:10',
    currency: 'USD',
    shipping_address: '450 Mission St, San Francisco, CA 94105',
    items: [
      { id: 'SKU-890', name: 'Nordic Minimalist Oak Desk Lamp', quantity: 1, price: 160.00 },
      { id: 'SKU-770', name: 'Ergonomic Mechanical Keyboard (RGB Pro)', quantity: 1, price: 150.00 }
    ]
  },
  {
    id: 'WC-8918',
    customer_id: 104,
    customer_name: 'David Chen',
    customer_email: 'david.chen@apexhardware.com',
    total: 95.00,
    status: 'cancelled',
    payment_method: 'Stripe Credit Card',
    date: '2026-07-20 10:11',
    currency: 'USD',
    shipping_address: '1100 Congress Ave, Austin, TX 78701',
    items: [
      { id: 'SKU-441', name: 'Italian Ceramic Pour-Over Set', quantity: 1, price: 95.00 }
    ]
  },
  {
    id: 'WC-8917',
    customer_id: 108,
    customer_name: 'Kenji Takahashi',
    customer_email: 'kenji.takahashi@neo-kyoto.jp',
    total: 480.00,
    status: 'completed',
    payment_method: 'Stripe Credit Card',
    date: '2026-08-05 14:50',
    currency: 'USD',
    shipping_address: 'Karasuma Dori, Nakagyo-ku, Kyoto 604-8152, Japan',
    items: [
      { id: 'SKU-992', name: 'Top-Grain Leather Weekender Bag', quantity: 1, price: 480.00 }
    ]
  }
];

const INITIAL_WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'VIP First-Class Onboarding',
    description: 'Triggered when a customer reaches VIP status or spends over $300 in a single order.',
    trigger: 'order.created',
    condition: 'order.total >= 300',
    action: 'send_email',
    actionDetails: {
      subject: 'Welcome to the VIP Circle — Exclusive Concierge Access Inside 👑',
      channel: 'Email + Agent Task',
      template: 'vip_welcome'
    },
    enabled: true,
    executions_count: 14,
    last_triggered: '2026-10-12 14:15'
  },
  {
    id: 'wf-2',
    name: 'Post-Delivery Review & Loyalty Boost',
    description: 'Automatically follow up 48 hours after WooCommerce order status updates to Completed.',
    trigger: 'order.completed',
    condition: 'always',
    action: 'send_email',
    actionDetails: {
      subject: 'How is your new purchase treating you? Claim 100 reward points 🌟',
      channel: 'Transactional Email',
      template: 'review_request'
    },
    enabled: true,
    executions_count: 38,
    last_triggered: '2026-10-12 15:30'
  },
  {
    id: 'wf-3',
    name: 'New Buyer Welcome & Care Guide',
    description: 'Send onboarding message and product care guides to brand new WooCommerce customers.',
    trigger: 'customer.created',
    condition: 'always',
    action: 'send_email',
    actionDetails: {
      subject: 'Welcome to the Family! Here is 10% off your next craft ✨',
      channel: 'Email + SMS Notification',
      template: 'first_buyer_welcome'
    },
    enabled: true,
    executions_count: 52,
    last_triggered: '2026-10-13 18:42'
  },
  {
    id: 'wf-4',
    name: 'Win-Back Churn Prevention',
    description: 'Trigger an exclusive re-engagement incentive for high-value customers inactive for 45+ days.',
    trigger: 'customer.inactive',
    condition: 'inactive_days >= 45',
    action: 'send_discount',
    actionDetails: {
      subject: 'We miss you! Take $25 off your next order with code COMEBACK25',
      channel: 'Automated Retention Campaign',
      template: 'churn_winback'
    },
    enabled: true,
    executions_count: 8,
    last_triggered: '2026-10-08 09:10'
  }
];

const INITIAL_LOGS = [
  {
    id: 'log-101',
    workflowId: 'wf-3',
    workflowName: 'New Buyer Welcome & Care Guide',
    event: 'customer.created',
    target: 'Amara Okafor (amara.okafor@stride.ng)',
    status: 'SUCCESS',
    timestamp: '2026-10-13 18:42:33',
    message: 'Welcome email & 10% coupon dispatched. Delivery confirmed by mail server.'
  },
  {
    id: 'log-102',
    workflowId: 'wf-1',
    workflowName: 'VIP First-Class Onboarding',
    event: 'order.created',
    target: 'Sophia Reynolds (sophia.reynolds@example.com)',
    status: 'SUCCESS',
    timestamp: '2026-10-12 14:15:02',
    message: 'Triggered by Order #WC-8924 ($420.00). VIP concierge email dispatched.'
  },
  {
    id: 'log-103',
    workflowId: 'wf-2',
    workflowName: 'Post-Delivery Review & Loyalty Boost',
    event: 'order.completed',
    target: 'Chloe Dubois (chloe.dubois@parislux.fr)',
    status: 'SUCCESS',
    timestamp: '2026-10-11 10:00:15',
    message: 'Order #WC-8923 marked Completed. Review invite & 100 loyalty points queued.'
  }
];

class Store {
  constructor() {
    this.listeners = new Set();
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.customers = parsed.customers || INITIAL_CUSTOMERS;
        this.orders = parsed.orders || INITIAL_ORDERS;
        this.workflows = parsed.workflows || INITIAL_WORKFLOWS;
        this.logs = parsed.logs || INITIAL_LOGS;
        this.settings = parsed.settings || this.getDefaultSettings();
        return;
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage, using seed data', e);
    }

    this.customers = [...INITIAL_CUSTOMERS];
    this.orders = [...INITIAL_ORDERS];
    this.workflows = [...INITIAL_WORKFLOWS];
    this.logs = [...INITIAL_LOGS];
    this.settings = this.getDefaultSettings();
    this.saveState();
  }

  getDefaultSettings() {
    return {
      storeUrl: 'https://demo.woostore.example.com',
      consumerKey: 'ck_7b9f84a1e948c8e23419bb60b134d1',
      consumerSecret: 'cs_38a0f9c2d765899b1a039d91ef871b',
      webhookSecret: 'whsec_99a8b1c2d3e4f5',
      syncInterval: '15m',
      status: 'Connected (Live Simulator Mode)',
      lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        customers: this.customers,
        orders: this.orders,
        workflows: this.workflows,
        logs: this.logs,
        settings: this.settings
      }));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const callback of this.listeners) {
      try {
        callback(this);
      } catch (e) {
        console.error('Error in store subscriber:', e);
      }
    }
  }

  // --- Computed Metrics ---
  getMetrics() {
    const totalRevenue = this.orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter(o => o.status === 'completed').length;
    const activeCustomers = this.customers.length;
    const aov = totalOrders > 0 ? (totalRevenue / (totalOrders - this.orders.filter(o => o.status === 'cancelled').length || 1)) : 0;

    const vipCustomers = this.customers.filter(c => c.rfm_tier === 'VIP').length;
    const activeWorkflowsCount = this.workflows.filter(w => w.enabled).length;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      completedOrders,
      activeCustomers,
      aov: aov.toFixed(2),
      vipCustomers,
      activeWorkflowsCount
    };
  }

  // --- Customer 360 Helpers ---
  getCustomersWithStats() {
    return this.customers.map(c => {
      const customerOrders = this.orders.filter(o => o.customer_id === c.id || o.customer_email.toLowerCase() === c.email.toLowerCase());
      const spent = customerOrders
        .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, o) => sum + Number(o.total || 0), 0);
      
      const ordersCount = customerOrders.length;
      
      // Auto-recalculate RFM Tier if dynamic
      let tier = c.rfm_tier;
      if (spent >= 500 || ordersCount >= 4) {
        tier = 'VIP';
      } else if (spent >= 250) {
        tier = 'High Value';
      } else if (ordersCount >= 2) {
        tier = 'Loyal';
      } else if (ordersCount === 1) {
        tier = 'First-Time';
      }

      return {
        ...c,
        total_spent: spent.toFixed(2),
        orders_count: ordersCount,
        rfm_tier: tier,
        recent_orders: customerOrders
      };
    });
  }

  getCustomerById(id) {
    const list = this.getCustomersWithStats();
    return list.find(c => c.id === Number(id));
  }

  addCustomerNote(customerId, text, author = 'Agent') {
    const customer = this.customers.find(c => c.id === Number(customerId));
    if (!customer) return false;
    if (!customer.notes) customer.notes = [];
    customer.notes.unshift({
      id: Date.now(),
      text,
      author,
      date: new Date().toISOString().split('T')[0]
    });
    this.saveState();
    return true;
  }

  updateCustomerTag(customerId, newTag, newTier) {
    const customer = this.customers.find(c => c.id === Number(customerId));
    if (!customer) return false;
    customer.tag = newTag;
    if (newTier) customer.rfm_tier = newTier;
    this.saveState();
    return true;
  }

  // --- Orders & Webhook Processing ---
  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;
    const oldStatus = order.status;
    order.status = newStatus;

    // Check workflows for order status changes
    this.processWorkflows('order.status_changed', { order, oldStatus, newStatus });
    if (newStatus === 'completed') {
      this.processWorkflows('order.completed', { order });
    } else if (newStatus === 'cancelled') {
      this.processWorkflows('order.cancelled', { order });
    }

    this.saveState();
    return order;
  }

  // Ingests incoming WooCommerce webhook payload or simulator event
  ingestWebhookEvent(eventType, payload) {
    let affectedCustomer = null;
    let affectedOrder = null;

    if (eventType === 'order.created' || eventType === 'order.updated') {
      const orderData = payload.order || payload;
      
      // Match or create customer
      let customer = this.customers.find(c => c.email.toLowerCase() === (orderData.customer_email || '').toLowerCase());
      if (!customer) {
        customer = {
          id: Date.now() % 10000,
          name: orderData.customer_name || 'New Customer',
          email: orderData.customer_email || `customer${Date.now()}@example.com`,
          phone: orderData.customer_phone || '+1 (555) 000-0000',
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          company: 'Direct Consumer',
          country: 'United States',
          city: 'New York, NY',
          registered_at: new Date().toISOString().split('T')[0],
          last_active: new Date().toISOString().split('T')[0],
          rfm_tier: 'First-Time',
          tag: 'First-Time Buyer',
          notes: [{ id: Date.now(), text: 'Customer created via WooCommerce webhook checkout.', author: 'WooCommerce Webhook', date: new Date().toISOString().split('T')[0] }]
        };
        this.customers.unshift(customer);
        this.processWorkflows('customer.created', { customer });
      }

      const existingOrderIndex = this.orders.findIndex(o => o.id === orderData.id);
      const formattedOrder = {
        id: orderData.id || `WC-${Math.floor(8930 + Math.random() * 500)}`,
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: customer.email,
        total: Number(orderData.total || 149.00),
        status: orderData.status || 'processing',
        payment_method: orderData.payment_method || 'WooCommerce Payments',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        currency: orderData.currency || 'USD',
        shipping_address: orderData.shipping_address || `${customer.city}, ${customer.country}`,
        items: orderData.items || [
          { id: 'SKU-770', name: 'Ergonomic Mechanical Keyboard (RGB Pro)', quantity: 1, price: 149.00 }
        ]
      };

      if (existingOrderIndex >= 0) {
        this.orders[existingOrderIndex] = formattedOrder;
      } else {
        this.orders.unshift(formattedOrder);
      }

      affectedCustomer = customer;
      affectedOrder = formattedOrder;

      // Trigger workflows
      this.processWorkflows('order.created', { order: formattedOrder, customer });
    } else if (eventType === 'customer.created') {
      const custData = payload.customer || payload;
      const newCustomer = {
        id: Date.now() % 10000,
        name: custData.name || 'Alex Morgan',
        email: custData.email || `alex.morgan${Date.now() % 1000}@example.com`,
        phone: custData.phone || '+1 (555) 445-6677',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        company: custData.company || 'Innovate Studio',
        country: custData.country || 'United States',
        city: custData.city || 'Seattle, WA',
        registered_at: new Date().toISOString().split('T')[0],
        last_active: new Date().toISOString().split('T')[0],
        rfm_tier: 'Prospect',
        tag: 'Active Prospect',
        notes: [{ id: Date.now(), text: 'Registered WooCommerce account directly on storefront.', author: 'WooCommerce Webhook', date: new Date().toISOString().split('T')[0] }]
      };
      this.customers.unshift(newCustomer);
      affectedCustomer = newCustomer;
      this.processWorkflows('customer.created', { customer: newCustomer });
    }

    this.saveState();
    return { affectedCustomer, affectedOrder };
  }

  // --- Workflow Rule Engine ---
  processWorkflows(triggerEvent, eventData) {
    const matchingWorkflows = this.workflows.filter(w => w.enabled && w.trigger === triggerEvent);

    for (const wf of matchingWorkflows) {
      let isConditionMet = true;

      if (wf.condition && wf.condition !== 'always') {
        if (wf.condition.includes('order.total >=') && eventData.order) {
          const threshold = parseFloat(wf.condition.split('>=')[1].trim());
          isConditionMet = eventData.order.total >= threshold;
        } else if (wf.condition.includes('inactive_days >=') && eventData.customer) {
          isConditionMet = true;
        }
      }

      if (isConditionMet) {
        wf.executions_count = (wf.executions_count || 0) + 1;
        wf.last_triggered = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const targetName = eventData.customer?.name || eventData.order?.customer_name || 'Valued Customer';
        const targetEmail = eventData.customer?.email || eventData.order?.customer_email || 'customer@example.com';

        const newLog = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          workflowId: wf.id,
          workflowName: wf.name,
          event: triggerEvent,
          target: `${targetName} (${targetEmail})`,
          status: 'SUCCESS',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          message: `Trigger [${triggerEvent}] satisfied. Dispatched [${wf.actionDetails.subject || wf.action}].`
        };

        this.logs.unshift(newLog);
      }
    }
  }

  toggleWorkflow(workflowId) {
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf) return false;
    wf.enabled = !wf.enabled;
    this.saveState();
    return wf.enabled;
  }

  addWorkflow(workflowData) {
    const newWorkflow = {
      id: `wf-${Date.now()}`,
      name: workflowData.name,
      description: workflowData.description || 'Custom WooCommerce communication automation rule.',
      trigger: workflowData.trigger,
      condition: workflowData.condition || 'always',
      action: workflowData.action || 'send_email',
      actionDetails: {
        subject: workflowData.subject || 'Automated Communication Notice',
        channel: workflowData.channel || 'Email Dispatch',
        template: 'custom'
      },
      enabled: true,
      executions_count: 0,
      last_triggered: 'Never'
    };
    this.workflows.unshift(newWorkflow);
    this.saveState();
    return newWorkflow;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveState();
    return this.settings;
  }

  getAnalyticsData() {
    const customers = this.getCustomersWithStats();
    const orders = this.orders;

    // RFM Tier counts
    const tierCounts = {
      VIP: customers.filter(c => c.rfm_tier === 'VIP').length,
      'High Value': customers.filter(c => c.rfm_tier === 'High Value').length,
      Loyal: customers.filter(c => c.rfm_tier === 'Loyal').length,
      'First-Time': customers.filter(c => c.rfm_tier === 'First-Time').length,
      'At Risk': customers.filter(c => c.rfm_tier === 'At Risk').length,
    };

    // Status counts
    const statusCounts = {
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Category revenue breakdown
    const categoryRevenue = {
      'Tech Peripherals': 0,
      'Home & Ceramics': 0,
      'Leather Goods': 0,
      'Desk Accessories': 0
    };

    for (const order of orders) {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        for (const item of (order.items || [])) {
          const name = item.name.toLowerCase();
          const amount = item.price * (item.quantity || 1);
          if (name.includes('keyboard') || name.includes('cable')) {
            categoryRevenue['Tech Peripherals'] += amount;
          } else if (name.includes('lamp') || name.includes('ceramic')) {
            categoryRevenue['Home & Ceramics'] += amount;
          } else if (name.includes('leather') || name.includes('bag') || name.includes('tag')) {
            categoryRevenue['Leather Goods'] += amount;
          } else {
            categoryRevenue['Desk Accessories'] += amount;
          }
        }
      }
    }

    return {
      tierCounts,
      statusCounts,
      categoryRevenue,
      totalCustomers: customers.length,
      totalOrders: orders.length
    };
  }

  issueCustomerDiscount(customerId, code = `VIP-${Math.floor(1000 + Math.random() * 9000)}`, percent = 15) {
    const customer = this.customers.find(c => c.id === Number(customerId));
    if (!customer) return false;
    
    this.addCustomerNote(customerId, `Issued single-use coupon [${code}] for ${percent}% OFF`, 'Automated Loyalty Dispatch');
    this.processWorkflows('discount.issued', { customer, code, percent });
    this.saveState();
    return { code, percent };
  }

  exportCustomersCSV() {
    const list = this.getCustomersWithStats();
    let csv = 'ID,Name,Email,Company,City,Country,Orders Count,Total Spend (USD),RFM Tier\n';
    for (const c of list) {
      csv += `"${c.id}","${c.name}","${c.email}","${c.company || ''}","${c.city || ''}","${c.country}","${c.orders_count}","${c.total_spent}","${c.rfm_tier}"\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omnipulse_customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  exportOrdersCSV() {
    let csv = 'Order ID,Date,Customer Name,Customer Email,Total (USD),Status,Payment Method\n';
    for (const o of this.orders) {
      csv += `"${o.id}","${o.date}","${o.customer_name}","${o.customer_email}","${Number(o.total).toFixed(2)}","${o.status}","${o.payment_method}"\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omnipulse_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.loadState();
    return true;
  }
}

export const store = new Store();
