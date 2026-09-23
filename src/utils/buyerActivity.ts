import { Customer } from '../types';

/**
 * Deterministic inquiry count calculator for B2B buyers
 */
export const getBuyerInquiriesCount = (customer: Customer): number => {
  if (typeof customer.pendingInquiriesCount === 'number') {
    return customer.pendingInquiriesCount;
  }
  const code = customer.companyName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.max(1, ((customer.activeLcs || 1) + (code % 4)));
};

/**
 * Deterministic recent activity status & timing for B2B buyers
 */
export const getBuyerRecentActivity = (
  customer: Customer
): { time: string; badge: string; isLive: boolean; summary: string } => {
  if (customer.recentActivityTime) {
    return {
      time: customer.recentActivityTime,
      badge: 'Active Live',
      isLive: true,
      summary: customer.recentActivitySummary || 'Pending Sourcing Review',
    };
  }

  const times = ['8m ago', '19m ago', '32m ago', '1h ago', '2h ago', '4h ago', 'Active today'];
  const hash = Math.abs(customer.companyName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const time = times[hash % times.length];
  const isLive = hash % 3 !== 0;

  const summaries = [
    'RFQ awaiting formal supplier quote',
    'Sampling specs updated for review',
    'Letter of Credit verification ready',
    'MOQ inquiry dispatch open',
  ];
  const summary = summaries[hash % summaries.length];

  return {
    time,
    badge: isLive ? 'Live RFQ' : 'Recent Inflow',
    isLive,
    summary,
  };
};
