// AI Customer Intelligence & Communication Copilot

export class AICopilot {
  static analyzeCustomer(customer) {
    const orders = customer.recent_orders || [];
    const totalSpent = parseFloat(customer.total_spent || 0);
    const orderCount = orders.length;

    // Churn risk calculation
    let churnRisk = 'Low';
    let riskColor = 'emerald';
    let riskScore = 15;
    let rationale = 'High engagement, recent orders placed within active lifecycle.';

    if (customer.rfm_tier === 'At Risk' || (orders.length > 0 && orders[0].date.includes('2026-07'))) {
      churnRisk = 'High';
      riskColor = 'rose';
      riskScore = 82;
      rationale = 'Customer has not placed an order in > 75 days despite previous recurring purchases.';
    } else if (orderCount === 1) {
      churnRisk = 'Moderate';
      riskColor = 'amber';
      riskScore = 48;
      rationale = 'Single initial purchase. High risk of drop-off without onboarding nurture workflow.';
    }

    // Persona & purchasing preference
    const items = orders.flatMap(o => (o.items || []).map(i => i.name));
    let preferredCategory = 'Workspace & Lifestyle Products';
    if (items.some(i => i.toLowerCase().includes('keyboard') || i.toLowerCase().includes('cable'))) {
      preferredCategory = 'Custom Tech & Ergonomic Peripherals';
    } else if (items.some(i => i.toLowerCase().includes('bag') || i.toLowerCase().includes('leather'))) {
      preferredCategory = 'Luxury Travel & Leather Goods';
    } else if (items.some(i => i.toLowerCase().includes('lamp') || i.toLowerCase().includes('ceramic'))) {
      preferredCategory = 'Artisan Home & Ceramic Décor';
    }

    const aiSummary = [
      `**Customer Persona:** ${customer.rfm_tier} tier buyer located in ${customer.city || customer.country}. Primary interest: ${preferredCategory}.`,
      `**Value Profile:** Lifetime spend of $${totalSpent.toLocaleString()} across ${orderCount} WooCommerce orders with an average basket size of $${orderCount > 0 ? (totalSpent / orderCount).toFixed(2) : '0.00'}.`,
      `**Actionable Recommendation:** ${
        churnRisk === 'High' 
          ? 'Dispatch automated retention voucher (15-20% off) or personal outreach from account manager.'
          : customer.rfm_tier === 'VIP'
          ? 'Invite to private pre-launch drops and assign priority concierge support.'
          : 'Send automated product care recommendations and loyalty sign-up bonus.'
      }`
    ];

    return {
      churnRisk,
      riskColor,
      riskScore,
      rationale,
      preferredCategory,
      summary: aiSummary
    };
  }

  static generateOutreachDraft(customer, tone = 'vip') {
    const firstName = customer.name.split(' ')[0] || 'there';
    const recentOrder = (customer.recent_orders && customer.recent_orders[0]) ? customer.recent_orders[0] : null;
    const itemPurchased = recentOrder && recentOrder.items && recentOrder.items[0] ? recentOrder.items[0].name : 'your recent artisan collection purchase';

    switch (tone) {
      case 'vip':
        return {
          subject: `A personal note of gratitude from our founder, ${firstName} 👑`,
          body: `Dear ${firstName},

I noticed your ongoing support and wanted to take a moment to personally say thank you. As one of our most valued patrons at ${customer.company || 'our store'}, your discerning eye for craftsmanship inspires what we curate every season.

I’ve personally added 500 VIP reward points to your account and flagged your profile for complimentary express dispatch on all future orders.

If you ever need personalized styling recommendations or bespoke reservations, simply reply directly to this email.

Warm regards,
Alex Sterling
Founder & Chief Curator`
        };

      case 'winback':
        return {
          subject: `We miss you, ${firstName}! Here is $25 towards your next piece ✨`,
          body: `Hi ${firstName},

It’s been a little while since we last prepared a parcel for you in ${customer.city || 'your area'}, and we wanted to check in.

Our studio recently introduced several handcrafted additions that pair exceptionally well with your ${itemPurchased}.

To welcome you back, we’ve generated an exclusive voucher just for you:

Use code: **WELCOMEBACK25** for $25 off any order above $75.

We’d love to craft something special for you again!

Best wishes,
The Customer Experience Team`
        };

      case 'followup':
        return {
          subject: `How is your ${itemPurchased} treating you? 🌿`,
          body: `Hi ${firstName},

Your recent order #${recentOrder?.id || 'WC-8924'} was marked delivered recently, and we hope it has settled into your space beautifully!

We take great pride in our materials and ergonomics. Could you spare 30 seconds to share your thoughts? As a token of our appreciation, leaving a quick review automatically unlocks a 15% discount on your next visit.

If anything isn’t 100% perfect, just reply here and our support team will handle it immediately.

Kind regards,
OmniPulse Care Team`
        };

      default:
        return {
          subject: `Exclusive curated recommendation for ${firstName}`,
          body: `Hi ${firstName},\n\nThank you for choosing us! We have hand-selected a few new arrivals matching your taste.\n\nWarm regards,\nThe Team`
        };
    }
  }
}
