import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoSolutionPage, {
  SolutionPageData,
} from '@/components/marketing/seo-solution-page';

const pages: Record<string, SolutionPageData> = {
  'send-invoice-on-whatsapp': {
    eyebrow: 'Send invoices on WhatsApp',
    title: 'Send professional invoices on WhatsApp without rebuilding the invoice in chat.',
    description:
      'Create the invoice once, then share the invoice details and payment path with your client on WhatsApp. Keep the document, balance and payment workflow connected.',
    pain:
      'When invoice details are copied manually into chat, totals, due dates and payment instructions can easily become inconsistent. Hip Homorrd keeps the invoice as the source of truth while WhatsApp remains the communication channel.',
    outcomes: [
      {
        title: 'Invoice sharing',
        text: 'Share an existing professional invoice without recreating the amount, due date or client details inside WhatsApp.',
      },
      {
        title: 'Payment links',
        text: 'Keep the payment route connected to the invoice so the client can move from the message to payment more easily.',
      },
      {
        title: 'Client-friendly reminders',
        text: 'Follow up on an outstanding invoice using the latest balance instead of composing every reminder from scratch.',
      },
    ],
    workflow: [
      {
        title: 'Create once',
        text: 'Build a professional invoice with your business details, logo, items and totals.',
      },
      {
        title: 'Share on WhatsApp',
        text: 'Open WhatsApp with the client, invoice number, balance and payment link ready to send.',
      },
      {
        title: 'Track payment',
        text: 'Return to the invoice when you need to check whether it is paid, partial or still outstanding.',
      },
    ],
    goodFor: [
      'You already communicate with clients through WhatsApp.',
      'You want the invoice to remain the source of truth for totals and balances.',
      'You want clients to receive a clear payment path without retyping invoice details.',
      'You need a simple way to follow up on outstanding invoices.',
    ],
    faqs: [
      {
        q: 'Can I send an existing invoice?',
        a: 'Yes. The invoice list and invoice detail view provide WhatsApp sharing for existing invoices.',
      },
      {
        q: 'Does WhatsApp receive the PDF?',
        a: 'On supported mobile browsers, Hip Homorrd can use the native share sheet to share an invoice PDF. Otherwise the WhatsApp workflow shares the invoice message and link.',
      },
    ],
  },

  'whatsapp-payment-reminders': {
    eyebrow: 'WhatsApp payment reminders',
    title: 'Follow up on unpaid invoices without writing the reminder from scratch.',
    description:
      'Use the invoice balance to create a clear payment reminder that you can send to a client through WhatsApp. Keep the tone professional and the payment path visible.',
    pain:
      'Payment follow-up becomes harder when you have to check old chats, calculate what is still outstanding and rewrite the payment instructions each time. Hip Homorrd keeps the current invoice balance available before you contact the client.',
    outcomes: [
      {
        title: 'Friendly reminders',
        text: 'Start from a clear invoice-based reminder instead of writing each payment follow-up manually.',
      },
      {
        title: 'Outstanding balances',
        text: 'Use the current balance so a partially paid invoice is not followed up for the original full amount.',
      },
      {
        title: 'Payment links',
        text: 'Keep the route to payment visible in the reminder so the client knows what to do next.',
      },
    ],
    workflow: [
      {
        title: 'Identify the balance',
        text: 'See what has been paid and what remains due before contacting the client.',
      },
      {
        title: 'Send the reminder',
        text: 'Open WhatsApp with a pre-filled reminder that references the invoice and outstanding amount.',
      },
      {
        title: 'Close the loop',
        text: 'When the client pays, the invoice can move from pending or partial to paid.',
      },
    ],
    goodFor: [
      'You follow up with clients through WhatsApp.',
      'You need reminders for pending invoices.',
      'You need reminders to reflect the remaining balance on partially paid invoices.',
      'You want paid invoices to stay out of the reminder workflow.',
    ],
    faqs: [
      {
        q: 'Can I remind a client about a partially paid invoice?',
        a: 'Yes. A partially paid invoice can use the outstanding balance rather than repeating the original invoice total. Fully paid invoices do not need a payment reminder.',
      },
    ],
  },

  'whatsapp-invoice-pdf': {
    eyebrow: 'WhatsApp invoice PDF sharing',
    title: 'Share the invoice document and payment details from the same workflow.',
    description:
      'Keep a professional invoice PDF available for clients who want the document while also giving them a simple route to payment.',
    pain:
      'Sending a PDF and then separately typing the amount, reference and payment instructions creates unnecessary duplication. Hip Homorrd keeps the document and payment context connected.',
    outcomes: [
      {
        title: 'PDF invoices',
        text: 'Give clients a professional invoice document they can save, review or pass to their finance team.',
      },
      {
        title: 'Native sharing',
        text: 'Use supported device sharing capabilities to move the invoice document into WhatsApp more naturally.',
      },
      {
        title: 'Payment-ready messages',
        text: 'Keep the invoice context and payment path available alongside the document where supported.',
      },
    ],
    workflow: [
      {
        title: 'Generate the PDF',
        text: 'Download a branded A4 invoice with your business logo, line items, totals and status.',
      },
      {
        title: 'Share from mobile',
        text: 'On supported devices, use native file sharing to choose WhatsApp and attach the PDF.',
      },
      {
        title: 'Keep payment connected',
        text: 'Include the payment link in the accompanying message when one is available.',
      },
    ],
    goodFor: [
      'Your clients prefer receiving a formal invoice document.',
      'You commonly communicate through WhatsApp on mobile.',
      'You want invoice sharing and payment instructions to stay connected.',
      'You need a fallback message and link when browser file sharing is unavailable.',
    ],
    faqs: [
      {
        q: 'Why does file sharing depend on the browser?',
        a: 'Attaching a local file to WhatsApp is controlled by the browser and device Web Share capabilities. Where file sharing is unavailable, the workflow falls back to a shareable message and link.',
      },
    ],
  },

  nigeria: {
    eyebrow: 'WhatsApp invoicing in Nigeria',
    title: 'Invoice Nigerian clients through the channel many businesses already use every day.',
    description:
      'Create professional invoices in naira, keep payment details clear and share invoice reminders through WhatsApp. Hip Homorrd is designed around practical invoice-to-payment workflows for independent professionals and small businesses.',
    pain:
      'Many Nigerian businesses already close sales and manage client conversations in WhatsApp, but payment records can become scattered between chats, bank alerts and manually created documents. Hip Homorrd keeps the invoice and its payment state together.',
    outcomes: [
      {
        title: 'NGN invoices',
        text: 'Create invoices in naira with clear totals, taxes, terms and balances for Nigerian clients.',
      },
      {
        title: 'WhatsApp sharing',
        text: 'Move invoice information into the communication channel many clients already use.',
      },
      {
        title: 'Partial payment tracking',
        text: 'Keep the amount received and the amount still outstanding visible on the same invoice.',
      },
    ],
    workflow: [
      {
        title: 'Create a naira invoice',
        text: 'Set your currency, client, services, tax and payment terms.',
      },
      {
        title: 'Share with the client',
        text: 'Use WhatsApp to send the invoice message and payment path.',
      },
      {
        title: 'Track what is left',
        text: 'Record or reflect payments so the outstanding balance remains clear.',
      },
    ],
    goodFor: [
      'You invoice Nigerian clients in naira.',
      'WhatsApp is already part of your sales or client-service workflow.',
      'You collect full or partial invoice payments.',
      'You want invoice records to remain separate from informal chat history.',
    ],
    faqs: [
      {
        q: 'Can I use Nigerian phone numbers?',
        a: 'Yes. The WhatsApp sharing workflow normalizes Nigerian numbers for direct wa.me links when a client number is available.',
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = pages[slug];

  return data
    ? {
        title: data.title,
        description: data.description,
        alternates: { canonical: `/whatsapp-invoicing/${slug}` },
      }
    : {};
}

export default async function WhatsAppSubpage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = pages[slug];

  if (!data) notFound();

  return <SeoSolutionPage data={data} />;
}
