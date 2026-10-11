import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoSolutionPage, { SolutionPageData } from '@/components/marketing/seo-solution-page';

const solutions: Record<string, SolutionPageData> = {
  freelancers: {
    eyebrow: 'Invoicing for freelancers',
    title: 'Finish the work. Send the invoice. Know what is still owed.',
    description: 'Hip Homorrd gives freelancers a focused billing workflow for one-off projects, retainers, deposits and final balances—without making you run a miniature finance department.',
    pain: 'Freelance billing often lives across a proposal, a WhatsApp thread, a PDF and a bank alert. When those pieces drift apart, follow-up becomes guesswork. Hip Homorrd keeps the invoice and its latest balance together.',
    outcomes: [
      { title: 'Project invoices', text: 'Turn a finished milestone or deliverable into a clear invoice with scope, rates, due date and payment terms.' },
      { title: 'Retainer billing', text: 'Keep repeat client work consistent so each invoice looks deliberate and is easier to follow up.' },
      { title: 'Payment follow-up', text: 'See whether an invoice is pending, partial or paid before you message the client again.' },
    ],
    workflow: [
      { title: 'Invoice the work', text: 'Add the client, project details, rates, taxes and payment terms in a clean document.' },
      { title: 'Share where clients respond', text: 'Send the invoice through WhatsApp, email or a payment-ready link without retyping the important details.' },
      { title: 'Track the balance', text: 'Keep the amount received and the amount remaining visible until the job is fully settled.' },
    ],
    goodFor: ['You manage several clients without a dedicated accounts team.', 'You invoice projects, retainers or milestones.', 'Clients often communicate with you on WhatsApp.', 'You want a clean payment record without adopting a full accounting suite.'],
    faqs: [
      { q: 'Can freelancers use Hip Homorrd for different clients?', a: 'Yes. The workflow is built around managing invoices across multiple clients while keeping each invoice, payment status and balance separate.' },
      { q: 'Can I record partial payments?', a: 'Yes. When partial payment is supported for the invoice, the amount received and remaining balance can be reflected against the same invoice.' },
    ],
  },
  consultants: {
    eyebrow: 'Invoicing for consultants',
    title: 'Make consulting invoices as clear as the advice behind them.',
    description: 'Create professional invoices for advisory engagements, workshops, implementation work and retainers, then keep client payment follow-up attached to the engagement.',
    pain: 'Consulting work can be high-value but difficult to describe in a generic invoice template. A client should be able to see what the engagement covered, what is due and what happens next without asking for clarification.',
    outcomes: [
      { title: 'Engagement clarity', text: 'Describe advisory work, workshops, implementation phases or deliverables in language the client can approve internally.' },
      { title: 'Retainer consistency', text: 'Use a repeatable invoice structure for ongoing advisory work instead of rebuilding the billing process each month.' },
      { title: 'Professional follow-up', text: 'Follow up from the current balance rather than from an old email or chat message.' },
    ],
    workflow: [
      { title: 'Define the engagement', text: 'Show services, rates, dates and terms clearly so the invoice matches the commercial agreement.' },
      { title: 'Send a payment-ready invoice', text: 'Put a professional invoice and clear payment route in front of the client.' },
      { title: 'Follow up from facts', text: 'See the latest payment status before deciding whether the account needs a reminder.' },
    ],
    goodFor: ['You bill advisory projects or workshops.', 'You work on monthly or quarterly retainers.', 'Your clients need clear invoice descriptions for approval.', 'You want client follow-up to feel professional rather than improvised.'],
    faqs: [
      { q: 'Can I use it for recurring consulting work?', a: 'Hip Homorrd can support the invoicing workflow for repeat consulting work. The exact automation available for recurring billing depends on the features enabled on your account.' },
      { q: 'Can I brand my invoices?', a: 'Yes. You can use your saved business branding on invoice documents.' },
    ],
  },
  'designers-creatives': {
    eyebrow: 'Invoicing for designers and creatives',
    title: 'Keep creative billing polished from deposit to final delivery.',
    description: 'For designers, photographers, writers, video creators and other creative professionals, Hip Homorrd turns project fees, milestones and balances into a client-friendly payment workflow.',
    pain: 'Creative projects rarely fit a single “service fee” line. Deposits, revisions, production, usage, milestones and final balances need enough context to make sense without turning the invoice into another proposal.',
    outcomes: [
      { title: 'Milestone billing', text: 'Invoice deposits, production stages or final delivery as separate moments in the client relationship.' },
      { title: 'Brand consistency', text: 'Keep the invoice visually aligned with the professional experience you provide in the work itself.' },
      { title: 'Client-friendly payment', text: 'Give clients a clear amount, due date and next step instead of sending a figure in a chat message.' },
    ],
    workflow: [
      { title: 'Turn scope into line items', text: 'List deliverables and project stages in a way the client can quickly recognize.' },
      { title: 'Share the polished invoice', text: 'Send the document through the same communication channel the project already uses.' },
      { title: 'Close the remaining balance', text: 'Track deposits or part-payments against the invoice so final follow-up is accurate.' },
    ],
    goodFor: ['You collect deposits before starting work.', 'You bill project milestones or final delivery.', 'Presentation matters to your client experience.', 'You frequently send invoices through WhatsApp or email.'],
    faqs: [
      { q: 'Is this useful for project milestones?', a: 'Yes. You can create invoices around deposits, milestones or final balances and track partial payment where supported.' },
      { q: 'Can I send the invoice as a PDF?', a: 'Yes. Hip Homorrd can generate a downloadable invoice PDF.' },
    ],
  },
  developers: {
    eyebrow: 'Invoicing for developers',
    title: 'Bill builds, maintenance and technical work without spreadsheet archaeology.',
    description: 'Create invoices for fixed-price software projects, hourly development, implementation work and maintenance retainers, then keep payment status tied to the actual invoice.',
    pain: 'Development billing can span deposits, milestones, change requests and maintenance. The harder the billing record is to understand, the more time you spend explaining a payment request instead of shipping work.',
    outcomes: [
      { title: 'Project billing', text: 'Invoice builds and implementation phases with enough detail for a client or finance team to approve quickly.' },
      { title: 'Maintenance retainers', text: 'Keep repeat support and maintenance invoices consistent across billing cycles.' },
      { title: 'Balance visibility', text: 'Know what has been paid on a project and what is still outstanding before the next milestone.' },
    ],
    workflow: [
      { title: 'Document the work', text: 'Add technical services, hours, milestones or fixed project fees in client-readable language.' },
      { title: 'Share instantly', text: 'Move the invoice into WhatsApp, email or your preferred client channel without rebuilding the totals.' },
      { title: 'Keep the payment state current', text: 'Use invoice status and balance information to decide when follow-up is necessary.' },
    ],
    goodFor: ['You bill fixed-price software projects.', 'You charge hourly or day rates.', 'You run support or maintenance retainers.', 'You collect deposits or milestone payments.'],
    faqs: [
      { q: 'Can I invoice international clients?', a: 'The invoice workflow supports the currencies exposed by your account and backend. Payment methods and settlement availability can vary by market, so confirm the options enabled for your account.' },
    ],
  },
  agencies: {
    eyebrow: 'Invoicing for agencies',
    title: 'Keep client billing consistent even when the work is not.',
    description: 'Small creative, marketing and technology agencies can invoice retainers, campaigns and project work with a consistent client experience and a clearer view of outstanding balances.',
    pain: 'Agency work changes from client to client, but billing should not feel improvised every time. A repeatable invoice structure makes approval easier and helps the team see which accounts need follow-up.',
    outcomes: [
      { title: 'Consistent client billing', text: 'Keep invoice structure and branding recognizable across multiple accounts and service types.' },
      { title: 'Retainers and projects', text: 'Handle recurring retainers alongside campaign, production or project invoices.' },
      { title: 'Collections visibility', text: 'Separate paid, partial and outstanding invoices so the team knows where attention is needed.' },
    ],
    workflow: [
      { title: 'Create a consistent invoice', text: 'Use saved business details and clear line items across every client account.' },
      { title: 'Share with the client', text: 'Put the invoice into a familiar communication channel with a clear payment next step.' },
      { title: 'Review collections', text: 'Use invoice status and reports to see which balances are settled and which still need action.' },
    ],
    goodFor: ['You manage multiple client accounts.', 'You bill retainers and project work side by side.', 'Several people may need visibility into collections.', 'You want a consistent invoice experience across the agency.'],
    faqs: [
      { q: 'Can agencies manage multiple clients?', a: 'Yes. Hip Homorrd includes client and invoice workflows designed for businesses serving multiple customers.' },
    ],
  },
  contractors: {
    eyebrow: 'Invoicing for contractors',
    title: 'Keep deposits, job invoices and final balances tied to the work.',
    description: 'Independent contractors and service businesses can invoice jobs, record partial payments and keep the remaining amount visible until the work is fully settled.',
    pain: 'Jobs often start with a deposit and end with a balance. When those payments are tracked in separate messages or alerts, it becomes easy to lose the current amount due.',
    outcomes: [
      { title: 'Job invoices', text: 'Show labour, materials, services or quantities in a structured invoice the client can review.' },
      { title: 'Deposits and balances', text: 'Reflect part-payment against the same invoice so the remaining balance is obvious.' },
      { title: 'Practical reminders', text: 'Follow up with the correct balance once a deposit or instalment has already been received.' },
    ],
    workflow: [
      { title: 'Invoice the job', text: 'Capture services, quantities, rates, tax and payment terms in one record.' },
      { title: 'Record money received', text: 'Keep deposits or staged payments attached to the invoice instead of a separate note.' },
      { title: 'Close the balance', text: 'Use the remaining amount as the basis for final payment follow-up.' },
    ],
    goodFor: ['You collect deposits before work begins.', 'Jobs can be paid in stages.', 'You need clear line items for labour or services.', 'You want to know the exact balance due at handover.'],
    faqs: [
      { q: 'Can I track a deposit?', a: 'Yes. Partial-payment tracking can show the amount received and the remaining balance on the invoice where the feature is enabled.' },
    ],
  },
  coaches: {
    eyebrow: 'Invoicing for coaches',
    title: 'Make paying for a session or programme feel as clear as booking it.',
    description: 'Coaches, trainers and independent advisors can invoice sessions, packages and programmes with clear descriptions, a professional payment request and simple follow-up.',
    pain: 'Coaching revenue can come from single sessions, packages and longer programmes. When payment arrangements live only in chat, it is harder for both sides to know what has been billed and what remains.',
    outcomes: [
      { title: 'Packages and programmes', text: 'Describe what the client is paying for without squeezing the arrangement into a vague “consulting” line.' },
      { title: 'Session invoices', text: 'Send professional invoices for individual sessions or blocks of time.' },
      { title: 'Payment follow-up', text: 'Keep the latest balance visible when a client pays in stages or needs a reminder.' },
    ],
    workflow: [
      { title: 'Package the service clearly', text: 'Invoice a session, programme or coaching package with clear terms and due date.' },
      { title: 'Send it where the client responds', text: 'Share through WhatsApp or email with the invoice details and payment route together.' },
      { title: 'Keep the account current', text: 'Track whether the invoice is pending, partially paid or settled before sending the next message.' },
    ],
    goodFor: ['You sell individual sessions or packages.', 'Clients often arrange work through WhatsApp.', 'You accept deposits or staged payments.', 'You want a more professional payment request than a bank-account message.'],
    faqs: [
      { q: 'Can coaches use WhatsApp to send invoices?', a: 'Yes. The WhatsApp workflow is designed to share invoice details and a payment path through the client conversation.' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(solutions).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = solutions[slug];
  return data ? { title: data.title, description: data.description, alternates: { canonical: `/solutions/${slug}` } } : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = solutions[slug];
  if (!data) notFound();
  return <SeoSolutionPage data={data} />;
}
