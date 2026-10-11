export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type MarketingGuide = {
  slug: string;
  category: 'Invoicing' | 'WhatsApp' | 'Payments' | 'Freelancing' | 'Nigeria';
  title: string;
  description: string;
  readTime: string;
  intro: string;
  sections: GuideSection[];
  takeaway: string;
};

export const marketingGuides: MarketingGuide[] = [
  {
    slug: 'how-to-create-a-professional-invoice',
    category: 'Invoicing',
    title: 'How to create a professional invoice clients can understand',
    description: 'A practical checklist for turning completed work into a clear, client-ready invoice with fewer questions and a stronger payment path.',
    readTime: '6 min read',
    intro: 'A professional invoice does more than state a price. It tells the client who is billing them, what they are paying for, when payment is expected and what they should do next. The easier those answers are to find, the less room there is for avoidable back-and-forth.',
    sections: [
      { heading: 'Start with clear business and client details', paragraphs: ['Use the business name and contact details the client already recognizes. Then identify the client clearly enough that the invoice can be routed internally without someone asking who requested the work.'], bullets: ['Your business name and contact details', 'Client or company name', 'A unique invoice number', 'Invoice date and due date'] },
      { heading: 'Describe the work in plain language', paragraphs: ['Line items should be specific enough to remind the client what was delivered. Avoid vague entries such as “services” when “Website design — final milestone” or “August consulting retainer” would remove uncertainty.'], bullets: ['Service or product description', 'Quantity or billing period where relevant', 'Rate or unit price', 'Tax and discounts when applicable'] },
      { heading: 'Make the amount due impossible to miss', paragraphs: ['The total should be visually clear and consistent with the line items above it. If the client has already paid a deposit, show what has been paid and what remains instead of forcing them to calculate the balance themselves.'] },
      { heading: 'End with a clear payment path', paragraphs: ['Tell the client how to pay and what happens next. If you are sharing the invoice digitally, keep the payment link close to the amount due so the client can move from understanding the invoice to acting on it without searching through another message.'] },
    ],
    takeaway: 'The best invoice reduces questions before they happen: clear parties, clear work, clear amount, clear due date and a clear way to pay.',
  },
  {
    slug: 'how-to-send-an-invoice-on-whatsapp',
    category: 'WhatsApp',
    title: 'How to send an invoice on WhatsApp without looking informal',
    description: 'Use WhatsApp for speed while keeping the invoice itself structured, professional and connected to payment.',
    readTime: '5 min read',
    intro: 'WhatsApp can be one of the fastest ways to reach a client, but the invoice should not become a loose collection of totals typed into chat. The strongest workflow keeps the financial document structured and uses WhatsApp as the communication layer around it.',
    sections: [
      { heading: 'Create the invoice before writing the message', paragraphs: ['Build the invoice first so the number, total, due date and payment details come from one source. That prevents small mismatches between the document and the chat message.'] },
      { heading: 'Keep the message short', paragraphs: ['A useful WhatsApp invoice message usually needs only a greeting, the invoice reference, the amount, a brief context line and the action you want the client to take. The invoice itself should carry the detailed line items and terms.'], bullets: ['Mention the invoice number', 'State the amount due', 'Include the invoice or payment link', 'Keep the tone direct and polite'] },
      { heading: 'Use the conversation for follow-up, not record keeping', paragraphs: ['When a client pays part of an invoice, update the invoice record first. Then your next WhatsApp message can refer to the real remaining balance rather than relying on old messages in the thread.'] },
      { heading: 'Know when to send the PDF', paragraphs: ['Some clients want a formal PDF for internal processing. Send it when useful, but keep the payment path visible in the accompanying message so the document does not become a dead end.'] },
    ],
    takeaway: 'Use WhatsApp to make the client interaction faster, while the invoice remains the source of truth for totals, payment status and outstanding balance.',
  },
  {
    slug: 'how-to-follow-up-on-an-unpaid-invoice',
    category: 'Payments',
    title: 'How to follow up on an unpaid invoice without damaging the client relationship',
    description: 'A simple reminder sequence for keeping payment conversations clear, professional and tied to the amount actually outstanding.',
    readTime: '7 min read',
    intro: 'Late payment follow-up is easier when it feels like a process rather than a confrontation. The goal is not to write a dramatic message. It is to remove uncertainty, restate what is due and make the next action obvious.',
    sections: [
      { heading: 'Check the invoice before contacting the client', paragraphs: ['Confirm the invoice number, due date, original total, payments already received and current outstanding balance. A reminder loses credibility quickly if the amount in the message is wrong.'] },
      { heading: 'Start with a neutral reminder', paragraphs: ['Your first follow-up can assume the delay is administrative. Reference the invoice, the amount still due and the payment route. Avoid sounding accusatory when a simple nudge may be enough.'] },
      { heading: 'Increase clarity before increasing pressure', paragraphs: ['If the invoice remains unpaid, make the next reminder more explicit about the due date and outstanding balance. Keep the message factual. If you have agreed late-payment terms, refer to them only when they actually apply.'] },
      { heading: 'Stop asking for money that has already been paid', paragraphs: ['Partial payment should change the conversation. If a client has paid ₦100,000 on a ₦250,000 invoice, the reminder should focus on the ₦150,000 remaining—not repeat the original invoice total as though nothing happened.'] },
    ],
    takeaway: 'Professional follow-up is specific, current and easy to act on. Always remind from the latest invoice balance, not from memory.',
  },
  {
    slug: 'how-to-handle-partial-invoice-payments',
    category: 'Payments',
    title: 'How to handle deposits and partial invoice payments clearly',
    description: 'Keep deposits, milestone payments and remaining balances understandable for both you and the client.',
    readTime: '5 min read',
    intro: 'Partial payment is normal in project work, retainers, contracting and larger service engagements. The problem is not receiving money in stages; the problem is losing track of what each payment relates to and what remains due.',
    sections: [
      { heading: 'Decide what the first payment represents', paragraphs: ['A deposit may reserve the work, fund the first project phase or simply reduce risk before delivery. State the purpose clearly so the client understands why it is being requested.'] },
      { heading: 'Show paid and remaining amounts together', paragraphs: ['After a part-payment, the invoice should make three numbers easy to distinguish: the original total, amount paid and outstanding balance. This is far clearer than sending a second message asking the client to subtract one figure from another.'] },
      { heading: 'Tie milestone payments to deliverables', paragraphs: ['For project work, name the milestone when possible. “40% after design approval” is easier to understand than an unexplained second payment request.'] },
      { heading: 'Close the invoice when the balance reaches zero', paragraphs: ['Once the final payment is received, update the invoice status so both your dashboard and future follow-up reflect that the obligation is complete.'] },
    ],
    takeaway: 'A partial payment should reduce uncertainty, not create more of it. Keep the original total, amount collected and remaining balance visible together.',
  },
  {
    slug: 'invoicing-tips-for-freelancers',
    category: 'Freelancing',
    title: 'A simple invoicing system for freelancers who would rather do the work',
    description: 'Build a repeatable process for project fees, retainers, deposits and client follow-up without turning invoicing into a second job.',
    readTime: '8 min read',
    intro: 'Freelancers often invoice in several different ways at once: a fixed project, a monthly retainer, an upfront deposit and a final balance can all exist in the same month. A useful system creates consistency around those different billing models.',
    sections: [
      { heading: 'Agree the billing structure before the work becomes urgent', paragraphs: ['Decide whether the project is paid upfront, in milestones, on completion or on a recurring schedule. Put the structure in the agreement so the invoice is confirming known terms rather than introducing new ones.'] },
      { heading: 'Invoice close to the trigger', paragraphs: ['Send the deposit invoice when the project is approved, the milestone invoice when the milestone is reached and the final invoice when the final obligation is due. Delayed invoicing often creates delayed payment.'] },
      { heading: 'Use consistent descriptions and terms', paragraphs: ['A repeat client should recognize your invoice format immediately. Consistency in service names, due dates and payment instructions makes the process feel established rather than improvised.'] },
      { heading: 'Make follow-up part of the workflow', paragraphs: ['Do not rely on remembering every due date. Review outstanding invoices regularly and contact clients from the latest invoice status so partially paid and overdue work are handled differently.'] },
    ],
    takeaway: 'The goal is a repeatable rhythm: agree terms, invoice at the right trigger, make payment simple and review what remains outstanding.',
  },
  {
    slug: 'invoice-workflow-for-nigerian-businesses',
    category: 'Nigeria',
    title: 'A practical invoice-to-payment workflow for Nigerian small businesses',
    description: 'Use naira invoices, familiar client communication and clear balance tracking to make local payment collection easier to manage.',
    readTime: '7 min read',
    intro: 'Many Nigerian freelancers and small businesses already manage client communication through WhatsApp while payments happen through familiar local banking and payment channels. The opportunity is to make the invoice itself more structured without forcing the client into an unfamiliar communication process.',
    sections: [
      { heading: 'Keep the invoice clear in naira', paragraphs: ['Use NGN amounts consistently across line items, totals, messages and payment follow-up. If tax applies to your business or transaction, present it as a distinct part of the calculation rather than burying it in the total.'] },
      { heading: 'Meet the client where the conversation already happens', paragraphs: ['If the client normally responds on WhatsApp, it can be a practical place to send the invoice notification and payment link. Keep the actual invoice professional so the chat message stays concise.'] },
      { heading: 'Treat transfers and part-payments as invoice activity', paragraphs: ['When payment arrives, reflect it against the relevant invoice. This matters especially when clients pay deposits or settle balances in stages.'] },
      { heading: 'Keep an eye on the outstanding amount', paragraphs: ['A simple dashboard view of paid, partial and outstanding invoices gives you a better collection picture than searching through bank alerts and old client chats independently.'] },
    ],
    takeaway: 'A strong Nigerian invoicing workflow combines a professional naira invoice, familiar client communication and one clear view of what has actually been collected.',
  },
];

export function getMarketingGuide(slug: string) {
  return marketingGuides.find((guide) => guide.slug === slug);
}
