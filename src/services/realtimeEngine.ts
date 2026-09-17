import { LiveTradeEvent } from '../types';

export const DYNAMIC_EVENT_TEMPLATES = [
  {
    type: 'lc_opened' as const,
    title: 'Irrevocable At-Sight L/C Opened ($980,000)',
    titleBn: 'অপ্রত্যাহারযোগ্য অ্যাট-সাইট এল/সি খোলা হয়েছে ($৯৮০,০০০)',
    partyName: 'Inditex S.A. (Massimo Dutti)',
    targetFactory: 'Envoy Textiles Limited',
    country: 'Spain',
    flag: '🇪🇸',
    details: 'Inditex opened $980,000 Letter of Credit via HSBC Dhaka for 120,000 units Organic Cotton Stretch Chinos.',
    detailsBn: 'ইন্ডিটেক্স এইচএসবিসি ঢাকার মাধ্যমে ১২০,০০০ পিস চিনো প্যান্টের জন্য $৯৮০,০০০ এল/সি ইস্যু করেছে।',
    valueUSD: 980000,
  },
  {
    type: 'container_shipped' as const,
    title: '40ft HC Container Loaded at Chittagong Port',
    titleBn: 'চট্টগ্রাম বন্দরে ৪০ ফুট হাই-কিউব কন্টেইনার জাহাজে লোড সম্পন্ন',
    partyName: 'Target Corporation USA',
    targetFactory: 'Zaber & Zubair Home Textiles',
    country: 'United States',
    flag: '🇺🇸',
    details: 'Vessel MAERSK DHAKA departed CGP Terminal with 18,000 sets hotel grade 550 GSM Terry Towels.',
    detailsBn: 'মারস্ক ঢাকা জাহাজ ১৮,০০০ সেট লাক্সারি টেরি টাওয়েল নিয়ে চট্টগ্রাম বন্দর ছেড়ে আমেরিকার উদ্দেশ্যে রওনা হয়েছে।',
    valueUSD: 360000,
  },
  {
    type: 'sample_dispatched' as const,
    title: 'Air Courier Sample Dispatched via DHL Express',
    titleBn: 'ডিএইচএল এক্সপ্রেসের মাধ্যমে এয়ার কুরিয়ার স্যাম্পল প্রেরিত',
    partyName: 'Fast Retailing (UNIQLO)',
    targetFactory: 'Square Fashions Ltd.',
    country: 'Japan',
    flag: '🇯🇵',
    details: 'AWB #8812903112 dispatched from Dhaka Air Cargo with Supima Cotton seamless knit prototypes to Tokyo HQ.',
    detailsBn: 'টোকিও হেডকোয়ার্টারের উদ্দেশ্যে শাহজালাল বিমানবন্দর থেকে সুপিমা কটন নিট প্রোটোটাইপ স্যাম্পল পাঠানো হয়েছে।',
    valueUSD: 380,
  },
  {
    type: 'rfq_broadcast' as const,
    title: 'Direct RFQ Dispatched to Accredited Mills',
    titleBn: 'অনুমোদিত কারখানাসমূহে সরাসরি আরএফকিউ পাঠানো হয়েছে',
    partyName: 'Kaufland Global Sourcing',
    targetFactory: 'Akij Jute Mills Limited',
    country: 'Germany',
    flag: '🇩🇪',
    details: 'Requirement posted for 750,000 heavy-duty laminated golden jute supermarket bags.',
    detailsBn: '৭৫০,০০০ পিস হেভি-ডিউটি সোনালী পাটের সুপারমার্কেট শপিং ব্যাগের জন্য আরএফকিউ প্রকাশ করা হয়েছে।',
    valueUSD: 1050000,
  },
  {
    type: 'quote_placed' as const,
    title: 'Factory Submitted Direct FOB Quotation',
    titleBn: 'কারখানা সরাসরি এফওবি দরপ্রস্তাব জমা দিয়েছে',
    partyName: 'Marks & Spencer PLC',
    targetFactory: 'Apex Footwear & Tanning',
    country: 'United Kingdom',
    flag: '🇬🇧',
    details: 'Apex Footwear quoted $34.50/pair FOB Chittagong for 50,000 pairs LWG Gold Goodyear Welted Brogues.',
    detailsBn: 'এপেক্স ফুটওয়্যার ৫০,০০০ জোড়া গোল্ড লেদার জুতার জন্য প্রতি জোড়া $৩৪.৫০ এফওবি দরপ্রস্তাব জমা দিয়েছে।',
    valueUSD: 1725000,
  },
];

export function generateRandomTradeEvent(): LiveTradeEvent {
  const template = DYNAMIC_EVENT_TEMPLATES[Math.floor(Math.random() * DYNAMIC_EVENT_TEMPLATES.length)];
  const id = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    ...template,
    id,
    timestamp: 'Just now (< 1 min ago)',
  };
}
