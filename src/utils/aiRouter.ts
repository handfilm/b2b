import { updateThreadHandledBy } from '../services/rfqService';

export interface BuyerIntentResult {
  response: string;
  routedToHuman: boolean;
  intentCategory:
    | 'standard_moq'
    | 'standard_shipping'
    | 'standard_lead_time'
    | 'standard_samples'
    | 'standard_compliance'
    | 'standard_pricing'
    | 'complex_lc_terms'
    | 'complex_gsm_fabric'
    | 'complex_custom_spec'
    | 'complex_commercial_terms'
    | 'general_trade';
}

/**
 * AI Intent Router for RAWx Autonomous Trade Agent.
 * Classifies buyer messages between automated Level-1 responses
 * and high-stakes operational escalations requiring Senior Operations Manager approval.
 */
export async function analyzeBuyerIntent(
  message: string,
  threadId?: string
): Promise<BuyerIntentResult> {
  const text = (message || '').toLowerCase().trim();

  // --------------------------------------------------------------------------
  // 1. COMPLEX OPERATIONAL TRIGGERS (Flag thread: handledBy: 'human')
  // --------------------------------------------------------------------------

  // A. L/C Terms, Deferred Payment, Financial Instruments
  const isLcNegotiation =
    text.includes('l/c') ||
    text.includes('lc terms') ||
    text.includes('letter of credit') ||
    text.includes('negotiate l/c') ||
    text.includes('deferred payment') ||
    text.includes('usance') ||
    text.includes('net 60') ||
    text.includes('net 90') ||
    text.includes('credit terms') ||
    text.includes('bank guarantee');

  // B. GSM & Technical Fabric Formulation Changes
  const isGsmFabricChange =
    text.includes('gsm') ||
    text.includes('280') ||
    text.includes('change the gsm') ||
    text.includes('yarn count') ||
    text.includes('fabric composition') ||
    text.includes('custom blend') ||
    text.includes('spandex ratio') ||
    text.includes('mercerized') ||
    text.includes('slub') ||
    text.includes('french terry 320') ||
    text.includes('grammage');

  // C. Custom TechPack, Molds, Exclusive Tooling & Inspections
  const isComplexCustomSpec =
    text.includes('custom mold') ||
    text.includes('hardware tooling') ||
    text.includes('exclusive') ||
    text.includes('nda') ||
    text.includes('non-disclosure') ||
    text.includes('intertek audit') ||
    text.includes('sgs inspection') ||
    text.includes('factory visit') ||
    text.includes('in-person audit');

  // D. High-Stakes Pricing Negotiation / Container Loads
  const isCommercialNegotiation =
    text.includes('beat competitor') ||
    text.includes('counter offer') ||
    text.includes('penalty clause') ||
    text.includes('below $') ||
    text.includes('discount 30%') ||
    text.includes('discount 40%') ||
    text.includes('full container load') ||
    text.includes('charter vessel');

  if (isLcNegotiation || isGsmFabricChange || isComplexCustomSpec || isCommercialNegotiation) {
    if (threadId) {
      try {
        await updateThreadHandledBy(threadId, 'human');
      } catch (err) {
        console.warn('[aiRouter] updateThreadHandledBy error:', err);
      }
    }

    let specificCategory: BuyerIntentResult['intentCategory'] = 'complex_commercial_terms';
    if (isLcNegotiation) specificCategory = 'complex_lc_terms';
    else if (isGsmFabricChange) specificCategory = 'complex_gsm_fabric';
    else if (isComplexCustomSpec) specificCategory = 'complex_custom_spec';

    return {
      response: 'I am routing this to our senior operational manager for final approval.',
      routedToHuman: true,
      intentCategory: specificCategory,
    };
  }

  // --------------------------------------------------------------------------
  // 2. STANDARD COMMODITY INQUIRIES (Automated Level-1 Responses)
  // --------------------------------------------------------------------------

  // MOQ inquiries
  if (
    text.includes('moq') ||
    text.includes('minimum order') ||
    text.includes('minimum quantity') ||
    text.includes('how many pieces') ||
    text.includes('min order') ||
    text.includes('what is the moq')
  ) {
    return {
      response:
        'Our standard production MOQ is 500 pcs per style/colorway for basic knits, and 1,000 pcs for outerwear and denim. For initial capsule collections or trial sample runs, we offer pilot batches of 250 pcs with an 8% setup adjustment.',
      routedToHuman: false,
      intentCategory: 'standard_moq',
    };
  }

  // Shipping & Logistics to USA / Europe
  if (
    text.includes('ship to usa') ||
    text.includes('shipping to us') ||
    text.includes('ship to america') ||
    text.includes('europe') ||
    text.includes('rotterdam') ||
    text.includes('los angeles') ||
    text.includes('freight') ||
    text.includes('incoterm') ||
    text.includes('delivery time') ||
    text.includes('destination port') ||
    text.includes('do you ship to')
  ) {
    return {
      response:
        'Yes, our bonded facilities ship directly to all primary USA deep-water ports (Los Angeles, Long Beach, Newark, Savannah) and European hubs (Rotterdam, Hamburg, Felixstowe). We offer FOB Chittagong, CIF, and door-to-door DDP air/sea freight options with real-time bill of lading tracking.',
      routedToHuman: false,
      intentCategory: 'standard_shipping',
    };
  }

  // Lead Times
  if (
    text.includes('lead time') ||
    text.includes('how long') ||
    text.includes('turnaround') ||
    text.includes('production time') ||
    text.includes('timeline')
  ) {
    return {
      response:
        'Standard bulk production lead time is 14–21 days for stock greige fabric and 28–35 days for custom reactive yarn-dyed batches once the lab-dip and size-set fit sample are signed off.',
      routedToHuman: false,
      intentCategory: 'standard_lead_time',
    };
  }

  // Samples & Swatches
  if (
    text.includes('sample') ||
    text.includes('swatch') ||
    text.includes('proto') ||
    text.includes('fabric test')
  ) {
    return {
      response:
        'Counter-samples and physical fabric swatch books can be dispatched within 72 hours via DHL/FedEx Express courier. Sample charges are credited in full against your first commercial purchase order.',
      routedToHuman: false,
      intentCategory: 'standard_samples',
    };
  }

  // Certifications & Compliance
  if (
    text.includes('certificate') ||
    text.includes('certified') ||
    text.includes('gots') ||
    text.includes('oeko') ||
    text.includes('bsci') ||
    text.includes('wrap') ||
    text.includes('leed') ||
    text.includes('green factory') ||
    text.includes('audit')
  ) {
    return {
      response:
        'All partner mills in our network maintain active LEED Green Factory certifications, OEKO-TEX Standard 100 (Appendix 6), GOTS Organic Cotton traceability, and BSCI social compliance audits. Audit certificates are downloadable directly via our Compliance Vault.',
      routedToHuman: false,
      intentCategory: 'standard_compliance',
    };
  }

  // Pricing & Price ladder
  if (
    text.includes('price') ||
    text.includes('cost') ||
    text.includes('rate') ||
    text.includes('discount') ||
    text.includes('quote')
  ) {
    return {
      response:
        'Our published FOB prices include high-volume ladders starting at 1,000 pcs (-20%), 5,000 pcs (-30%), and 10,000+ pcs (-40%). For targeted quantity orders, tell us your required destination port and currency for an instant landed cost calculation.',
      routedToHuman: false,
      intentCategory: 'standard_pricing',
    };
  }

  // Default trade concierge response
  return {
    response:
      'Thank you for your specification details. I have appended this requirement to your active mill dossier. Our automated production calculator is synchronizing with factory floor line capacity in Dhaka. You may also provide your Pantone TCX shade or garment measurements to accelerate quotation.',
    routedToHuman: false,
    intentCategory: 'general_trade',
  };
}

/**
 * Suggested quick prompts for the RAWx Bot Chat interface
 */
export const RAWX_QUICK_PROMPTS = [
  { label: 'What is the MOQ?', text: 'What is the MOQ?' },
  { label: 'Do you ship to USA?', text: 'Do you ship to USA?' },
  { label: 'Can we negotiate L/C terms?', text: 'Can we negotiate L/C terms?' },
  { label: 'I need to change the GSM to 280', text: 'I need to change the GSM to 280' },
  { label: 'Standard production lead time?', text: 'What is the standard production lead time?' },
  { label: 'Can I request a fabric sample?', text: 'Can I request a fabric sample swatch first?' },
];
