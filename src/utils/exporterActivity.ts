import { Supplier } from '../types';

/**
 * Deterministic activity status and open capacity calculation for Bangladesh exporters
 */
export const getExporterActivity = (
  supplier: Supplier
): {
  time: string;
  isLive: boolean;
  statusText: string;
  openLinesCount: number;
  openCapacityPct: number;
  shiftStatus: string;
} => {
  const times = ['6m ago', '14m ago', '28m ago', '45m ago', '1h ago', '2h ago', 'Active now'];
  const hash = Math.abs(supplier.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const time = times[hash % times.length];

  const totalLines = supplier.activeLines || supplier.productionSla?.totalLines || 24;
  const bookedPct = supplier.productionSla?.bookedCapacityPercentage || 74;
  const openCapacityPct = 100 - bookedPct;
  const openLinesCount = Math.max(1, Math.round((totalLines * openCapacityPct) / 100));

  const shifts = ['Shift 1 Operating', 'Line Dispatch Active', 'Quality Audit Active', 'Bulk Stitching Live'];
  const shiftStatus = shifts[hash % shifts.length];

  return {
    time,
    isLive: hash % 4 !== 0,
    statusText: `${openLinesCount} Open Lines`,
    openLinesCount,
    openCapacityPct,
    shiftStatus,
  };
};

/**
 * Detect primary manufacturing sector for an exporter
 */
export const getExporterSector = (supplier: Supplier): { label: string; isLeather: boolean; isDenim: boolean } => {
  const text = `${supplier.name} ${supplier.about || ''} ${supplier.district || ''}`.toLowerCase();
  if (text.includes('leather') || text.includes('tannery') || text.includes('savar') || text.includes('shoe') || text.includes('footwear')) {
    return { label: '👜 Leather Tannery', isLeather: true, isDenim: false };
  }
  if (text.includes('denim') || text.includes('woven') || text.includes('twill') || text.includes('jeans')) {
    return { label: '👖 Woven & Denim', isLeather: false, isDenim: true };
  }
  return { label: '👕 Knit & Jersey', isLeather: false, isDenim: false };
};
